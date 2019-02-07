"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getBidsFn = void 0;

var _Queue = _interopRequireDefault(require("../../lib/Queue"));

var _JobQueue = _interopRequireDefault(require("../../lib/JobQueue"));

var _video = _interopRequireDefault(require("./video"));

var _display = _interopRequireDefault(require("./display"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

/**
 * This function will make bid requests and then call the bidders functions
 * for callbacks for a successfull bid call.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Number} props.bidTimeout - Ammount of time to wait for bidders.
 * @param {Queue} q - The items that the job passed to thie processing fn.
 * @param {Promise.resolve} done - Resolves a promise and ends the job.
 * @function
 * @returns {[]Slot}
 */
var getBidsFn = function getBidsFn(bidProviders, bidTimeout) {
  return function (q, done) {
    var displayQueue = new _Queue.default();
    var videoQueue = new _Queue.default();
    var slots = [];
    var ids = [];

    while (!q.isEmpty) {
      var item = q.dequeue();
      if (item.data.type === 'video') videoQueue.enqueue(item);else if (item.data.type === 'display') {
        if (item.data.slot) slots.push(item.data.slot);
        if (item.data.id) ids.push(item.data.id);
        displayQueue.enqueue(item);
      }
    }

    Promise.all([(0, _video.default)(bidProviders, bidTimeout, videoQueue), (0, _display.default)(bidProviders, bidTimeout, displayQueue)]).then(function () {
      return done({
        slots: slots,
        ids: ids
      });
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


exports.getBidsFn = getBidsFn;

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
  var waiting = {};
  var prebidJob = new _JobQueue.default({
    canProcess: false,
    delay: 10,
    chunkSize: chunkSize,
    processFn: getBidsFn(bidProviders, bidTimeout)
  });
  prebidJob.on('jobEnd', function (_ref) {
    var ids = _ref.ids;
    console.log('ids', ids);
    console.log('waiting', waiting);
    var slots = [];
    var idArr = [];
    ids.forEach(function (id) {
      var item = waiting[id];
      item.status = 'success';

      if (item.slot) {
        slots.push(item.slot);
        idArr.push(id);
        delete waiting[id];
      }
    });
    if (!slots.length) return;
    var pbjs = window.pbjs || {};
    var googletag = window.googletag || {};
    googletag.cmd.push(function () {
      pbjs.que.push(function () {
        console.log('setting targeting');
        pbjs.setTargetingForGPTAsync(idArr);
        refreshJob.add({
          priority: 1,
          data: slots
        });
      });
    });
  });
  var refreshJob = new _JobQueue.default({
    canProcess: false,
    delay: 10,
    chunkSize: chunkSize,
    processFn: function processFn(q, done) {
      while (!q.isEmpty) {
        var slots = q.dequeue().data.slots;

        if (slots) {
          refresh(slots);
        }
      }

      done();
    }
  });
  var bidJob = new _JobQueue.default({
    canProcess: false,
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: getBidsFn(bidProviders, bidTimeout)
  });
  bidJob.on('jobEnd', function (results) {
    if (!results || !results.slots) return;
    var slots = results.slots;
    if (!slots.length) return;
    refreshJob.add({
      priority: 1,
      data: {
        slots: slots
      }
    });
  }); // Wait for the bidders to be ready before starting the job.

  onBiddersReady(bidJob.start);
  onBiddersReady(prebidJob.start);
  onBiddersReady(refreshJob.start);

  var refreshFn = function refreshFn(message) {
    var id = message.data.id;

    if (message.data.type === 'prefetch') {
      waiting[id] = {
        slot: null,
        status: 'fetching'
      };
      message.data.type = 'display';
      return prebidJob.add(message);
    }

    if (message.data.type === 'video') {
      return bidJob.add(message);
    } else if (message.data.type === 'display') {
      // check to see if it has prefetched bids.
      var found = waiting[id];
      if (!found) return bidJob.add(message);

      if (found.status === 'fetching') {
        found.slot = message.data.slot; // console.log('display ad is being fetched', message.data.id);

        return;
      }

      if (found.status === 'success') {
        found.slot = message.data.slot;
        var pbjs = window.pbjs || {};
        var googletag = window.googletag || {};
        googletag.cmd.push(function () {
          pbjs.que.push(function () {
            console.log('display ad success is being refreshsed', id);
            delete waiting[id];
            pbjs.setTargetingForGPTAsync([id]);
            refresh([message.data.slot]);
          });
        });
      }
    }
  };

  return {
    refresh: refreshFn
  };
};

var _default = bidManager;
exports.default = _default;