/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import { AdsContext } from '../context';
import Queue from '../../lib/Queue';
import adCallManager from '../../adCallManager';

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
} from '../../googletag';

class Provider extends Component {
  constructor(props) {
    super(props);    
    this.state = {  
      isMounted: false,
      version: undefined,
      apiReady: undefined,
      pubadsReady: undefined,
      setCentering: undefined,
      enableVideoAds: undefined,
      collapseEmptyDivs: undefined,
      disableInitialLoad: undefined,
      enableSingleRequest: undefined,
      enableSyncRendering: undefined,
      enableAsyncRendering: undefined,
      serviceEnabled: false,          
    };
    
    this.defineSlotQueue = new Queue();
    this.pubSub = new PubSub();
    createGPTScript();
    startGoogleTagQue();
    createGoogleTagEvents(this.pubSub);

    // manage display, refresh, define slot calls.
    this.adCallManager = adCallManager({
      chunkSize: 4,
      defineDelay: 100,
      refreshDelay: 200,
      displayFn: id =>  {
        window.googletag.cmd.push(() => window.googletag.display(id));
      },
      refreshFn: ids => {
        window.googletag.cmd.push(() => window.googletag.pubads().refresh(ids));
      },
    });

    this.setStateInConstructor = (props) => {
      window.googletag.cmd.push(() => {
        this.state.isMounted
          ? this.setState(props)
          : this.state = { ...this.state, ...props };
      });
    };

    // proxy the apiReady property so that we an load ads when ready.
    // pubSub.on('pubadsReady', (pubadsReady) => this.setState({ pubadsReady }));
    // pubSub.on('apiReady', (apiReady) => this.setState({ apiReady }));
    this.pubSub.on('refresh', () => {
      // console.log('refresh called');
    });
    this.pubSub.on('display', () => {
      // console.log('display called');
    });
    // this.pubSub.on('destroySlots', () => console.log('destroySlots'));
    this.pubSub.on('enableServices', () => {
      this.setStateInConstructor({ serviceEnabled: true });
      // console.log('Service Enabled');
    });
    this.pubSub.on('getVersion', version => this.setStateInConstructor({ version }));
    this.pubSub.on('defineSlot', () => {
      // console.log('defineSlot', slot.getSlotElementId())
    });
    this.pubSub.on('setCentering', setCentering => this.setStateInConstructor({ setCentering }));
    this.pubSub.on('enableVideoAds', enableVideoAds => this.setStateInConstructor({ enableVideoAds }));
    this.pubSub.on('collapseEmptyDivs', collapseEmptyDivs => this.setStateInConstructor({ collapseEmptyDivs }));
    this.pubSub.on('disableInitialLoad', disableInitialLoad => {
      this.setStateInConstructor({ disableInitialLoad });
      // console.log('disableInitialLoad');
    });
    this.pubSub.on('enableSingleRequest', enableSingleRequest => {
      this.setStateInConstructor({ enableSingleRequest });
      // console.log('enableSingleRequest');
    });
    this.pubSub.on('enableAsyncRendering', enableAsyncRendering => this.setStateInConstructor({ enableAsyncRendering }));

    getVersion();
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
        define: this.adCallManager.define,
        refresh: this.adCallManager.refresh,   
      }}>
        {this.props.children}
      </AdsContext.Provider>
    );    
  }
}

Provider.defaultProps = {
  setCentering: true,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  disableInitialLoad: true,
  enableSingleRequest: true,
  enableAsyncRendering: true,
};

Provider.propTypes = {
  setCentering: PropTypes.bool,
  enableVideoAds: PropTypes.bool,
  collapseEmptyDivs: PropTypes.bool,
  disableInitialLoad: PropTypes.bool,
  enableSingleRequest: PropTypes.bool,
  enableAsyncRendering: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export default Provider;
