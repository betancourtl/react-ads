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

  _defineProperty(this, "on", function () {
    var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var eventCallback = arguments.length > 1 ? arguments[1] : undefined;
    var events = _this.state.events[eventName];

    if (!events) {
      _this.state.events[eventName] = [eventCallback];
    } else {
      _this.state.events[eventName].push(eventCallback);
    }
  });

  _defineProperty(this, "clear", function () {
    _this.state.events = {};
  });

  _defineProperty(this, "emit", function () {
    var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      props[_key - 1] = arguments[_key];
    }

    var event = _this.state.events[eventName];
    if (!event) return;
    event.forEach(function (fn) {
      return fn.apply(void 0, props);
    });
  });

  this.state = {
    events: {}
  };
}
/**
 * This callback is a function that can be passed to the PubSub event emitter.
 * @callback eventCallback
 * @param {*}
 */

/**
 * Will subscribe to an event, so that when the emit method is called. The
 * callback function can be called.
 * @function
 * @param {String} eventName - The event name that we want to subscript to.
 * @param {Function} eventCallback - The function that we want to call when an event happens.
 */
;

var _default = PubSub;
exports.default = _default;