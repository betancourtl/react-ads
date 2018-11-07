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

    // pubSub.on('pubadsReady', (pubadsReady) => this.setState({ pubadsReady }));
    // pubSub.on('apiReady', (apiReady) => this.setState({ apiReady }));

    this.pubSub.on('refresh', () => console.log('refreshed'));
    this.pubSub.on('destroySlots', () => console.log('destroySlots'));
    this.pubSub.on('enableServices', () => console.log('enableServices'));
    this.pubSub.on('getVersion', version => this.setStateInConstructor({ version }));
    this.pubSub.on('defineSlot', slot => console.log('defineSlot', slot.getSlotElementId()));
    this.pubSub.on('setCentering', setCentering => this.setStateInConstructor({ setCentering }));
    this.pubSub.on('enableLazyLoad', enableLazyLoad => this.setStateInConstructor({ enableLazyLoad }));
    this.pubSub.on('enableVideoAds', enableVideoAds => this.setStateInConstructor({ enableVideoAds }));
    this.pubSub.on('collapseEmptyDivs', collapseEmptyDivs => this.setStateInConstructor({ collapseEmptyDivs }));
    this.pubSub.on('disableInitialLoad', disableInitialLoad => this.setStateInConstructor({ disableInitialLoad }));
    this.pubSub.on('enableSingleRequest', enableSingleRequest => this.setStateInConstructor({ enableSingleRequest }));
    this.pubSub.on('enableSyncRendering', enableSyncRendering => this.setStateInConstructor({ enableSyncRendering }));
    this.pubSub.on('enableAsyncRendering', enableAsyncRendering => this.setStateInConstructor({ enableAsyncRendering }));

    getVersion();
    enableSingleRequest(this.props.enableSingleRequest);
    enableAsyncRendering(this.props.enableAsyncRendering);
    enableSyncRendering(this.props.enableSyncRendering);
    disableInitialLoad(this.props.disableInitialLoad);
    enableVideoAds(this.props.enableVideoAds);
    enableLazyLoad(this.props.enableLazyLoad);
    collapseEmptyDivs(this.props.collapseEmptyDivs);
    setCentering(this.props.setCentering);
    enableServices();
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
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
