import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import {
  createGPTScript,
  startGoogleTagQue,
  createGoogleTagEvents,
  enableSingleRequest,
  disableInitialLoad,
  enableLazyLoad,
  setCentering,
} from '../../helpers/googletag';

class Provider extends Component {
  constructor(props) {
    super(props);
    const pubSub = new PubSub();
    window.pubSub = pubSub;
    pubSub.on('define', (slot) => console.log(slot.getSlotElementId()));
    pubSub.on('refresh', () => console.log('refreshed'));
    // creates the gpt script
    createGPTScript();
    // creates the gpt queue
    startGoogleTagQue();
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
