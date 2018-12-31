import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import connect from '../connector';
import inViewport from './inViewport';
import { AdsContext } from '../context';

class Ad extends Component {
  constructor(props) {
    super(props);
    if (!props.provider.enableAds) return;

    /**
     * Reference the the googletag GPT slot.
     * @type {Object}
     */
    this.slot = null;

    /**
     * Reference the the googletag GPT slot.
     * @type {Boolean}
     */
    this.displayed = false;

    /**
     * List of event listener removing functions.
     * @type {Array}
     */
    this.listeners = [];

    /**
     * Will call setState if the component is not unmounted.
     * @type {Function}
     */
    this._setState = (props, cb) => {
      if (this.unmounted) return;
      this.setState(props, cb);
    };

    /**
     * The generated slotId.
     * @type {String}
     */
    this.id = props.id || props.provider.generateId(props.type);
  }

  /**
   * Will get the adUnitPath from the Provider by default.
   * If the Ad has an unit path then it will override the providers adUnitPath
   * for this slot.
   * @function
   * @returns {String}
   */
  get adUnitPath() {
    const networkId = this.props.provider.networkId;

    return this.props.adUnitPath
      ? ['', networkId, this.props.adUnitPath].join('/')
      : ['', networkId, this.props.provider.adUnitPath].join('/');
  }

  /**
   * Gets the offset defined by the provider. If this ad receives a lazyOffset
   * prop then it will override the providers value.
   * @function
   * @returns {Number}
   */
  get lazyOffset() {
    return this.props.lazyOffset && this.props.lazyOffset >= 0 
      ? this.props.lazyOffset
      : this.props.provider.lazyOffset;
  }

  /**
   * Will define this slot on the page.
   * @function   
   * @returns {void}
   */
  defineSlot = () => {
    this.slot = this.props.outOfPageSlot
      ? window.googletag.defineOutOfPageSlot(this.adUnitPath, this.id)
      : window.googletag.defineSlot(this.adUnitPath, this.mapSize, this.id);
  };

  /**
   * Will display this slot. With SRA disabled display will not fetch the ad.
   * @function
   * @returns {void}
   */
  display = () => window.googletag.display(this.id);

  /**
   * Get the slot map sizes based on the media query breakpoints
   * @function
   * @returns {Array}
   */
  get mapSize() {
    if (!this.props.sizeMapping) return this.props.size;
    try {
      return this.props.sizeMapping
        .filter(({ viewPort: [width] }) => width <= window.innerWidth)
        .sort((a, b) => a > b)
        .slice(0, 1)[0].slots;
    } catch (err) {
      console.log('Could not get the correct sizes from the sizeMapping array');
      return this.props.size;
    }
  }

  /**
   * Will refresh this slot using the refresh funtion passed bythe provider
   * component.
   * @function   
   * @returns {void}
   */
  refresh = () => {
    this.props.provider.refresh({
      priority: this.props.priority,
      data: {
        bidderCode: this.props.bidderCode ? this.props.bidderCode(this.id, this.mapSize) : null,
        slot: this.slot,
      }
    });
  }

  /**
   * Will trigger a refresh whenever it this slots enters in a new breakpoint
   * specified on the sizeMappings.
   * @funtion
   * @returns {void}
   */
  breakPointRefresh = () => {
    if (!this.displayed) return;
    this.refresh();
  }

  /**
   * Return true if the slot is visible on the page. This is used for refreshing
   * lazy loaded ads.
   * @funtion
   * @returns {Boolean}
   */
  get isVisible() {
    return inViewport(ReactDOM.findDOMNode(this), this.lazyOffset);
  }

  /**
  * Event listener for lazy loaded ads that triggers the refresh function when
  * the ad becomes visible.
  * @function   
  * @returns {void}
  */
  refreshWhenVisible = () => {
    if (this.isVisible) {
      this.define();
      window.removeEventListener('scroll', this.refreshWhenVisible);
    }
  };

  /**
   * Will destroy this slot from the page.
   * @function   
   * @returns {void}
   */
  destroyAd = () => window.googletag.destroySlots([this.slot]);

  /**
   * Will enable the pubads service for this slot.
   * @function   
   * @returns {void}
   */
  addService = () => this.slot.addService(window.googletag.pubads());

  /**
   * Will collapse this ad whenever it is empty.
   * @function   
   * @returns {void}
   */
  setCollapseEmpty = () => {
    if (!this.props.setCollapseEmpty) return;
    this.slot.setCollapseEmptyDiv(true, true)
  };

  /**
   * Will set the targeting parameters for this ad.
   * @function   
   * @returns {void}
   */
  setTargeting = () => Object
    .entries(this.props.targeting)
    .map(([k, v]) => this.slot.setTargeting(k, v));

