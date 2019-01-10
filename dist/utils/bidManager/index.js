"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _JobQueue = _interopRequireDefault(require("../../lib/JobQueue"));

var _bidDispatcher = _interopRequireDefault(require("../bidDispatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/** 
 * @param {Number} props.chunkSize - Max ads to process.
 * @param {Number} props.refreshDelay - Refresh delay.
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Function} props.getBids - Prebid function used to fetch bids.
 * @param {Boolean} props.prebidEnabled - Function to used to fetch prebid bids.
 * @function
 * @returns {Object}
 */
var bidManager = function bidManager() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var refresh = props.refresh,
      _props$chunkSize = props.chunkSize,
      chunkSize = _props$chunkSize === void 0 ? 5 : _props$chunkSize,
      _props$refreshDelay = props.refreshDelay,
      refreshDelay = _props$refreshDelay === void 0 ? 100 : _props$refreshDelay,
      _props$bidTimeout = props.bidTimeout,
      bidTimeout = _props$bidTimeout === void 0 ? 1000 : _props$bidTimeout,
      _props$bidProviders = props.bidProviders,
      bidProviders = _props$bidProviders === void 0 ? [] : _props$bidProviders;
  var refreshJob = new _JobQueue.default({
    chunkSize: chunkSize,
    delay: refreshDelay,
    processFn: function processFn(q, done) {
      var slots = [];
      var nextBids = {};

      while (!q.isEmpty) {
        var _q$dequeue$data = q.dequeue().data,
            slot = _q$dequeue$data.slot,
            bids = _q$dequeue$data.bids;
        slots.push(slot);
        if (!bids) break;
        Object.entries(bids).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          if (!nextBids[key]) nextBids[key] = [];
          nextBids[key].push(val);
        });
      } // There are no bidProviders or there are no bids requested.


      if ([bidProviders, Object.keys(nextBids)].some(function (x) {
        return x.length === 0;
      })) {
        refresh(slots);
        return done();
      } // Fetch the bids.


      (0, _bidDispatcher.default)(bidProviders.map(function (bidder) {
        return bidder._fetchBids(nextBids[bidder.name]);
      }), bidTimeout).then(function (responses) {
        responses.forEach(function (res, i) {
          if (res.status === 'fulfilled') {
            bidProviders[i].onBidWon();
            bidProviders[i].handleResponse(res.data);
          }

          if (res.status === 'rejected') {
            bidProviders[i].onTimeout();
          }
        });
      }).catch(function (err) {
        return console.log('error', err);
      }).finally(function () {
        refresh(slots);
        done();
      });
    }
  });
  return {
    refresh: refreshJob.add
  };
};

var _default = bidManager;
exports.default = _default;