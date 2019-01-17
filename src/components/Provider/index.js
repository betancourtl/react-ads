/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import { AdsContext } from '../context';
import bidManager from '../../utils/bidManager';
import timedPromise from '../../utils/timedPromise';
import {
  refresh,
  destroySlots,
  setTargeting,
  setCentering,
  enableServices,
  enableVideoAds,
  createGPTScript,
  collapseEmptyDivs,
  disableInitialLoad,
  enableSingleRequest,
  enableAsyncRendering,
} from '../../utils/googletag';

class Provider extends Component {
  constructor(props) {
    super(props);
    const { gpt } = props;
    if (!props.enableAds) return;
    this.pubsub = props.pubsub;
    this.slotCount = {};
    this.initGPT();
    this.bidManager = bidManager({
      refresh: gpt.refresh,
      chunkSize: props.chunkSize,
      bidTimeout: props.bidTimeout,
      bidProviders: props.bidProviders,
      refreshDelay: props.refreshDelay,
      onBiddersReady: fn => this.pubsub.on('bidders-ready', fn),
    });
    this.initBidders();
  }

  /**
   * Initializes GPT.
   * @function
   * @returns {void}
   */
  initGPT = () => {
    const { props } = this;
    const { gpt } = props;
    gpt.createGPTScript();
    gpt.setCentering(props.setCentering);
    gpt.enableVideoAds(props.enableVideoAds);
    gpt.collapseEmptyDivs(props.collapseEmptyDivs);
    gpt.enableAsyncRendering(true);
    gpt.enableSingleRequest(true);
    gpt.disableInitialLoad(true);
    gpt.setTargeting(props.targeting);
    gpt.enableServices();
    gpt.destroySlots();
  }

  /**
   * It calls the bidProvider's init fns and when the bidders are ready it lets 
   * the bidManager know that it can start bidding.
   * @function
   * @returns {void}
   */
  initBidders = () => {
    if (!this.props.bidProviders.length) this.pubsub.emit('bidders-ready', true);
    else {
      timedPromise(
        this.props.bidProviders.map(bidder => bidder._init()),
        this.props.initTimeout
      )
        .catch(err => console.log('Error initializing bidders', err))
        .finally(() => this.pubsub.emit('bidders-ready', true));
    }
  }

  /**
   * Will generate the id for the adSlot.
   * @param {String} type
   * @returns {String}
   */
  generateId = (type = 'ad') => {
    this.slotCount[type];
    if (isNaN(this.slotCount[type])) this.slotCount[type] = 1;
    else this.slotCount[type] = this.slotCount[type] + 1;
    return `${type}${this.props.divider}${this.slotCount[type]}`;
  };

  componentWillUnmount() {
    if (!this.props.enableAds) return;
    this.pubsub.clear();
  }

  render() {
    return (
      <AdsContext.Provider value={{
        generateId: this.generateId,
        enableAds: this.props.enableAds,
        networkId: this.props.networkId,
        refresh: this.bidManager.refresh,
        adUnitPath: this.props.adUnitPath,
        bidHandler: this.props.bidHandler,
        lazyOffset: this.props.lazyOffset,
      }}
      >
        {this.props.children}
      </AdsContext.Provider>
    );
  }
}

Provider.defaultProps = {
  divider: '_',
  networkId: 0,
  chunkSize: 4,
  targeting: {},
  enableAds: true,
  lazyOffset: 800,
  bidProviders: [],
  bidTimeout: 1000,
  initTimeout: 350,
  refreshDelay: 200,
  setCentering: true,
  pubsub: new PubSub(),
  bidHandler: undefined,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  // GPT
  gpt: {
    refresh,
    setCentering,
    setTargeting,
    destroySlots,
    enableServices,
    enableVideoAds,
    createGPTScript,
    collapseEmptyDivs,
    disableInitialLoad,
    enableSingleRequest,
    enableAsyncRendering,
  }
};

Provider.propTypes = {
  divider: PropTypes.string,
  enableAds: PropTypes.bool,
  bidHandler: PropTypes.func,
  targeting: PropTypes.object,
  chunkSize: PropTypes.number,
  adUnitPath: PropTypes.string,
  bidTimeout: PropTypes.number,
  lazyOffset: PropTypes.number,
  setCentering: PropTypes.bool,
  bidProviders: PropTypes.array,
  initTimeout: PropTypes.number,
  refreshDelay: PropTypes.number,
  enableVideoAds: PropTypes.bool,
  collapseEmptyDivs: PropTypes.bool,
  pubsub: PropTypes.instanceOf(PubSub),
  networkId: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  gpt: PropTypes.shape({
    refresh: PropTypes.func.isRequired,
    destroySlots: PropTypes.func.isRequired,
    setCentering: PropTypes.func.isRequired,
    setTargeting: PropTypes.func.isRequired,
    enableServices: PropTypes.func.isRequired,
    createGPTScript: PropTypes.func.isRequired,
    collapseEmptyDivs: PropTypes.func.isRequired,
    disableInitialLoad: PropTypes.func.isRequired,
    enableSingleRequest: PropTypes.func.isRequired,
    enableAsyncRendering: PropTypes.func.isRequired,
  })
};

export default Provider;