  /**
   * Will create the sizeMaps that will show the different ads depending on the
   * viewport size.
   * @function   
   * @returns {void}
   */
  setMappingSize = () => {
    if (!this.props.sizeMapping) return;
    const mapping = this
      .props.sizeMapping.reduce((acc, x) => acc.addSize(x.viewPort, x.slots), window.googletag.sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  };

  /**
   * Will listen to mediaQueries for hiding/refreshing ads on the page.
   * @function   
   * @returns {void}
   */
  setMQListeners = () => {
    if (!this.props.sizeMapping) return;
    this.props.sizeMapping.forEach(({ viewPort: [width] }) => {
      const mq = window.matchMedia(`(max-width: ${width}px)`);
      mq.addListener(this.breakPointRefresh);

      this.listeners.push(() => mq.removeListener(this.breakPointRefresh));
    });
  };

  /**
   * Will remove the listener from the page.
   * @function   
   * @returns {void}
   */
  unsetMQListeners = () => {
    this.listeners.forEach(fn => fn());
  };

  /**
   * Returns the id and the reference to this slot.
   * @function
   * @returns {void}
   */
  withAdProps = (props) => ({
    id: this.id,
    ref: this.ref,
    ...props,
  });

  /**
   * Will listen to the slotRenderEnded event and then call the passed function.
   * @function   
   * @returns {void}
   */
  slotRenderEnded = () => {
    if (typeof this.props.onSlotRenderEnded !== 'function') return;

    window.googletag.pubads().addEventListener('slotRenderEnded', e => {
      if (e.slot === this.slot) this.props.onSlotRenderEnded(this.withAdProps(e));
    });
  };

  /**
   * Will listen to the impressionViewable event and then call the passed 
   * function.
   * @function   
   * @returns {void}
   */
  impressionViewable = () => {
    if (typeof this.props.onImpressionViewable !== 'function') return;
    window.googletag.pubads().addEventListener('impressionViewable', e => {
      if (e.slot === this.slot) this.props.onImpressionViewable(this.withAdProps(e));
    });
  };

  /**
   * Will listen to the slotVisibilityChanged event and then call the passed 
   * function.
   * @function   
   * @returns {void}
   */
  slotVisibilityChanged = () => {
    if (typeof this.props.onSlotVisibilityChanged !== 'function') return;
    window.googletag.pubads().addEventListener('slotVisibilityChanged', e => {
      if (e.slot === this.slot) this.props.onSlotVisibilityChanged(this.withAdProps(e));
    });
  };

  /**
   * Will listen to the slotOnload event and then call the passed function.
   * @function   
   * @returns {void}
   */
  slotOnload = () => {
    window.googletag.pubads().addEventListener('slotOnload', e => {
      if (typeof this.props.onSlotOnLoad === 'function') {
        if (e.slot === this.slot) this.props.onSlotOnLoad(this.withAdProps(e));
      }
    });
  };

  define = () => {
    window.googletag.cmd.push(() => {
      // event start
      this.defineSlot();
      this.slotOnload();
      this.slotRenderEnded();
      this.impressionViewable();
      this.slotVisibilityChanged();
      // events end
      this.setMappingSize();
      this.setMQListeners();
      this.setCollapseEmpty();
      this.addService();
      this.setTargeting();
      this.display();
      this.displayed = true;
      this.refresh();
    });
  }

  componentDidMount() {
    if (!this.props.provider.enableAds) return;
    if (!this.props.lazy) {
      this.define();
    } else {            
      window.addEventListener('scroll', this.refreshWhenVisible);
      this.refreshWhenVisible();
    }
  }

  componentWillUnmount() {
    if (!this.props.provider.enableAds) return;
    this.unmounted = true;
    this.unsetMQListeners();
    window.removeEventListener('scroll', this.refreshWhenVisible);
    window.googletag.cmd.push(this.destroyAd);
  }

  render() {
    if (!this.props.provider.enableAds) return null;
    return (
      <div
        id={this.id}
        ref={ref => this.ref = ref}
        className={this.props.className}
        style={{ ...this.props.style }}
      />
    );
  }
}

Ad.defaultProps = {
  id: '',
  style: {},
  lazy: false,
  priority: 1,
  targeting: {},
  adUnitPath: '',
  className: null,
  type: 'default',
  size: [300, 250],
  onSlotOnLoad: null,
  outOfPageSlot: false,
  lazyOffset: -1,
  setCollapseEmpty: false,
  onSlotRenderEnded: null,
  onImpressionViewable: null,
  onSlotVisibilityChanged: null,
};

Ad.propTypes = {
  lazy: PropTypes.bool,
  type: PropTypes.string,
  style: PropTypes.object,
  lazyOffset: PropTypes.number,
  className: PropTypes.string,
  targeting: PropTypes.object,
  prebidCode: PropTypes.object,
  onSlotOnLoad: PropTypes.func,
  outOfPageSlot: PropTypes.bool,
  id: PropTypes.string.isRequired,
  setCollapseEmpty: PropTypes.bool,
  onSlotRenderEnded: PropTypes.func,
  onImpressionViewable: PropTypes.func,
  onSlotVisibilityChanged: PropTypes.func,
  adUnitPath: PropTypes.string.isRequired,
  priority: PropTypes.number,
  size: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
  ]),
  sizeMapping: PropTypes.arrayOf(
    PropTypes.shape({
      viewPort: PropTypes.arrayOf(PropTypes.number),
      slots: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
      ])
    })
  ),
  provider: PropTypes.shape({
    refresh: PropTypes.func,
    enableAds: PropTypes.bool,
    adUnitPath: PropTypes.string,
    generateId: PropTypes.func.isRequired,
    networkId: PropTypes.number.isRequired,
  })
};

const AdWithProvider = connect(AdsContext, Ad, 'provider');

export default AdWithProvider;
