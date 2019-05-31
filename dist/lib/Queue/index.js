"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Queue =
/*#__PURE__*/
function () {
  function Queue() {
    var _this = this;

    _classCallCheck(this, Queue);

    _defineProperty(this, "enqueue", function () {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      [].concat(items).forEach(function (item) {
        _this.items[_this.count] = item;
        _this.count++;
      });
      return _this;
    });

    _defineProperty(this, "dequeue", function () {
      if (_this.isEmpty) return;
      var item = _this.items[_this.lowestCount];
      delete _this.items[_this.lowestCount];
      _this.lowestCount++;
      return item;
    });

    _defineProperty(this, "clear", function () {
      _this.items = {};
      _this.lowestCount = 0;
      _this.count = 0;
    });

    _defineProperty(this, "peek", function () {
      if (_this.isEmpty) return undefined;
      return _this.items[_this.lowestCount];
    });

    _defineProperty(this, "toString", function () {
      if (_this.isEmpty) return '';
      return Object.keys(_this.items).map(function (x) {
        return _this.items[x];
      }).join(', ');
    });

    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }

  _createClass(Queue, [{
    key: "size",
    get: function get() {
      return this.count - this.lowestCount;
    }
  }, {
    key: "isEmpty",
    get: function get() {
      return this.size === 0;
    }
  }]);

  return Queue;
}();

var _default = Queue;
exports["default"] = _default;