"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Will use call the requestAnimationFrame function. This is an alternative
 * to using a throttling function.
 * @param {Function} cb 
 * @function
 * @returns {void}
 */
var withRaf = function withRaf(cb) {
  var isTicking = false;
  return function (e) {
    if (!isTicking) {
      isTicking = true;
      window.requestAnimationFrame(function () {
        return cb(e);
      });
      isTicking = false;
    }
  };
};

var _default = withRaf;
exports.default = _default;