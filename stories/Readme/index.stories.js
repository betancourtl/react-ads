import React from 'react';
import { Provider, Ad } from '../../src';
import { storiesOf } from '@storybook/react';
import Bidder from '../../src/utils/Bidder';

const prebid = new Bidder('prebid');

prebid.init = () => {
  if (prebid.isReady) return;
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];

  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = `https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js?${Math.random(1, 10)}`;
    el.async = true;
    el.onload = resolve;
    el.onerror = reject;
    document.head.appendChild(el);
  });
};

prebid.onBidWon = () => { };

prebid.onTimeout = () => { };

/**
 * Will fetch the prebid bids.
 * @param {Number} timeout 
 * @param {Number} failSafeTimeout 
 * @param {Object} adUnits 
 * @returns {Promise}
 */
prebid.fetchBids = adUnits => new Promise(resolve => {
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {
    // Set new adUnits
    const adUnitCodes = adUnits.map(x => x.code);
    pbjs.addAdUnits(adUnits);

    // Make the request
    pbjs.requestBids({
      adUnitCodes,
      timeout: prebid.timeout,
      bidsBackHandler: response => {
        resolve({
          response,
          bids: pbjs.getBidResponses(),
          adUnitCodes,
        });
        // remove the adUnits
        adUnitCodes.forEach(adUnitCode => window.pbjs.removeAdUnit(adUnitCode));
      },
    });
  });
});

/**
 * 
 * @function
 * @param {Object} response.adUnitCodes
 * @returns {void}
 */
prebid.handleResponse = ({ adUnitCodes }) => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      pbjs.setTargetingForGPTAsync(adUnitCodes);
    });
  });
};

const bidHandler = ({ id, sizes }) => ({
  prebid: {
    code: id,
    mediaTypes: {
      banner: {
        sizes: sizes
      }
    },
    bids: [{
      bidder: 'appnexus',
      params: {
        placementId: 13144370
      }
    }]
  }
});

class Story extends React.Component {
  render() {
    return (
      <Provider
        chunkSize={5}
        enableAds={true}
        lazyOffset={800}
        initTimeout={400}
        bidTimeout={1200}
        setCentering={true}
        networkId={19968336}
        bidProviders={[prebid]}
        adUnitPath="header-bid-tag-0"
      >
        <Ad
          lazy
          size={[300, 250]}
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-0"
          sizeMap={[{ viewPort: [0, 0], slots: [300, 250] }]}
        />
        <Ad
          lazy
          size={[728, 90]}
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-1"
          sizeMap={[{ viewPort: [0, 0], slots: [[728, 90], [70, 250]] }]}
        />
      </Provider>
    );
  }
}

storiesOf('Prebid', module)
  .add('with text', () => (
    <Story />
  ));
