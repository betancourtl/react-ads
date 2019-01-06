"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ixBids = exports.createBid = void 0;

var _utils = require("../utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createBid = function createBid(_ref) {
  var siteId = _ref.siteId,
      size = _ref.size;
  return {
    bidder: 'ix',
    params: {
      siteId: siteId,
      size: size
    }
  };
};

exports.createBid = createBid;

var ixBids = function ixBids(indx) {
  return function (adUnitId, sizes) {
    var adMap = indx.mapping[adUnitId];
    if (!adMap) return [];
    var adUnitSizes = adMap.map(function (sizeId) {
      return indx.xSlots[sizeId];
    });
    if (typeof sizes === 'string') return [];

    var _sizes = (0, _utils.formatSizes)(sizes);

    var bidderSizes = _sizes.reduce(function (acc, size) {
      if (typeof size === 'string') return acc;

      var _size = _slicedToArray(size, 2),
          w1 = _size[0],
          h1 = _size[1];

      var params = adUnitSizes.find(function (_ref2) {
        var _ref2$size = _slicedToArray(_ref2.size, 2),
            w2 = _ref2$size[0],
            h2 = _ref2$size[1];

        return w1 === w2 && h1 === h2;
      });
      if (!params) return acc;
      acc.push(createBid({
        siteId: params.siteId,
        size: params.size
      }));
      return acc;
    }, []); // console.log(`idx - ${adUnitId}`, JSON.stringify(bidderSizes, null, 2));


    return bidderSizes;
  };
};

exports.ixBids = ixBids;