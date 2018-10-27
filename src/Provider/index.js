import React, { Component } from 'react';
import PubSub from '../utils/PubSub';
import PropTypes from 'prop-types';

const createGPTScript = () => {
  const id = 'react-ads-google-tag-script';
  const scriptExists = document.getElementById(id);

  if (scriptExists) {
    console.log('google tag script already exists');
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
  script.async = true;
  document.head.appendChild(script);
};

const startGoogleTagQue = () => {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
};

const createGoogleTagEvents = (pubsub) => {
  window.googletag.cmd.push(() => {
    const defineSlot = window.googletag.defineSlot;
    window.googletag.defineSlot = function () {
      const slot = defineSlot.apply(this, arguments);
      pubsub.emit('define', slot);
      return slot;
    };
  });

  window.googletag.cmd.push(() => {
    const refresh = window.googletag.pubads().refresh;
    window.googletag.pubads().refresh = function () {
      refresh.apply(this, arguments);
      pubsub.emit('refresh');
    };
  });
};

const enableSingleRequest = (enabled) => {
  if (!enabled) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
  });
};

const disableInitialLoad = (disabled) => {
  if (disabled)
    window.googletag.cmd.push(() => {
      window.googletag.pubads().disableInitialLoad();
    });
};

const enableLazyLoad = (props = true) => {
  if (!props) return;
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableLazyLoad(props);
  });
};

const setCentering = (prop = false) => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().setCentering(prop);
  });
};

class Provider extends Component {
  constructor(props) {
    super(props);
    const pubsub = new PubSub();
    window.pubsub = pubsub;
    pubsub.on('define', (slot) => console.log(slot.getSlotElementId()));
    pubsub.on('refresh', () => console.log('refreshed'));
    // creates the gpt script
    createGPTScript();
    // creates the gpt queue
    startGoogleTagQue();
    // create gpt events that we can hook into (refresh, display, destroy) slots
    createGoogleTagEvents(pubsub);
    // enables SR mode
    enableSingleRequest(this.props.enableSingleRequest);
    // disableInitialLoad
    disableInitialLoad(this.props.disableInitialLoad);
    // enable lazyLoad
    enableLazyLoad(this.props.enableLazyLoad);
    // center ads
    setCentering(this.props.setCentering);
  }

  componentWillUnmount() {
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
