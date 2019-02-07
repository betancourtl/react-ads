"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var bidder = new _.default('prebid');
/**
 * Initializes the bidder.
 * @returns {Promise}
 */

bidder.init = function () {
  if (bidder.isReady) return;
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
  return new Promise(function (resolve, reject) {
    var el = document.createElement('script');
    el.src = 'https://acdn.adnxs.com/prebid/not-for-prod/1/prebid.js';
    el.async = true;
    el.onload = resolve;
    el.onerror = reject;
    document.head.appendChild(el);
  });
};

bidder.onBidWon = function () {};

bidder.onTimeout = function () {};

bidder.onVideoBidTimeout = function () {};
/**
 * Will fetch the prebid display bids.
 * @param {Number} timeout 
 * @param {Number} failSafeTimeout 
 * @param {Object} adUnits 
 * @returns {Promise}
 */


bidder.fetchDisplayBids = function (adUnits) {
  return new Promise(function (resolve) {
    var pbjs = window.pbjs || {};
    pbjs.que.push(function () {
      // Set new adUnits
      var adUnitCodes = adUnits.map(function (x) {
        return x.code;
      }); // remove the adUnits

      adUnitCodes.forEach(function (adUnitCode) {
        return window.pbjs.removeAdUnit(adUnitCode);
      });
      pbjs.addAdUnits(adUnits); // Make the request

      pbjs.requestBids({
        adUnitCodes: adUnitCodes,
        timeout: bidder.timeout,
        bidsBackHandler: function bidsBackHandler(response) {
          resolve({
            response: response,
            bids: pbjs.getBidResponses(),
            adUnitCodes: adUnitCodes
          });
        }
      });
    });
  });
};
/**
 * 
 * @function
 * @param {Object} response.adUnitCodes
 * @returns {void}
 */


bidder.handleResponse = function (_ref) {
  var adUnitCodes = _ref.adUnitCodes;
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      pbjs.setTargetingForGPTAsync(adUnitCodes);
    });
  });
};
/**
 * Will fetch the video bids and return an adTagURL.
 * @param {Object} adUnit 
 * @param {Object} - VideoJS params
 * @returns {Promise}
 */


bidder.fetchVideoBids = function (adUnit, params) {
  return new Promise(function (resolve) {
    var pbjs = window.pbjs || {};
    pbjs.que = pbjs.que || [];
    pbjs.que.push(function () {
      // remove adUnit
      window.pbjs.removeAdUnit(adUnit.code); // add adUnit

      pbjs.addAdUnits(adUnit);
      pbjs.requestBids({
        adUnitCodes: [adUnit.code],
        timeout: bidder.timeout,
        bidsBackHandler: function bidsBackHandler(bids) {
          resolve({
            adTagUrl: pbjs.adServers.dfp.buildVideoUrl({
              adUnit: adUnit,
              params: params
            })
          });
        }
      });
    });
  });
};
/**
 * @param {Object} param.adTagUrl - AdTag url returned from fetchVideoBids.
 * @param {Function} callback - Callback function, this should probably be the 
 * function used to initialize the videoPlayer with the adTagUrl
 * @param {void}
 */


bidder.handleVideoResponse = function () {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      adTagUrl = _ref2.adTagUrl;

  var callback = arguments.length > 1 ? arguments[1] : undefined;
  callback(adTagUrl);
};

var _default = bidder;
exports.default = _default;