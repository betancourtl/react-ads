import Queue from '../../lib/Queue';
import Heap from '../../lib/Heap';
import _debounce from 'lodash.debounce';

// Items get added into the heap.
// Wait .3 seconds before moving on to the queue.
// Items get removed from the heap into the queue.
// Queue gets processed
// when the queue has been processed execute a callback function (When all ads are rendered) peek the heap
// If there are more items repeat steps again.
// repeat steps

const createItem = (props = {}) => ({
  priority: 1,
  callback: () => {
  },
  ...props
});

class AdQueue {
  constructor({ qSize = 5 }) {
    this.heap = new Heap((a, b) => a.priority > b.priority);
    this.queue = new Queue();
    this.qty = qSize;
  }

  push = (callback, priority = 1) => {
    this.heap.insert(createItem({ priority, callback }));
  };

  process = () => {
    let i = 0;

    while (!this.heap.isEmpty && this.queue.size < this.qty) {
      this.queue.enqueue(this.heap.extract());
      i++;
    }

    return this.queue;
  }
}

export default AdQueue;