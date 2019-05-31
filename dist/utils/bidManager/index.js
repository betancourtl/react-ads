"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.processFn = void 0;

var _Queue = _interopRequireDefault(require("../../lib/Queue"));

var _JobQueue = _interopRequireDefault(require("../../lib/JobQueue"));

var _video = _interopRequireDefault(require("./video"));

var _display = _interopRequireDefault(require("./display"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
// TODO [] - Add tests

/**
 * This function will make bid requests and then call the bidders functions
 * for callbacks for a successfull bid call.
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Number} props.bidTimeout - Ammount of time to wait for bidders.
 * @param {Function} props.dispatchBidders - function that fetches the bids.
 * @param {Queue} q - The items that the job passed to thie processing fn.
 * @param {Promise.resolve} done - Resolves a promise and ends the job.
 * @function
 * @returns {void}
 */
var processFn = function processFn(bidProviders, bidTimeout, refresh) {
  return function (q, done) {
    var displayQueue = new _Queue.default();
    var videoQueue = new _Queue.default();

    while (!q.isEmpty) {
      var item = q.dequeue();
      if (item.data.type === 'video') videoQueue.enqueue(item);else if (item.data.type === 'display') displayQueue.enqueue(item);
    }

    Promise.all([(0, _video.default)(bidProviders, bidTimeout, videoQueue), (0, _display.default)(bidProviders, bidTimeout, refresh, displayQueue)]).then(done);
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
    canProcess: false,
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: processFn(bidProviders, bidTimeout, refresh)
  }); // Wait for the bidders to be ready before starting the job.

  onBiddersReady(refreshJob.start);
  return {
    refresh: refreshJob.add
  };
};

var _default = bidManager;
exports.default = _default;