/* eslint-disable no-console */
/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
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
  sizeMapping,
  destroySlots,
  getWindowWidth,
  addEventListener,
} from '../../utils/googletag';

class Ad extends Component {
  constructor(props) {
    super(props);
    // Do not run when SSR.
    if (typeof window === 'undefined') return;

    /**
     * Reference to the googletag GPT slot.
     * @type {Object}
     */
    this.slot = null;

    /**
     * List of event listener removing functions.
     * @type {Array}
     */
    this.listeners = [];

    /**
     * Flag to indicate that this slot has been displayed.
     * @type {Boolean}
     */
    this.displayed = false;

    /**
     * Flag to indicate that this slot has been refreshedOnce.
     * @type {Boolean}
     */
    this.refreshedOnce = false;

    /**
     * Will refresh the Ad when it is visible on the window.
     * @type {Function}
     */
    this.refreshWhenVisible = withRaf(this.refreshWhenVisible.bind(this));

    /**
     * Will refresh the Ad.
     * @type {Function}
     */
    this.refresh = this.refresh.bind(this);


    /**
     * The ad's unique id. We only want the id to be generated once, so we run
     * generateId in the constructor.
     *  @type {String}
     */
    this.id = props.id || props.generateId(props.type);
  }

  /**
   * Will return a flag that signal if an ad can be refreshed via a CustomEvent
   * or via an imperative event.
   * @function
   * @returns {Boolean}
   */
  get canRefresh() {
    return this.displayed;
  }

  /**
   * Get the slot map sizes based on the current media query breakpoint.
   * @function
   * @returns {Array}
   */
  get mapSize() {
    if (!this.props.sizeMap) return this.props.size;
    return this.props.sizeMap
      .filter(({ viewPort: [width] }) => width <= this.props.getWindowWidth())
      .sort((a, b) => a > b)
      .slice(0, 1)[0].slots;
  }

  /**
   * Will call the bidHandler function that generates the adUnit code.
   * @funtion
   * @returns {Function | Null}
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
  * Returns true if the slot is visible on the page. This is used for refreshing
  * lazy loaded ads.
  * @funtion
  * @returns {Boolean}
  */
  get isVisible() {
    return inViewport(this.ref, this.props.lazyOffset);
  }

  /**
   * Returns true when the parameter is a function.
   * @param {Function} maybeFn
   * @returns {Boolean}
   */
  isFunction = maybeFn => typeof maybeFn === 'function';

