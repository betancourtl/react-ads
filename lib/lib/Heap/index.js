"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// https://github.com/loiane/javascript-datastructures-algorithms/blob/master/src/js/data-structures/heap.js
var Heap =
/*#__PURE__*/
function () {
  function Heap() {
    var compareFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (a, b) {
      return a > b;
    };

    _classCallCheck(this, Heap);

    _defineProperty(this, "swap", function (arr, a, b) {
      var temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;
      return arr;
    });

    _defineProperty(this, "getLeftIndex", function (index) {
      return index * 2 + 1;
    });

    _defineProperty(this, "getRightIndex", function (index) {
      return index * 2 + 2;
    });

    _defineProperty(this, "getParentIndex", function (index) {
      if (index === 0) return undefined;
      return Math.floor((index - 1) / 2);
    });

    this.heap = [];
    this.compareFn = compareFn;
  }

  _createClass(Heap, [{
    key: "insert",
    value: function insert(val) {
      if (val === null) return false;
      var index = this.heap.length;
      this.heap.push(val);
      this.siftUp(index);
      return this;
    }
  }, {
    key: "siftUp",
    // [3, 5, 10, 15, 2];
    value: function siftUp(index) {
      var parentIndex = this.getParentIndex(index);

      while (index > 0 && this.compareFn(this.heap[parentIndex], this.heap[index])) {
        this.swap(this.heap, parentIndex, index);
        index = parentIndex; // should be a lower index

        parentIndex = this.getParentIndex(index);
      }
    }
  }, {
    key: "siftDown",
    value: function siftDown(index) {
      var element = index;
      var left = this.getLeftIndex(index);
      var right = this.getRightIndex(index);
      var size = this.size;
      if (left < size && this.compareFn(this.heap[element], this.heap[left])) element = left;
      if (right < size && this.compareFn(this.heap[element], this.heap[right])) element = right;

      if (index !== element) {
        this.swap(this.heap, index, element);
        this.siftDown(element);
      }
    }
  }, {
    key: "extract",
    value: function extract() {
      if (this.isEmpty) return undefined;
      if (this.size === 1) return this.heap.shift();
      var removedVal = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.siftDown(0);
      return removedVal;
    }
  }, {
    key: "size",
    get: function get() {
      return this.heap.length;
    }
  }, {
    key: "isEmpty",
    get: function get() {
      return this.heap.length === 0;
    }
  }, {
    key: "min",
    get: function get() {
      return this.isEmpty ? undefined : this.heap[0];
    }
  }]);

  return Heap;
}();

var _default = Heap;
exports.default = _default;