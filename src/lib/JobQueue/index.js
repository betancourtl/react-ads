import Heap from '../MinHeap';
import Queue from '../Queue';
import debounce from 'lodash.debounce';

class JobQueue {
  constructor(props) {
    this.delay = props.delay || 0;
    this.isProcessing = false;
    this.chunkSize = props.chunkSize || 5;
    this.processFn = props.processFn || function(_ , done) { done()};
    this.heap = new Heap((a , b) => a.priority > b.priority);
  }

  add = (message = {}) => {
    if (!message.priority || !message.data) {
      console.log('invalid job');
      return this;
    }

    this.heap.insert({
      priority: message.priority || 1,
      data: message.data,
    });

    if (this.isProcessing) return this;
    this.isProcessing = true;
    this.work();
    return this;
  };

  work = debounce(() => {   
    this.process(this.q)
      .then(() => {
        if (!this.heap.isEmpty) this.work();
        else this.isProcessing = false;
      });
  }, this.delay);

  grab = () => {
    let count = 0;
    let items = new Queue();
    while (!this.heap.isEmpty && count < this.chunkSize) {
      items.enqueue(this.heap.extract());
      count++;
    }

    return items;
  };

  process = () => new Promise((done) => {
    return this.processFn(this.grab(5), done);
  });

};

export default JobQueue;