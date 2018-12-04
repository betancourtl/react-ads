import Heap from '../Heap';

const minHeapCompareFn = (a, b) => a > b;

class MinHeap extends Heap {
  constructor(compareFn) {
    super(compareFn || minHeapCompareFn);
  }
}

export default MinHeap;
