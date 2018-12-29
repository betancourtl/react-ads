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
    this.state = {
      isMounted: false,
    };

    this.pubSub = new PubSub();
    createGPTScript();
    startGoogleTagQue();
    startPrebidQueue();
    if (props.prebid) props.prebid();
    createGoogleTagEvents(this.pubSub);
    this.adManager = adManager({
      getBids: this.getBids,
      displayFn: this.display,
      refreshFn: this.refresh,
      chunkSize: props.chunkSize,
      defineDelay: props.defineDelay,
      refreshDelay: props.defineDelay,
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

  display = (id, cb) => {
    window.googletag.cmd.push(() => {
      window.googletag.display(id);
      cb();
    });
  }

  refresh = ids => {
    window.googletag.cmd.push(() => window.googletag.pubads().refresh(ids));
  }

  getBids = getBids(this.props.prebidTimeout, this.props.prebidFailsafeTimeout);

  componentWillUnmount() {
    // Clears the event listener.
    this.pubSub.clear();
  }

  render() {
    return (
      <AdsContext.Provider value={{
        ...this.state,
        networkId: this.props.networkId,
        adUnitPath: this.props.adUnitPath,
        define: this.adManager.define,
        refresh: this.adManager.refresh,
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
  defineDelay: 100,
  refreshDelay: 200,
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
  adUnitPath: PropTypes.string,
  setCentering: PropTypes.bool,
  prebidTimeout: PropTypes.number,
  defineDelay: PropTypes.number,
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