  /**
   * Will display this slot. With SRA disabled display will not fetch the ad.
   * @function
   * @returns {void}
   */
  display() {
    this.props.gpt.display(this.id);
    this.displayed = true;
  }

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
        type: 'display',
      }
    });
    this.refreshedOnce = true;
  }

  /**
   * Will trigger a refresh whenever this slot enters into a new breakpoint.
   * @funtion
   * @returns {void}
   */
  breakPointRefresh = () => {
    if (this.canRefresh) this.refresh();
  }

  /**
  * Event listener for lazy loaded ads that triggers the refresh function when
  * the ad becomes visible.
  * @function   
  * @returns {void}
  */
  refreshWhenVisible() {
    if (this.props.lazy && this.isVisible && !this.refreshedOnce) {
      this.define();
      window.removeEventListener('scroll', this.refreshWhenVisible);
    }
  }

  /**
   * Will collapse this ad whenever it is empty.
   * @function   
   * @returns {void}
   */
  setCollapseEmpty() {
    if (!this.props.setCollapseEmpty) return;
    this.slot.setCollapseEmptyDiv(true, true);
  }

  /**
   * Will set the targeting parameters for this ad.
   * @function   
   * @returns {void}
   */
  setTargeting() {
    Object
      .entries(this.props.targeting)
      .forEach(([k, v]) => this.slot.setTargeting(k, v));
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
      .reduce((acc, x) => acc.addSize(x.viewPort, x.slots), this.props.gpt.sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  }

  /**
   * Will listen to mediaQueries. This is used for hiding/refreshing ads on the 
   * page.
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
  }

  /**
   * Will remove the listeners from the page.
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
   * testing reasons.
   * @param {String} event
   * @param {Function} cb
   * @returns {void}
   */
  handleGPTEvent(event, cb) {
    if (this.isFunction(cb)) {
      this.props.gpt.addEventListener(event, e => {
        if (e.slot == this.slot) cb(this.withAdProps(e));
      });
    }
  }

  /**
   * Will listen to the onSlotOnload event and then call the passed function.
   * @function   
   * @returns {void}
   */
  onSlotOnload = () => this.handleGPTEvent(
    events.slotOnload,
    this.props.onSlotOnload
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

  /**
   * Will listen to the onSlotRequested event and then call the passed 
   * function.
   * @function   
   * @returns {void}
   */
  onSlotRequested = () => this.handleGPTEvent(
    events.slotRequested,
    this.props.onSlotRequested
  );

  /**
   * Will initialize the adSlot.
   * @function
   * @returns {void}
   */
  define() {
    this.props.gpt.cmdPush(() => {
      this.slot = this.props.gpt.define(
        this.props.outOfPageSlot,
        this.props.adUnitPath,
        this.mapSize,
        this.id
      );

      this.onSlotOnload();
      this.onSlotRenderEnded();
      this.onImpressionViewable();
      this.onSlotVisibilityChanged();
      this.onSlotRequested();

      // configures the slot.
      this.setMappingSize();
      this.setMQListeners();
      this.setCollapseEmpty();
      this.setTargeting();

      // display & fetches the slot.
      this.display();
      this.refresh();
    });
  }

  /**
   * Will refresh the ad when a CustomEvent is fired.
   * @function
   * @param {Object} option.detail.id - The id of the ad to refresh.
   * @returns {void}
   */
  handleCustomRefreshEvent = ({ detail }) => {
    if (detail.id !== this.id) return;

    if (!this.canRefresh) {
      console.log('Ad has to call window.googletag.display before triggering a refresh.');
      return;
    }

    this.refresh();
  }

  /**
   * Will trigger a manual refresh of this ad. The developer can call this via
   * document.querySelector('#ad-id').refresh();
   * @function
   * @returns {void}
   */
  imperativeRefresh = () => {
    if (!this.canRefresh) {
      console.log('Ad has to call window.googletag.display before triggering a refresh.');
      return;
    }

    this.refresh();
  }

  componentDidMount() {
    // Do not run when SSR.
    if (typeof window === 'undefined') return;

    this.ref.refresh = this.imperativeRefresh;
    window.addEventListener('refresh-ad', this.handleCustomRefreshEvent);

    if (!this.props.lazy) this.define();
    else {
      this.refreshWhenVisible();
      window.addEventListener('scroll', this.refreshWhenVisible);
    }
  }

  componentWillUnmount() {
    // Do not run when SSR.
    if (typeof window === 'undefined') return;

    this.unsetMQListeners();
    window.removeEventListener('scroll', this.refreshWhenVisible);
    window.removeEventListener('refresh-ad', this.handleCustomRefreshEvent);
    this.props.gpt.destroySlots(this.slot);
  }

  render() {
    if (typeof window === 'undefined') return null;
    return (
      <div
        id={this.id}
        ref={ref => this.ref = ref}
        style={{ ...this.props.style }}
        className={this.props.className}
        data-react-ad
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
  className: '',
  sizeMap: null,
  targeting: {},
  adUnitPath: '',
  getWindowWidth,
  lazyOffset: -1,
  type: 'default',
  bidHandler: null,
  onSlotOnload: null,
  outOfPageSlot: false,
  networkId: undefined,
  onSlotRequested: null,
  onSlotRenderEnded: null,
  setCollapseEmpty: false,
  onImpressionViewable: null,
  onSlotVisibilityChanged: null,
  gpt: {
    define,
    display,
    cmdPush,
    sizeMapping,
    destroySlots,
    addEventListener,
  }
};

Ad.propTypes = {
  lazy: PropTypes.bool,
  type: PropTypes.string,
  refresh: PropTypes.func,
  style: PropTypes.object,
  bidHandler: PropTypes.func,
  priority: PropTypes.number,
  className: PropTypes.string,
  networkId: PropTypes.number,
  targeting: PropTypes.object,
  lazyOffset: PropTypes.number,
  onSlotOnload: PropTypes.func,
  outOfPageSlot: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onSlotRequested: PropTypes.func,
  setCollapseEmpty: PropTypes.bool,
  onSlotRenderEnded: PropTypes.func,
  onImpressionViewable: PropTypes.func,
  generateId: PropTypes.func.isRequired,
  adUnitPath: PropTypes.string.isRequired,
  onSlotVisibilityChanged: PropTypes.func,
  getWindowWidth: PropTypes.func.isRequired,
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
  gpt: PropTypes.shape({
    define: PropTypes.func.isRequired,
    cmdPush: PropTypes.func.isRequired,
    display: PropTypes.func.isRequired,
    sizeMapping: PropTypes.func.isRequired,
    destroySlots: PropTypes.func.isRequired,
    addEventListener: PropTypes.func.isRequired,
  }),
};

const MaybeHiddenAd = hideHOC(Ad);

export const stateToProps = ({ adUnitPath, generateId, lazyOffset, networkId, bidHandler, ...rest }, props) => {
  const withSlash = x => x ? '/'.concat(x) : x;

  const _networkId = props.networkId || networkId;
  const _adUnitPath = [
    _networkId,
    props.adUnitPath || adUnitPath
  ]
    .map(x => withSlash(x))
    .join('');
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
};

export {
  Ad,
  MaybeHiddenAd,
};

export default connect(AdsContext, stateToProps)(MaybeHiddenAd);
