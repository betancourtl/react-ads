/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import { AdsContext } from '../context';
import adManager from './adManager';
import { startPrebidQueue, getBids } from './prebid';
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
} from './googletag';

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
    this.adManager = adManager({
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
    return `${type}-${count}`;
  };

  render() {
    return (
      <AdsContext.Provider value={{
        networkId: this.props.networkId,
        refresh: !this.props.enableAds ? null : this.adManager.refresh,
        adUnitPath: this.props.adUnitPath,
        enableAds: this.props.enableAds,
        generateId: this.generateId,
      }}>
        {this.props.children}
      </AdsContext.Provider>
    );
  }
}

Provider.defaultProps = {
  networkId: 0,
  prebid: null,
  chunkSize: 4,
  targeting: {},
  refreshDelay: 200,
  enableAds: true,
  setCentering: true,
  prebidTimeout: 1000,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  prebidFailsafeTimeout: 3000,
};

Provider.propTypes = {
  prebid: PropTypes.func,
  targeting: PropTypes.object,
  chunkSize: PropTypes.number,
  enableAds: PropTypes.bool,
  adUnitPath: PropTypes.string,
  setCentering: PropTypes.bool,
  prebidTimeout: PropTypes.number,
  refreshDelay: PropTypes.number,
  enableVideoAds: PropTypes.bool,
  collapseEmptyDivs: PropTypes.bool,
  prebidFailsafeTimeout: PropTypes.number,
  networkId: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Provider;
