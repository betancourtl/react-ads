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
exports.status = status;

var resolved = function resolved(data) {
  return {
    data: data,
    status: status.fulfilled
  };
};

var rejected = function rejected(err) {
  return {
    err: err,
    status: status.rejected
  };
};

var reflect = function reflect(p) {
  return p.then(resolved, rejected);
};

var dispatchBidders = function dispatchBidders(promises) {
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

var _default = dispatchBidders;
exports.default = _default;