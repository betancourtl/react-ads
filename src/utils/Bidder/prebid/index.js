/* eslint-disable no-console */
import prebidInit from '@webdeveloperpr/prebid';
import Bidder from '../';

const bidder = new Bidder('prebid');

bidder.init = () => {
  if (bidder.isReady) return;
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
  prebidInit();
};

bidder.onBidWon = () => {
};

bidder.onTimeout = () => {
};

/**
 * Will fetch the prebid bids.
 * @param {Number} timeout 
 * @param {Number} failSafeTimeout 
 * @param {Object} adUnits 
 * @returns {Promise}
 */
bidder.fetchBids = adUnits => new Promise(resolve => {
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {

    // Set new adUnits
    const adUnitCodes = adUnits.map(x => x.code);
    pbjs.addAdUnits(adUnits);

    // Make the request
    pbjs.requestBids({
      adUnitCodes,
      timeout: bidder.timeout,
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
bidder.handleResponse = ({ adUnitCodes }) => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      pbjs.setTargetingForGPTAsync(adUnitCodes);
    });
  });
};

export default bidder;
