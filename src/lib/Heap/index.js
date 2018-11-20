// https://github.com/loiane/javascript-datastructures-algorithms/blob/master/src/js/data-structures/heap.js
class Heap {
  constructor(compareFn = (a, b) => a > b) {
    this.heap = [];
    this.compareFn = compareFn;
  }

  swap = (arr, a, b) => {
    const temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
    return arr;
  };

  get size() {
    return this.heap.length;
  }

  get isEmpty() {
    return this.heap.length === 0;
  }

  get min() {
    return this.isEmpty
      ? undefined
      : this.heap[0];
  }

  insert(val) {
    if (val === null) return false;
    const index = this.heap.length;
    this.heap.push(val);
    this.siftUp(index);
    return this;
  }

  // left index
  // (0 * 2) + 1 = 1
  // (1 * 2) + 1 = 3
  // (2 * 2) + 1 = 5
  // (3 * 2) + 1 = 7

  // right index
  // (0 * 2) + 2 = 2
  // (1 * 2) + 2 = 4
  // (2 * 2) + 2 = 6
  // (3 * 2) + 2 = 8

  //         0
  //      /    \
  //     1      2
  //    /\      /\
  //   3  4    5  6

  getLeftIndex = index => {
    return (index * 2) + 1;
  };

  getRightIndex = index => {
    return (index * 2) + 2;
  };

  getParentIndex = (index) => {
    if (index === 0) return undefined;
    return Math.floor((index - 1) / 2);
  };

  // [3, 5, 10, 15, 2];
  siftUp(index) {
    let parentIndex = this.getParentIndex(index);
    while (index > 0 && this.compareFn(this.heap[parentIndex], this.heap[index])) {
      this.swap(this.heap, parentIndex, index);
      index = parentIndex; // should be a lower index
      parentIndex = this.getParentIndex(index);
    }
  }

  siftDown(index) {
    let element = index;
    const left = this.getLeftIndex(index);
    const right = this.getRightIndex(index);
    const size = this.size;

    if (left < size && this.compareFn(this.heap[element], this.heap[left])) element = left;
    if (right < size && this.compareFn(this.heap[left], this.heap[right])) element = right;

    if (index !== element) {
      this.swap(this.heap, index, element);
      this.siftDown(element);
    }
  }

  //         0
  //      /    \
  //     1      2
  //    /\      /\
  //   3  4    5  6
  extract() {
    if (this.isEmpty) return undefined;
    if (this.size === 1) return this.heap.shift();
    const removedVal = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);
    return removedVal;
  }
}

export default Heap;
