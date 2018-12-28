import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AdsContext } from '../context';
import connect from '../connector';
import inViewport from '../../utils/inViewport';

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
    this._setState = (props) => {
      if (this.unmounted) return;
      this.setState(props);
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
   * google command queue wrapper fn.
   * @function
   * @callback cb - Callback to be pushed to the queue.
   */
  cmdPush = (cb) => () => window.googletag.cmd.push(cb);

  /**
   * Will define this slot on the page.
   * @function   
   * @returns {void}
   */
  defineSlot = () => {
    window.googletag.cmd.push(() => {
      this.slot = this.props.outOfPageSlot
        ? window.googletag.defineOutOfPageSlot(this.adUnitPath, this.props.id)
        : window.googletag.defineSlot(this.adUnitPath, this.props.size, this.props.id);
    });
  };

  /**
   * Will refresh this slot.
   * @function   
   * @returns {void}
   */
  refresh = this.cmdPush(() => window.googletag.pubads().refresh([this.slot]));

  /**
   * Will destroy this slot from the page.
   * @function   
   * @returns {void}
   */
  destroyAd = this.cmdPush(() => window.googletag.destroySlots([this.slot]));

  /**
   * Will enable the pubads service.
   * @function   
   * @returns {void}
   */
  addService = this.cmdPush(() => this.slot.addService(window.googletag.pubads()));

  /**
   * Will collapse this ad wheneverit is empty.
   * @function   
   * @returns {void}
   */
  setCollapseEmpty = this.cmdPush(() => {
    if (!this.props.setCollapseEmpty) return;
    this.slot.setCollapseEmptyDiv(true, true)
  });

  /**
   * Will set the targeting parameters for this ad.
   * @function   
   * @returns {void}
   */
  setTargeting = this.cmdPush(() => Object.entries(this.props.targeting)
    .map(([k, v]) => this.slot.setTargeting(k, v)));


  /**
   * Will listen to mediaQueries for hiding/refreshing ads on the page.
   * @function   
   * @returns {void}
   */
  setMQListeners = this.cmdPush(() => {
    if (!this.props.sizeMapping) return;
    this.props.sizeMapping.forEach(({ viewPort: [width] }) => {
      const mq = window.matchMedia(`(max-width: ${width}px)`);
      mq.addListener(this.refresh);

      this.listeners.push(() => mq.removeListener(this.refresh));
    });
  });

  /**
   * Will remove the listener from the page.
   * @function   
   * @returns {void}
   */
  unsetMQListeners = this.cmdPush(() => {
    this.listeners.forEach(fn => fn());
  });

  /**
   * Will create the sizeMaps that will show the different ads depending on the
   * viewport size.
   * @function   
   * @returns {void}
   */
  setMappingSize = this.cmdPush(() => {
    if (!this.props.sizeMapping) return;
    const mapping = this.props.sizeMapping.reduce((acc, x) => acc.addSize(x.viewPort, x.slots), window.googletag.sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  });

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
  slotRenderEnded = this.cmdPush(() => {   
    if (typeof this.props.onSlotRenderEnded !== 'function') return;

    window.googletag.pubads().addEventListener('slotRenderEnded', e => {
      if (e.slot === this.slot) this.props.onSlotRenderEnded(this.withAdProps(e));
    });
  });

  /**
   * Will listen to the impressionViewable event and then call the passed function.
   * @function   
   * @returns {void}
   */
  impressionViewable = this.cmdPush(() => {
    if (typeof this.props.onImpressionViewable !== 'function') return;
    window.googletag.pubads().addEventListener('impressionViewable', e => {
      if (e.slot === this.slot) this.props.onImpressionViewable(this.withAdProps(e));
    });
  });

  /**
   * Will listen to the slotVisibilityChanged event and then call the passed function.
   * @function   
   * @returns {void}
   */
  slotVisibilityChanged = this.cmdPush(() => {
    if (typeof this.props.onSlotVisibilityChanged !== 'function') return;
    window.googletag.pubads().addEventListener('slotVisibilityChanged', e => {
      if (e.slot === this.slot) this.props.onSlotVisibilityChanged(this.withAdProps(e));
    });
  });

  /**
   * Will listen to the slotOnload event and then call the passed function.
   * @function   
   * @returns {void}
   */
  slotOnload = this.cmdPush(() => {
    window.googletag.pubads().addEventListener('slotOnload', e => {
      if (typeof this.props.onSlotOnLoad === 'function') {
        if (e.slot === this.slot) this.props.onSlotOnLoad(this.withAdProps(e));
      }
    });
  });

  /**
   * Callback that handles defining/configuring this ad.
   * @function   
   * @returns {void}
   */
  onDefine = () => {
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
    
    return this.slot;
  }

  /**
   * Callback that gets triggered whenever this ad gets displayed.
   * @function   
   * @returns {void}
   */
  onDisplay = () => this.setState({ displayed: true }, () => {
    this.props.lazy 
    ? this.refreshWhenVisible()
    : this.props.provider.refresh(this.slot);
  });

  /**
   * Event listener for lazy loaded ads that triggers the refresh function when
   * the ad becomes visible.
   * @function   
   * @returns {void}
   */
  refreshWhenVisible = () => {
    if (this.state.displayed) {
      const isVisible = inViewport(ReactDOM.findDOMNode(this));
      if (isVisible) {
        this.props.provider.refresh(this.slot);
        window.removeEventListener('scroll', this.refreshWhenVisible);
      }      
    }
  };

  componentDidMount() {
    const message = {
      type: this.props.lazy ? 'LAZY' : 'INITIAL',
      level: this.props.priority,
      data: {
        onDefine: this.onDefine,
        onDisplay: this.onDisplay,
        id: this.props.id,
      }
    };
    
    this.props.provider.define(message);
    if (this.props.lazy) window.addEventListener('scroll', this.refreshWhenVisible);
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.destroyAd();
    this.unsetMQListeners();
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
