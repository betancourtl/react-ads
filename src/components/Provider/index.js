/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bidManager from '../../utils/bidManager';
import PubSub from '../../lib/Pubsub';
import { AdsContext } from '../context';
import { startPrebidQueue, getBids } from '../../utils/prebid';
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
    startPrebidQueue();
    if (props.prebid) props.prebid();
    createGoogleTagEvents(this.pubSub);

    this.bidManager = bidManager({
      getBids: getBids(this.props.prebidTimeout, this.props.prebidFailsafeTimeout),
      refresh: ids => window.googletag.cmd.push(() => window.googletag.pubads().refresh(ids)),
      chunkSize: props.chunkSize,
      refreshDelay: props.refreshDelay,
      prebidEnabled: typeof props.prebid === 'function',
    });

    this.pubSub.on('refresh', () => { });
    this.pubSub.on('display', () => { });
    this.pubSub.on('destroySlots', () => { });
    this.pubSub.on('defineSlot', () => { });

    setCentering(this.props.setCentering);
    enableVideoAds(this.props.enableVideoAds);
    collapseEmptyDivs(this.props.collapseEmptyDivs);
    enableAsyncRendering(true);
    enableSingleRequest(true);
    disableInitialLoad(true);
    setTargeting(this.props.targeting);
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
  bidHandler: null,
  refreshDelay: 200,
  setCentering: true,
  prebidTimeout: 1000,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  prebidFailsafeTimeout: 3000,
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
