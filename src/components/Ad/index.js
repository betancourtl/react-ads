import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import hideHOC from '../../hoc/hide';
import { AdsContext } from '../context';
import connect from '../../hoc/connector';
import withRaf from '../../utils/withRaf';
import inViewport from '../../utils/inViewport';
import {
  events,
  define,
  display,
  cmdPush,
  destroyAd,
  sizeMapping,
  getWindowWidth,
  addEventListener,
} from '../../utils/googletag';

class Ad extends Component {
  constructor(props) {
    super(props);

    /**
     * Reference the the googletag GPT slot.
     * @type {Object}
     */
    this.slot = null;

    /**
     * List of event listener removing functions.
     * @type {Array}
     */
    this.listeners = [];

    /**
     * Reference the googletag GPT slot.
     * @type {Boolean}
     */
    this.displayed = false;

    /**
     * Reference the the googletag GPT slot.
     * @type {Boolean}
     */
    this.refreshed = false;

    /**
     * Will refresh the Ad when it is visible on the window.
     * @type {Function}
     */
    this.refreshWhenVisible = withRaf(this.refreshWhenVisible.bind(this));

    /**
     * The ad's unique id. We only want the Id to be generated once.
     */
    this.id = props.id || props.generateId(props.type);
  }
  /**
   * Get the slot map sizes based on the media query breakpoints
   * @function
   * @returns {Array}
   */
  get mapSize() {
    if (!this.props.sizeMap) return this.props.size;
    try {
      return this.props.sizeMap
        .filter(({ viewPort: [width] }) => width <= this.props.getWindowWidth())
        .sort((a, b) => a > b)
        .slice(0, 1)[0].slots;
    } catch (err) {
      console.log('Could not get the correct sizes from the sizeMapping array');
      return this.props.size;
    }
  }

  /**
   * Will call the bidder function.
   * @funtion
   * @returns {Function | Object}
   */
  get bidHandler() {
    return this.props.bidHandler
      ? this.props.bidHandler({
        id: this.id,
        sizes: this.mapSize,
      })
      : null;
  }

  /**
  * Return true if the slot is visible on the page. This is used for refreshing
  * lazy loaded ads.
  * @funtion
  * @returns {Boolean}
  */
  get isVisible() {
    return inViewport(
      ReactDOM.findDOMNode(this),
      this.props.lazyOffset
    );
  }

  /**
   * Returns true when the parameter is a function.
   * @param {Function} maybeFn
   * @returns {Boolean}
   */
  isFunction = maybeFn => typeof maybeFn === 'function';

  /**
   * Will define this slot on the page.
   * @function   
   * @returns {void}
   */
  defineSlot = () => {
    this.slot = this.props.define(
      this.props.outOfPageSlot,
      this.props.adUnitPath,
      this.mapSize,
      this.id
    );
  };

  /**
   * Will display this slot. With SRA disabled display will not fetch the ad.
   * @function
   * @returns {void}
   */
  display() {
    this.props.display(this.id);
    this.displayed = true;
  };

  /**
   * Will refresh this slot using the refresh function passed by the provider.
   * component.
   * @function   
   * @returns {void}
   */
  refresh() {
    this.props.refresh({
      priority: this.props.priority,
      data: {
        bids: this.bidHandler,
        slot: this.slot,
      }
    });
    this.refreshed = true;
  }

  /**
   * Will trigger a refresh whenever it this slots enters in a new breakpoint
   * specified on the sizeMap.
   * @funtion
   * @returns {void}
   */
  breakPointRefresh = () => {
    if (!this.displayed) return;
    this.refresh();
  }

  /**
  * Event listener for lazy loaded ads that triggers the refresh function when
  * the ad becomes visible.
  * @function   
  * @returns {void}
  */
  refreshWhenVisible() {
    if (this.isVisible && !this.refreshed) {
      this.props.cmdPush(this.define);
      window.removeEventListener('scroll', this.refreshWhenVisible);
    }
  };

  /**
   * Will collapse this ad whenever it is empty.
   * @function   
   * @returns {void}
   */
  setCollapseEmpty() {
    if (!this.props.setCollapseEmpty) return;
    this.slot.setCollapseEmptyDiv(true, true);
  };

  /**
   * Will set the targeting parameters for this ad.
   * @function   
   * @returns {void}
   */
  setTargeting() {
    Object
      .entries(this.props.targeting)
      .map(([k, v]) => this.slot.setTargeting(k, v));
  }

