"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prebid = _interopRequireDefault(require("@webdeveloperpr/prebid"));

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var bidder = new _.default('prebid');

bidder.init = function () {
  if (bidder.isReady) return;
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
  (0, _prebid.default)();
};

bidder.onBidWon = function () {};

bidder.onTimeout = function () {};
/**
 * Will fetch the prebid bids.
 * @param {Number} timeout 
 * @param {Number} failSafeTimeout 
 * @param {Object} adUnits 
 * @returns {Promise}
 */


bidder.fetchBids = function (adUnits) {
  return new Promise(function (resolve) {
    var pbjs = window.pbjs || {};
    pbjs.que.push(function () {
      // Set new adUnits
      var adUnitCodes = adUnits.map(function (x) {
        return x.code;
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
          }); // remove the adUnits

          adUnitCodes.forEach(function (adUnitCode) {
            return window.pbjs.removeAdUnit(adUnitCode);
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

var _default = bidder;
exports.default = _default;