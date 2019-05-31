"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Pubsub - This is used to notify when monkey patched functions are called.
 * In the goolgetag library.
 * @class
 */
var PubSub = function PubSub() {
  var _this = this;

  _classCallCheck(this, PubSub);

  _defineProperty(this, "emit", function (name) {
    for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      props[_key - 1] = arguments[_key];
    }

    if (_this.events[name]) _this.events[name].forEach(function (fn) {
      return fn.apply(void 0, props);
    });
  });

  _defineProperty(this, "on", function (name, handler) {
    if (!_this.events[name]) _this.events[name] = [];

    _this.events[name].push(handler);
  });

  _defineProperty(this, "off", function (name, handler) {
    if (_this.events[name]) _this.events[name].splice(_this.events[name].indexOf(handler));
  });

  _defineProperty(this, "clear", function () {
    _this.events = {};
  });

  this.events = {};
}
/**
* Will emit an action and then call the functions that are subscribed to
* the event.
* @function
* @param {String} name - The event that we want to emit.
* @param {*} props - parameters to pass to the callback.
* @returns {void}
*/
;

var _default = PubSub;
exports.default = _default;