"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.status = void 0;
var DEFAULT_TIMEOUT = 1000;
var status = {
  rejected: 'rejected',
  fulfilled: 'fulfilled'
};
/**
 * Resolve promise handler.
 * @param {*} data
 * @returns {void}
 */

exports.status = status;

var resolved = function resolved(data) {
  return {
    data: data,
    status: status.fulfilled
  };
};
/**
 * Resolve promise handler.
 * @param {*} err 
 * @returns {void}
 */


var rejected = function rejected(err) {
  return {
    err: err,
    status: status.rejected
  };
};
/**
 * Reject promise handler.
 * @param {*} p
 * @returns {Object} 
 */


var reflect = function reflect(p) {
  return p.then(resolved, rejected);
};
/**
 * @param {Promise[]} promises
 * @param {Number} ms - Amount of time to wait for bid calls.
 * @returns {Object}
 */


var timedPromise = function timedPromise(promises) {
  var ms = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_TIMEOUT;
  return Promise.all([].concat(promises).map(function (promise) {
    var timeout = new Promise(function (_, reject) {
      var id = setTimeout(function () {
        clearTimeout(id);
        reject('Timed out in ' + ms + 'ms.');
      }, ms);
    });
    return reflect(Promise.race([promise, timeout]));
  }));
};

var _default = timedPromise;
exports.default = _default;