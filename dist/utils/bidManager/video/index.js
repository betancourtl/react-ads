"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _timedPromise = _interopRequireWildcard(require("../../timedPromise"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// TODO [] - Add tests
var processVideo = function processVideo(bidProviders, bidTimeout, q) {
  return new Promise(function (resolve) {
    var promises = [];
    if (q.isEmpty) return resolve('Que is empty'); // Get the bid params.

    var _loop = function _loop() {
      var _q$dequeue = q.dequeue(),
          data = _q$dequeue.data;

      var callback = data.callback,
          bids = data.bids,
          params = data.params;
      var nextBids = {}; // If there are bid then separate them by bidder type.

      if (bids) {
        Object.entries(bids).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              val = _ref2[1];

          if (!nextBids[key]) nextBids[key] = val;
        });
      }

      var noBidsOrProviders = [bidProviders, Object.keys(nextBids)].some(function (x) {
        return x.length === 0;
      }); // When no bidders are provided just call the callback fn

      if (noBidsOrProviders) return {
        v: promises.push(Promise.resolve(callback()))
      }; // If a bid is provided. Pass the bids to the bidProviders.

      var p = (0, _timedPromise.default)(bidProviders.map(function (bidder) {
        return bidder._fetchVideoBids(nextBids[bidder.name], params);
      }), bidTimeout).then(function (responses) {
        responses.forEach(function (res, i) {
          if (res.status === _timedPromise.status.fulfilled) {
            var bidderResponse = res.data; // handles the response. Calls the callback fn.

            bidProviders[i].handleVideoResponse(bidderResponse, callback);
          }

          if (res.status === _timedPromise.status.rejected) {
            bidProviders[i].onVideoBidTimeout(res);
          }
        });
      }).catch(function (err) {
        return console.log('error', err);
      }); // Save the promise in an arary so we can verify when they are all completed
      // using promise.all.

      promises.push(p);
    };

    while (!q.isEmpty) {
      var _ret = _loop();

      if (_typeof(_ret) === "object") return _ret.v;
    } // Finally resolve the promise.


    return Promise.all(promises).then(resolve).catch(resolve);
  });
};

var _default = processVideo;
exports.default = _default;