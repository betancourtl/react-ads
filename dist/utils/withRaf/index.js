"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

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