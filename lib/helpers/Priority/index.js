"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Queue = _interopRequireDefault(require("../../lib/Queue"));

var _Heap = _interopRequireDefault(require("../../lib/Heap"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Items get added into the heap.
// Wait .3 seconds before moving on to the queue.
// Items get removed from the heap into the queue.
// Queue gets processed
// when the queue has been processed execute a callback function (When all ads are rendered) peek the heap
// If there are more items repeat steps again.
// repeat steps
var createItem = function createItem() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _objectSpread({
    priority: 1,
    callback: function callback() {}
  }, props);
};

var AdQueue = function AdQueue(_ref) {
  var _this = this;

  var _ref$qSize = _ref.qSize,
      qSize = _ref$qSize === void 0 ? 5 : _ref$qSize;

  _classCallCheck(this, AdQueue);

  _defineProperty(this, "push", function (callback) {
    var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _this.heap.insert(createItem({
      priority: priority,
      callback: callback
    }));
  });

  _defineProperty(this, "process", function () {
    var i = 0;

    while (!_this.heap.isEmpty && _this.queue.size < _this.qty) {
      _this.queue.enqueue(_this.heap.extract());

      i++;
    }

    return _this.queue;
  });

  this.heap = new _Heap.default(function (a, b) {
    return a.priority > b.priority;
  });
  this.queue = new _Queue.default();
  this.qty = qSize;
};

var _default = AdQueue;
exports.default = _default;