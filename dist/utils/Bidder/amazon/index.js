"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = _interopRequireDefault(require("../"));

var _initialize = _interopRequireDefault(require("./initialize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var bidder = new _.default('amazon');

bidder.init = function () {
  var addScript = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _initialize.default;
  addScript();
  window.apstag.init({
    pubID: 123,
    adServer: 'googletag',
    bidTimeout: 1000
  });
};

bidder.fetchBids = function (adUnits) {
  return new Promise(function (resolve) {
    var bids = adUnits.reduce(function (acc, _ref) {
      var bids = _ref.bids;
      var newAcc = acc.concat(bids);
      return newAcc;
    }, []);
    window.apstag.fetchBids({
      slots: bids
    }, function () {
      resolve.apply(void 0, arguments);
    });
  });
};

bidder.onBidWon = function () {};

bidder.onTimeout = function () {};

bidder.handleResponse = function (bids) {
  var googletag = window.googletag;
  googletag.cmd.push(function () {
    bids.forEach(function (_ref2) {
      var amzniid = _ref2.amzniid,
          amznbid = _ref2.amznbid,
          slotID = _ref2.slotID;
      window.googletag.pubads().getSlots().forEach(function (slot) {
        var id = slot.getSlotElementId();

        if (id === slotID) {
          slot.setTargeting('amzniid', amzniid);
          slot.setTargeting('amznbid', amznbid);
        }
      });
    });
  });
};

var _default = bidder;
exports.default = _default;