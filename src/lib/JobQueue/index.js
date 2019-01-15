/* eslint-disable no-console */
import Heap from '../MinHeap';
import Queue from '../Queue';
import PubSub from '../Pubsub';
import debounce from 'lodash.debounce';

class JobQueue {
  constructor(props) {
    this.pubsub = new PubSub();
    this.delay = props.delay || 0;
    this.isProcessing = false;
    this.chunkSize = props.chunkSize || 5;
    this.processFn = props.processFn || function (_, done) { done() };
    this.heap = new Heap((a, b) => a.priority > b.priority);
    this.canProcess = (() => {
      if (props.canProcess === false) return false;
      if (props.canProcess === true) return true;
      else return true;
    })();
    this.emit = {
      jobStart: () => this.pubsub.emit('jobStart'),
      jobEnd: () => this.pubsub.emit('jobEnd'),
    };
  }

  on = (evt, cb) => this.pubsub.on(evt, cb);

  off = (evt, cb) => this.pubsub.off(evt, cb);

  start = () => {
    this.canProcess = true;
    this.isProcessing = true;
    this.work();
    return this;
  }

  stop = () => this.canProcess = false;

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
    if (!this.canProcess) return this;
    this.isProcessing = true;
    // Only debounce the initial call. 
    // No need to keep debouncing recursive calls.
    this.debouncedWork();
    return this;
  };

  work = () => {
    this.process(this.q)
      .then(() => {
        if (!this.heap.isEmpty && this.canProcess) return this.work();
        else this.isProcessing = false;
      });
  };

  debouncedWork = debounce(
    this.work,
    this.delay, { leading: false, trailing: true }
  );

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
    this.emit.jobStart();

    return this.processFn(this.grab(5), () => {
      done();
      this.emit.jobEnd();
    });
  });

}

export default JobQueue;