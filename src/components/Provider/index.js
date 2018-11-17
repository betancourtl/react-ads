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


/**
 * Enables the googletag service and configures the GPT service.
 * TODO [] - Create initial ads queue.
 * TODO [] - Create lazy-loded ads queue, by monkey patching the gpt cmd array.
 * TODO [] - Create custom lazy-loaded functionality similar to nfl/react-gpt
 */
class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ads: [],
      isMounted: false,
      version: undefined,
      apiReady: undefined,
      pubadsReady: undefined,
      setCentering: undefined,
      enableLazyLoad: undefined,
      enableVideoAds: undefined,
      collapseEmptyDivs: undefined,
      disableInitialLoad: undefined,
      enableSingleRequest: undefined,
      enableSyncRendering: undefined,
      enableAsyncRendering: undefined,
    };

    this.pubSub = new PubSub();
    createGPTScript();
    startGoogleTagQue();
    createGoogleTagEvents(this.pubSub);

    this.setStateInConstructor = (props) => {
      this.state.isMounted
        ? this.setState(props)
        : this.state = { ...this.state, ...props };
    };

    // proxy the apiReady property so that we an load ads when ready.
    // pubSub.on('pubadsReady', (pubadsReady) => this.setState({ pubadsReady }));
    // pubSub.on('apiReady', (apiReady) => this.setState({ apiReady }));

    // this.pubSub.on('refresh', () => console.log('refreshed'));
    // this.pubSub.on('destroySlots', () => console.log('destroySlots'));
    // this.pubSub.on('enableServices', () => console.log('enableServices'));
    this.pubSub.on('getVersion', version => this.setStateInConstructor({ version }));
    // this.pubSub.on('defineSlot', slot => console.log('defineSlot', slot.getSlotElementId()));
    this.pubSub.on('setCentering', setCentering => this.setStateInConstructor({ setCentering }));
    this.pubSub.on('enableLazyLoad', enableLazyLoad => this.setStateInConstructor({ enableLazyLoad }));
    this.pubSub.on('enableVideoAds', enableVideoAds => this.setStateInConstructor({ enableVideoAds }));
    this.pubSub.on('collapseEmptyDivs', collapseEmptyDivs => this.setStateInConstructor({ collapseEmptyDivs }));
    this.pubSub.on('disableInitialLoad', disableInitialLoad => this.setStateInConstructor({ disableInitialLoad }));
    this.pubSub.on('enableSingleRequest', enableSingleRequest => this.setStateInConstructor({ enableSingleRequest }));
    this.pubSub.on('enableSyncRendering', enableSyncRendering => this.setStateInConstructor({ enableSyncRendering }));
    this.pubSub.on('enableAsyncRendering', enableAsyncRendering => this.setStateInConstructor({ enableAsyncRendering }));

    getVersion();
    setCentering(this.props.setCentering);
    enableVideoAds(this.props.enableVideoAds);
    enableLazyLoad(this.props.enableLazyLoad);
    collapseEmptyDivs(this.props.collapseEmptyDivs);
    disableInitialLoad(this.props.disableInitialLoad);
    enableSyncRendering(this.props.enableSyncRendering);
    enableSingleRequest(this.props.enableSingleRequest);
    enableAsyncRendering(this.props.enableAsyncRendering);
    // Must be the last fn to run in the constructor.
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
    return this.props.children;
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
  enableVideoAds: PropTypes.bool,
  collapseEmptyDivs: PropTypes.bool,
  disableInitialLoad: PropTypes.bool,
  enableSingleRequest: PropTypes.bool,
  enableSyncRendering: PropTypes.bool,
  enableAsyncRendering: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  enableLazyLoad: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      fetchMarginPercent: PropTypes.number,
      renderMarginPercent: PropTypes.number,
      mobileScaling: PropTypes.number,
    })
  ]),
};

export default Provider;
