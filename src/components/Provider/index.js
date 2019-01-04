/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AdsContext } from '../context';
import PubSub from '../../lib/Pubsub';
import bidManager from '../../utils/bidManager';
import {
  setTargeting,
  setCentering,
  enableServices,
  enableVideoAds,
  createGPTScript,
  startGoogleTagQue,
  collapseEmptyDivs,
  disableInitialLoad,
  enableSingleRequest,
  enableAsyncRendering,
  createGoogleTagEvents,
} from '../../utils/googletag';

class Provider extends Component {
  constructor(props) {
    super(props);
    if (!props.enableAds) return;
    this.slotCount = {};
    this.pubSub = new PubSub();
    createGPTScript();
    startGoogleTagQue();
    props.bidProviders.forEach(bidder => bidder.init());
    createGoogleTagEvents(this.pubSub);

    this.bidManager = bidManager({
      bidProviders: props.bidProviders,
      bidTimeout: props.bidTimeout,
      refresh: ids => window.googletag.cmd.push(() => window.googletag.pubads().refresh(ids)),
      chunkSize: props.chunkSize,
      refreshDelay: props.refreshDelay,
    });
    
    this.pubSub.on('refresh', () => { });
    this.pubSub.on('display', () => { });
    this.pubSub.on('destroySlots', () => { });
    this.pubSub.on('defineSlot', () => { });

    setCentering(props.setCentering);
    enableVideoAds(props.enableVideoAds);
    collapseEmptyDivs(props.collapseEmptyDivs);
    enableAsyncRendering(true);
    enableSingleRequest(true);
    disableInitialLoad(true);
    setTargeting(props.targeting);
    enableServices();
    // This call to destroy all slots.
    window.googletag.cmd.push(window.googletag.destroySlots)
  }

  componentWillUnmount() {
    if (!this.props.enableAds) return;
    // Clears the event listener.
    this.pubSub.clear();
  }

  generateId = (type = 'ad') => {
    const count = this.slotCount[type]
      ? this.slotCount[type]++
      : this.slotCount[type] = 1;
    return `${type}${this.props.divider}${count}`;
  };

  render() {
    return (
      <AdsContext.Provider value={{
        generateId: this.generateId,
        enableAds: this.props.enableAds,
        networkId: this.props.networkId,
        adUnitPath: this.props.adUnitPath,
        lazyOffset: this.props.lazyOffset,
        bidHandler: this.props.bidHandler,
        refresh: !this.props.enableAds ? null : this.bidManager.refresh,
      }}>
        {this.props.children}
      </AdsContext.Provider>
    );
  }
}

Provider.defaultProps = {
  divider: '_',
  networkId: 0,
  prebid: null,
  chunkSize: 4,
  targeting: {},
  enableAds: true,
  lazyOffset: 400,
  bidProviders: [],
  bidHandler: null,
  bidTimeout: 1000,
  refreshDelay: 200,
  setCentering: true,
  enableVideoAds: false,
  collapseEmptyDivs: false,
};

Provider.propTypes = {
  prebid: PropTypes.func,
  divider: PropTypes.string,
  enableAds: PropTypes.bool,
  bidHandler: PropTypes.func,
  targeting: PropTypes.object,
  chunkSize: PropTypes.number,
  adUnitPath: PropTypes.string,
  lazyOffset: PropTypes.number,
  setCentering: PropTypes.bool,
  bidProviders: PropTypes.array,
  refreshDelay: PropTypes.number,
  enableVideoAds: PropTypes.bool,
  prebidTimeout: PropTypes.number,
  collapseEmptyDivs: PropTypes.bool,
  prebidFailsafeTimeout: PropTypes.number,
  networkId: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Provider;
