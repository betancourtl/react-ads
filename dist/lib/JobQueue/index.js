"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MinHeap = _interopRequireDefault(require("../MinHeap"));

var _Queue = _interopRequireDefault(require("../Queue"));

var _Pubsub = _interopRequireDefault(require("../Pubsub"));

var _lodash = _interopRequireDefault(require("lodash.debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var JobQueue = function JobQueue(props) {
  var _this = this;

  _classCallCheck(this, JobQueue);

  _defineProperty(this, "on", function (evt, cb) {
    return _this.pubsub.on(evt, cb);
  });

  _defineProperty(this, "off", function (evt, cb) {
    return _this.pubsub.off(evt, cb);
  });

  _defineProperty(this, "start", function () {
    _this.canProcess = true;
    _this.isProcessing = true;

    _this.work();

    return _this;
  });

  _defineProperty(this, "stop", function () {
    return _this.canProcess = false;
  });

  _defineProperty(this, "add", function () {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!message.priority || !message.data) {
      console.log('invalid job');
      return _this;
    }

    _this.heap.insert({
      priority: message.priority || 1,
      data: message.data
    });

    if (_this.isProcessing) return _this;
    if (!_this.canProcess) return _this;
    _this.isProcessing = true; // Only debounce the initial call. 
    // No need to keep debouncing recursive calls.

    _this.debouncedWork();

    return _this;
  });

  _defineProperty(this, "work", function () {
    _this.process(_this.q).then(function () {
      if (!_this.heap.isEmpty && _this.canProcess) return _this.work();else _this.isProcessing = false;
    });
  });

  _defineProperty(this, "debouncedWork", (0, _lodash.default)(this.work, this.delay, {
    leading: false,
    trailing: true
  }));

  _defineProperty(this, "grab", function () {
    var count = 0;
    var items = new _Queue.default();

    while (!_this.heap.isEmpty && count < _this.chunkSize) {
      items.enqueue(_this.heap.extract());
      count++;
    }

    return items;
  });

  _defineProperty(this, "process", function () {
    return new Promise(function (done) {
      _this.emit.jobStart();

      return _this.processFn(_this.grab(5), function () {
        done();

        _this.emit.jobEnd();
      });
    });
  });

  this.pubsub = new _Pubsub.default();
  this.delay = props.delay || 0;
  this.isProcessing = false;
  this.chunkSize = props.chunkSize || 5;

  this.processFn = props.processFn || function (_, done) {
    done();
  };

  this.heap = new _MinHeap.default(function (a, b) {
    return a.priority > b.priority;
  });

  this.canProcess = function () {
    if (props.canProcess === false) return false;
    if (props.canProcess === true) return true;else return true;
  }();

  this.emit = {
    jobStart: function jobStart() {
      return _this.pubsub.emit('jobStart');
    },
    jobEnd: function jobEnd() {
      return _this.pubsub.emit('jobEnd');
    }
  };
};

var _default = JobQueue;
exports.default = _default;