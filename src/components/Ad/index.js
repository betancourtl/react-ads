import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AdsContext } from '../context';
import connect from '../connector';
import inViewport from './inViewport';

class Ad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /** 
       * Will return true when the ad gets defined.
       * @type {Boolean} 
       */
      displayed: false,
    };
    /**
     * Reference the the googletag GPT slot.
     * @type {object}
     */
    this.slot = null;
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
  }

  /**
   * Will get the adUnitPath from the Provider by default.
   * If the Ad has an unit path then it will override the parent.
   */
  get adUnitPath() {
    const networkId = this.props.provider.networkId;

    return this.props.adUnitPath
      ? ['', networkId, this.props.adUnitPath].join('/')
      : ['', networkId, this.props.provider.adUnitPath].join('/');
  }

  /**
   * Will define this slot on the page.
   * @function   
   * @returns {void}
   */
  defineSlot = () => {
    this.slot = this.props.outOfPageSlot
      ? window.googletag.defineOutOfPageSlot(this.adUnitPath, this.props.id)
      : window.googletag.defineSlot(this.adUnitPath, this.props.size, this.props.id);
  };

  display = () => window.googletag.display(this.props.id);

  /**
   * Will refresh this slot.
   * @function   
   * @returns {void}
   */
  refresh = () => this.props.provider.refresh({
    priority: this.props.priority,
    data: {
      bidderCode: this.props.bidderCode,
      slot: this.slot,
    }
  });

  /**
   * Will destroy this slot from the page.
   * @function   
   * @returns {void}
   */
  destroyAd = () => window.googletag.destroySlots([this.slot]);

  /**
   * Will enable the pubads service.
   * @function   
   * @returns {void}
   */
  addService = () => this.slot.addService(window.googletag.pubads());

  /**
   * Will collapse this ad wheneverit is empty.
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
  setTargeting = () => Object.entries(this.props.targeting)
    .map(([k, v]) => this.slot.setTargeting(k, v));

  /**
   * Will listen to mediaQueries for hiding/refreshing ads on the page.
   * @function   
   * @returns {void}
   */
  setMQListeners = () => {
    if (!this.props.sizeMapping) return;
    this.props.sizeMapping.forEach(({ viewPort: [width] }) => {
      const mq = window.matchMedia(`(max-width: ${width}px)`);
      mq.addListener(this.refresh);

      this.listeners.push(() => mq.removeListener(this.refresh));
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
   * Will create the sizeMaps that will show the different ads depending on the
   * viewport size.
   * @function   
   * @returns {void}
   */
  setMappingSize = () => {
    if (!this.props.sizeMapping) return;
    const mapping = this.props.sizeMapping.reduce((acc, x) => acc.addSize(x.viewPort, x.slots), window.googletag.sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  };

  withAdProps = (props) => ({
    id: this.props.id,
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
   * Will listen to the impressionViewable event and then call the passed function.
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
   * Will listen to the slotVisibilityChanged event and then call the passed function.
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

  /**
   * Event listener for lazy loaded ads that triggers the refresh function when
   * the ad becomes visible.
   * @function   
   * @returns {void}
   */
  refreshWhenVisible = () => {
    const isVisible = inViewport(ReactDOM.findDOMNode(this));
    if (isVisible) {
      this.refresh();
      window.removeEventListener('scroll', this.refreshWhenVisible);
    }
  };

  componentDidMount() {
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
      if (this.props.lazy) {        
        window.addEventListener('scroll', this.refreshWhenVisible);
        this.refreshWhenVisible();
      } else {
        this.refresh();
      }
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.unsetMQListeners();
    window.removeEventListener('scroll', this.refreshWhenVisible);
    window.googletag.cmd.push(this.destroyAd);
  }

  render() {
    return (
      <div
        id={this.props.id}
        ref={ref => this.ref = ref}
        className={this.props.className}
        style={{ ...this.props.style }}
      />
    );
  }
}

Ad.defaultProps = {
  id: 'id',
  style: {},
  lazy: false,
  priority: 1,
  targeting: {},
  adUnitPath: '',
  className: null,
  size: [300, 250],
  onSlotOnLoad: null,
  outOfPageSlot: false,
  setCollapseEmpty: false,
  onSlotRenderEnded: null,
  onImpressionViewable: null,
  onSlotVisibilityChanged: null,
};

Ad.propTypes = {
  lazy: PropTypes.bool,
  style: PropTypes.object,
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
      slots: PropTypes.arrayOf(PropTypes.number)
    })
  ),
};

const AdWithProvider = connect(AdsContext, Ad, 'provider');

export default AdWithProvider;
