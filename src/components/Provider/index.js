/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import {
  getVersion,
  setCentering,
  enableLazyLoad,
  enableServices,
  enableVideoAds,
  createGPTScript,
  startGoogleTagQue,
  collapseEmptyDivs,
  disableInitialLoad,
  enableSingleRequest,
  enableSyncRendering,
  enableAsyncRendering,
  createGoogleTagEvents,
} from '../../helpers/googletag';

class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      // properties
      apiReady: undefined, // ok
      pubadsReady: undefined, // ok

      // fnCalls
      disableInitialLoad: undefined, //ok
      enableAsyncRendering: undefined, // ok
      enableLazyLoad: undefined, // ok
      enableSingleRequest: undefined, // ok
      enableSyncRendering: undefined, // ok
      enableVideoAds: undefined, // ok
      setCentering: undefined, // ok
      collapseEmptyDivs: undefined,
      version: undefined,
      isMounted: false,
    };
    this.pubSub = new PubSub();

    window.pubSub = this.pubSub;
    // creates the gpt script
    createGPTScript();
    // creates the gpt queue
    startGoogleTagQue();
    // create gpt events that we can hook into (refresh, display, destroy) slots
    createGoogleTagEvents(this.pubSub);

    // pubads service
    // pubSub.on('apiReady', (apiReady) => this.setState({ apiReady }));
    // pubSub.on('pubadsReady', (pubadsReady) => this.setState({ pubadsReady }));
    this.setStateInConstructor = (props) => {
      this.state.isMounted
        ? this.setState(props)
        : this.state = { ...this.state, ...props };
    };
    this.pubSub.on('defineSlot', (slot) => console.log('defineSlot', slot.getSlotElementId()));
    this.pubSub.on('refresh', () => console.log('refreshed'));
    this.pubSub.on('destroySlots', () => console.log('destroySlots'));
    this.pubSub.on('enableServices', () => console.log('enableServices'));
    this.pubSub.on('disableInitialLoad', (disableInitialLoad) => this.setStateInConstructor({ disableInitialLoad }));
    this.pubSub.on('enableAsyncRendering', (enableAsyncRendering) => this.setStateInConstructor({ enableAsyncRendering }));
    this.pubSub.on('enableLazyLoad', (enableLazyLoad) => this.setStateInConstructor({ enableLazyLoad }));
    this.pubSub.on('enableSingleRequest', (enableSingleRequest) => this.setStateInConstructor({ enableSingleRequest }));
    this.pubSub.on('enableSyncRendering', (enableSyncRendering) => this.setStateInConstructor({ enableSyncRendering }));
    this.pubSub.on('enableVideoAds', (enableVideoAds) => this.setStateInConstructor({ enableVideoAds }));
    this.pubSub.on('setCentering', (setCentering) => this.setStateInConstructor({ setCentering }));
    this.pubSub.on('collapseEmptyDivs', (collapseEmptyDivs) => this.setStateInConstructor({ collapseEmptyDivs }));
    this.pubSub.on('getVersion', (version) => this.setStateInConstructor({ version }));

    // enables SR mode
    enableSingleRequest(this.props.enableSingleRequest);
    // enables SR mode
    enableAsyncRendering(this.props.enableAsyncRendering);
    // enables SR mode
    enableSyncRendering(this.props.enableSyncRendering);
    // disableInitialLoad
    disableInitialLoad(this.props.disableInitialLoad);
    // enables video ads
    enableVideoAds(this.props.enableVideoAds);
    // enable lazyLoad
    enableLazyLoad(this.props.enableLazyLoad);
    // collapses empty divs
    collapseEmptyDivs(this.props.collapseEmptyDivs);
    // center ads
    setCentering(this.props.setCentering);
    // getVersion
    getVersion();
    // Allow ads to be fetched.
    enableServices();
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.pubSub.clear();
  }

  render() {
    console.log('state', this.state);
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

Provider.defaultProps = {
  setCentering: true,
  enableLazyLoad: true,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  disableInitialLoad: false,
  enableSingleRequest: true,
  enableAsyncRendering: true,
  enableSyncRendering: false,
};

Provider.propTypes = {
  setCentering: PropTypes.bool,
  enableLazyLoad: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      fetchMarginPercent: PropTypes.number,  // 500 = Fetch slots within 5 viewports.
      renderMarginPercent: PropTypes.number,  // 200 = Render slots within 2 viewports.
      mobileScaling: PropTypes.number  // 2.0 = Double the above values on mobile.
    })
  ]),
  disableInitialLoad: PropTypes.bool,
  enableSingleRequest: PropTypes.bool,
  enableAsyncRendering: PropTypes.bool,
  enableSyncRendering: PropTypes.bool,
  enableVideoAds: PropTypes.bool,
  collapseEmptyDivs: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};

export default Provider;
