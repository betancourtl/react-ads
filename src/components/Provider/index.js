/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import {
  setCentering,
  enableLazyLoad,
  createGPTScript,
  startGoogleTagQue,
  disableInitialLoad,
  enableSingleRequest,
  createGoogleTagEvents,
} from '../../helpers/googletag';

class Provider extends Component {
  constructor(props) {
    super(props);
    const pubSub = new PubSub();
    window.pubSub = pubSub;
    pubSub.on('defineSlot', (slot) => console.log('defineSlot', slot.getSlotElementId()));
    pubSub.on('refresh', () => console.log('refreshed'));
    pubSub.on('destroySlots', () => console.log('destroySlots'));
    pubSub.on('apiReady', (val) => console.log('apiReady', val));
    pubSub.on('pubadsReady', (val) => console.log('pubadsReady', val));
    // creates the gpt script
    createGPTScript();
    // creates the gpt queue
    startGoogleTagQue(pubSub);
    // create gpt events that we can hook into (refresh, display, destroy) slots
    createGoogleTagEvents(pubSub);
    // enables SR mode
    enableSingleRequest(this.props.enableSingleRequest);
    // disableInitialLoad
    disableInitialLoad(this.props.disableInitialLoad);
    // enable lazyLoad
    enableLazyLoad(this.props.enableLazyLoad);
    // center ads
    setCentering(this.props.setCentering);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

Provider.defaultProps = {
  enableSingleRequest: false,
  disableInitialLoad: false,
  enableLazyLoad: false,
  setCentering: false,
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  enableSingleRequest: PropTypes.bool,
  setCentering: PropTypes.bool,
  disableInitialLoad: PropTypes.bool,
  enableLazyLoad: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      fetchMarginPercent: PropTypes.number,  // 500 = Fetch slots within 5 viewports.
      renderMarginPercent: PropTypes.number,  // 200 = Render slots within 2 viewports.
      mobileScaling: PropTypes.number  // 2.0 = Double the above values on mobile.
    })
  ])
};

export default Provider;
