/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import { AdsContext } from '../context';
import adCallManager from '../../utils/adCallManager';

import {
  getVersion,  
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
    this.state = {  
      isMounted: false,
    };
    
    this.pubSub = new PubSub();
    createGPTScript();
    startGoogleTagQue();
    createGoogleTagEvents(this.pubSub);  
    this.adCallManager = adCallManager({
      chunkSize: props.chunkSize,
      defineDelay: props.defineDelay,
      refreshDelay: props.defineDelay,
      displayFn: id =>  window.googletag.cmd.push(() => window.googletag.display(id)),
      refreshFn: ids => window.googletag.cmd.push(() => window.googletag.pubads().refresh(ids)),
    });

    this.pubSub.on('refresh', () => {});
    this.pubSub.on('display', () => {});
    this.pubSub.on('destroySlots', () => {});
    this.pubSub.on('defineSlot', () => {});

    setCentering(this.props.setCentering);
    enableVideoAds(this.props.enableVideoAds);
    collapseEmptyDivs(this.props.collapseEmptyDivs);  
    enableAsyncRendering(this.props.enableAsyncRendering);    
    enableSingleRequest(this.props.enableSingleRequest);
    disableInitialLoad(this.props.disableInitialLoad);
    enableServices();
  }

  componentDidMount() {
    // The event listener triggers setState before the component is fully mounted
    // This triggers an error in react.
    this.setState({ isMounted: true });    
  }

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
        define: this.adCallManager.define,
        refresh: this.adCallManager.refresh,   
      }}>
        {this.props.children}
      </AdsContext.Provider>
    );    
  }
}

Provider.defaultProps = {
  networkId: 0,
  chunkSize: 4,
  defineDelay: 100,
  refreshDelay: 200,
  setCentering: true,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  disableInitialLoad: true,
  enableSingleRequest: true,
  enableAsyncRendering: true,
};

Provider.propTypes = {
  chunkSize: PropTypes.number,
  adUnitPath: PropTypes.string,
  setCentering: PropTypes.bool,
  defineDelay: PropTypes.number,
  refreshDelay: PropTypes.number,
  enableVideoAds: PropTypes.bool,
  collapseEmptyDivs: PropTypes.bool,
  disableInitialLoad: PropTypes.bool,
  enableSingleRequest: PropTypes.bool,
  enableAsyncRendering: PropTypes.bool,
  networkId: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Provider;