  /**
   * Will create the sizeMaps that will show the different ads depending on the
   * viewport size.
   * @function   
   * @returns {void}
   */
  setMappingSize() {
    if (!this.props.sizeMap) return;
    const mapping = this.props.sizeMap
      .reduce((acc, x) => acc.addSize(x.viewPort, x.slots), sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  };

  /**
   * Will listen to mediaQueries for hiding/refreshing ads on the page.
   * @function   
   * @returns {void}
   */
  setMQListeners() {
    if (!this.props.sizeMap) return;
    this.props.sizeMap.forEach(({ viewPort: [width] }) => {
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
  unsetMQListeners() {
    this.listeners.forEach(fn => fn());
  }

  /**
   * Returns the id and the reference to this slot.
   * @function
   * @returns {Object}
   */
  withAdProps = props => ({
    id: this.id,
    ref: this.ref,
    ...props,
  });

  /**
   * Will handle a GPT event for this slot. This method was not auto-binded for 
   * testing reases.
   * @param {String} event
   * @param {Function} cb - Callback function for the event.
   * @returns {void}
   */
  handleGPTEvent(event, cb) {
    if (!this.isFunction(cb)) return;
    this.props.addEventListener(event, e => {
      if (e.slot !== this.slot) return;
      cb(this.withAdProps(e));
    });
  }

  /**
   * Will listen to the slotOnload event and then call the passed function.
   * @function   
   * @returns {void}
   */
  onSlotOnload = () => this.handleGPTEvent(
    events.slotOnLoad,
    this.props.onSlotOnLoad
  );

  /**
   * Will listen to the onSlotRenderEnded event and then call the passed 
   * function.
   * @function   
   * @returns {void}
   */
  onSlotRenderEnded = () => this.handleGPTEvent(
    events.slotRenderEnded,
    this.props.onSlotRenderEnded
  );

  /**
   * Will listen to the onImpressionViewable event and then call the passed 
   * function.
   * @function   
   * @returns {void}
   */
  onImpressionViewable = () => this.handleGPTEvent(
    events.impressionViewable,
    this.props.onImpressionViewable
  );

  /**
   * Will listen to the onSlotVisibilityChanged event and then call the passed 
   * function.
   * @function   
   * @returns {void}
   */
  onSlotVisibilityChanged = () => this.handleGPTEvent(
    events.slotVisibilityChanged,
    this.props.onSlotVisibilityChanged
  );

  define = () => {
    this.props.cmdPush(() => {
      // event start
      this.defineSlot();
      this.onSlotOnload();
      this.onSlotRenderEnded();
      this.onImpressionViewable();
      this.onSlotVisibilityChanged();

      //configure slot
      this.setMappingSize();
      this.setMQListeners();
      this.setCollapseEmpty();
      this.setTargeting();

      // display & fetch slot
      this.display();
      this.refresh();
    });
  }

  componentDidMount() {
    if (!this.props.lazy) {
      this.define();
    } else {
      this.refreshWhenVisible();
      window.addEventListener('scroll', this.refreshWhenVisible);
    }
  }

  componentWillUnmount() {
    this.unsetMQListeners();
    window.removeEventListener('scroll', this.refreshWhenVisible);
    this.props.destroyAd(this.slot);
  }

  render() {
    return (
      <div
        id={this.id}
        ref={ref => this.ref = ref}
        style={{ ...this.props.style }}
        className={this.props.className}
      />
    );
  }
}

Ad.defaultProps = {
  id: '',
  size: [],
  style: {},
  lazy: false,
  priority: 1,
  sizeMap: null,
  targeting: {},
  adUnitPath: '',
  lazyOffset: -1,
  className: '',
  type: 'default',
  bidHandler: null,
  onSlotOnLoad: null,
  outOfPageSlot: false,
  networkId: undefined,
  setCollapseEmpty: false,
  onSlotRenderEnded: null,
  onImpressionViewable: null,
  onSlotVisibilityChanged: null,
  // gpt events
  define: define,
  display: display,
  cmdPush: cmdPush,
  destroyAd: destroyAd,
  sizeMapping: sizeMapping,
  getWindowWidth: getWindowWidth,
  addEventListener: addEventListener,
};

Ad.propTypes = {
  lazy: PropTypes.bool,
  type: PropTypes.string,
  style: PropTypes.object,
  bidHandler: PropTypes.func,
  className: PropTypes.string,
  networkId: PropTypes.number,
  targeting: PropTypes.object,
  lazyOffset: PropTypes.number,
  onSlotOnLoad: PropTypes.func,
  outOfPageSlot: PropTypes.bool,
  id: PropTypes.string.isRequired,
  setCollapseEmpty: PropTypes.bool,
  onSlotRenderEnded: PropTypes.func,
  onImpressionViewable: PropTypes.func,
  generateId: PropTypes.func.isRequired,
  adUnitPath: PropTypes.string.isRequired,
  onSlotVisibilityChanged: PropTypes.func,
  priority: PropTypes.number,
  size: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
  ]),
  sizeMap: PropTypes.arrayOf(
    PropTypes.shape({
      viewPort: PropTypes.arrayOf(PropTypes.number),
      slots: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
      ])
    })
  ),
  refresh: PropTypes.func,
  adUnitPath: PropTypes.string,
  define: PropTypes.func.isRequired,
  display: PropTypes.func.isRequired,
  cmdPush: PropTypes.func.isRequired,
  destroyAd: PropTypes.func.isRequired,
  networkId: PropTypes.number.isRequired,
  sizeMapping: PropTypes.func.isRequired,
  getWindowWidth: PropTypes.func.isRequired,
  addEventListener: PropTypes.func.isRequired,
};

const MaybeHiddenAd = hideHOC(Ad);

const stateToProps = ({ adUnitPath, generateId, lazyOffset, networkId, bidHandler, ...rest }, props) => {
  const _networkId = props.networkId || networkId;
  const _adUnitPath = adUnitPath
    ? ['', _networkId, adUnitPath].join('/')
    : ['', _networkId, props.adUnitPath].join('/');
  const _lazyOffset = props.lazyOffset && props.lazyOffset >= 0
    ? props.lazyOffset
    : lazyOffset;
  const results = {
    adUnitPath: _adUnitPath,
    networkId: _networkId,
    lazyOffset: _lazyOffset,
    generateId,
    ...rest
  };

  if (bidHandler && props.bidHandler) results.bidHandler = x => props.bidHandler(x, bidHandler(x));
  else if (bidHandler) results.bidHandler = x => bidHandler(x, []);
  else if (props.bidHandler) results.bidHandler = x => props.bidHandler(x, []);

  return results;
}

export {
  Ad,
  MaybeHiddenAd,
};

export default connect(AdsContext, stateToProps)(MaybeHiddenAd);
