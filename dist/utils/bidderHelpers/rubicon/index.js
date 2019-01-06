"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rubiconBids = void 0;

var _utils = require("../utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createBid = function createBid(_ref) {
  var siteId = _ref.siteId,
      zoneId = _ref.zoneId,
      accountId = _ref.accountId;
  return {
    bidder: 'rubicon',
    params: {
      accountId: accountId,
      siteId: siteId,
      zoneId: zoneId
    }
  };
};

var rubiconBids = function rubiconBids(maps) {
  return function (screen, sizes) {
    var _sizes = (0, _utils.formatSizes)(sizes);

    var options = maps.filter(function (_ref2) {
      var mq = _ref2.mq;
      return mq === screen;
    });
    if (!options) return [];

    var bids = _sizes.reduce(function (acc, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          w1 = _ref4[0],
          h1 = _ref4[1];

      var params = options.find(function (_ref5) {
        var _ref5$size = _slicedToArray(_ref5.size, 2),
            w2 = _ref5$size[0],
            h2 = _ref5$size[1];

        return w1 === w2 && h1 === h2;
      });
      if (!params) return acc;
      acc.push(createBid(params));
      return acc;
    }, []);

    return bids;
  };
};

exports.rubiconBids = rubiconBids;