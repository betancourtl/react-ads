import React, { Component } from 'react';
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

const enableSingleRequest = () => {
  window.googletag.cmd.push(() => {
    window.googletag.pubads().enableSingleRequest();
  });
};

const enableLazyLoad = (props = true) => {
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
    // creates the gpt script
    createGPTScript();
    // creates the gpt queue
    startGoogleTagQue();
    // enables SR mode
    enableSingleRequest();
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
  enableLazyLoad: false,
  setCentering: false,
};

Provider.propTypes = {
  enableSingleRequest: PropTypes.bool,
  setCentering: PropTypes.bool,
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
