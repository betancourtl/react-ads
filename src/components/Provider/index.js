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
  createGoogleTagEvents,
} from '../../utils/googletag';

class Provider extends Component {
  constructor(props) {
    super(props);
    const { gpt } = props;
    if (!props.enableAds) return;
    this.slotCount = {};
    this.pubSub = new PubSub();
    gpt.createGPTScript();
    gpt.createGoogleTagEvents(this.pubSub);
    gpt.setCentering(props.setCentering);
    gpt.enableVideoAds(props.enableVideoAds);
    gpt.collapseEmptyDivs(props.collapseEmptyDivs);
    gpt.enableAsyncRendering(true);
    gpt.enableSingleRequest(true);
    gpt.disableInitialLoad(true);
    gpt.setTargeting(props.targeting);
    gpt.enableServices();
    gpt.destroySlots();
    this.bidManager = bidManager({
      refresh: gpt.refresh,
      chunkSize: props.chunkSize,
      bidTimeout: props.bidTimeout,
      bidProviders: props.bidProviders,
      refreshDelay: props.refreshDelay,
      // Fn to call when the bidders are ready.
      onBiddersReady: fn => this.pubSub.on('bidders-ready', fn),      
    });    
    // Wait x ammount of time for bidder init scripts to be ready.
    timedPromise(
      props.bidProviders.map(bidder => bidder._init()),
      props.initTimeout
    ).then(results => {
      results.forEach(x => {
        if (x.status === 'fulfilled') console.log('fulfilled', x.data);
        if (x.status === 'rejected') console.log('rejected', x.err);
        this.pubSub.emit('bidders-ready', true);
      });
    });

    // this.pubSub.on('refresh', () => { });
  }

  componentWillUnmount() {
    if (!this.props.enableAds) return;
    this.pubSub.clear();
  }

  /**
   * Will generate the id for the adSlot.
   * @param {String} type
   * @returns 
   */
  generateId = (type = 'ad') => {
    this.slotCount[type];
    if (isNaN(this.slotCount[type])) this.slotCount[type] = 1;
    else this.slotCount[type] = this.slotCount[type] + 1;
    return `${type}${this.props.divider}${this.slotCount[type]}`;
  };

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
    createGoogleTagEvents,
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
    createGoogleTagEvents: PropTypes.func.isRequired,
  })
};

export default Provider;
