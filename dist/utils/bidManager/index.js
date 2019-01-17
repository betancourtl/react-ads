"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.processFn = void 0;

var _JobQueue = _interopRequireDefault(require("../../lib/JobQueue"));

var _timedPromise2 = _interopRequireWildcard(require("../timedPromise"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * This function will make bid requests and then call the bidders functions
 * for callbacks for a successfull bid call.
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Number} props.bidTimeout - Ammount of time to wait for bidders.
 * @param {Function} props.dispatchBidders - function that fetches the bids.
 * @param {Function} q - The items that the job passed to thie processing fn.
 * @param {Function} done - Resolves a promise and ends the job.
 * @function
 * @returns {void}
 */
var processFn = function processFn(bidProviders, bidTimeout, refresh) {
  var timedPromise = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _timedPromise2.default;
  return function (q, done) {
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
    }

    var noBidsOrProviders = [bidProviders, Object.keys(nextBids)].some(function (x) {
      return x.length === 0;
    });

    if (noBidsOrProviders) {
      refresh(slots);
      return done();
    }

    timedPromise(bidProviders.map(function (bidder) {
      return bidder._fetchBids(nextBids[bidder.name]);
    }), bidTimeout).then(function (responses) {
      responses.forEach(function (res, i) {
        if (res.status === _timedPromise2.status.fulfilled) {
          bidProviders[i].onBidWon();
          bidProviders[i].handleResponse(res.data);
        }

        if (res.status === _timedPromise2.status.rejected) {
          bidProviders[i].onTimeout();
        }
      });
    }).catch(function (err) {
      return console.log('error', err);
    }).finally(function () {
      refresh(slots);
      done();
    });
  };
};
/** 
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Number} props.chunkSize - Max ads to process.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Function} props.getBids - Prebid function used to fetch bids.
 * @param {Number} props.refreshDelay - Refresh delay.
 * @function
 * @returns {Object}
 */


exports.processFn = processFn;

var bidManager = function bidManager() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var refresh = props.refresh,
      _props$chunkSize = props.chunkSize,
      chunkSize = _props$chunkSize === void 0 ? 5 : _props$chunkSize,
      _props$bidProviders = props.bidProviders,
      bidProviders = _props$bidProviders === void 0 ? [] : _props$bidProviders,
      _props$bidTimeout = props.bidTimeout,
      bidTimeout = _props$bidTimeout === void 0 ? 1000 : _props$bidTimeout,
      _props$refreshDelay = props.refreshDelay,
      refreshDelay = _props$refreshDelay === void 0 ? 100 : _props$refreshDelay,
      _props$onBiddersReady = props.onBiddersReady,
      onBiddersReady = _props$onBiddersReady === void 0 ? function () {} : _props$onBiddersReady;
  var refreshJob = new _JobQueue.default({
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: processFn(bidProviders, bidTimeout, refresh),
    canProcess: false
  }); // Wait for the bidders to be ready before starting the job.

  onBiddersReady(refreshJob.start);
  return {
    refresh: refreshJob.add
  };
};

var _default = bidManager;
exports.default = _default;