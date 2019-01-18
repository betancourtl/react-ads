/* eslint-disable no-console */
import Heap from '../MinHeap';
import Queue from '../Queue';
import PubSub from '../Pubsub';
import debounce from 'lodash.debounce';

/**
 * The jobQue is a data structure that is in charge of processing items in 
 * batches.
 */
class JobQueue {
  constructor(props) {
    /**
     * @type {Heap}
     */
    this.heap = new Heap((a, b) => a.priority > b.priority);

    /**
     * @type {PubSub}
     */
    this.pubsub = new PubSub();

    /**
     * @type {Number}
     */
    this.delay = props.delay || 0;

    /**
     * @type {Boolean}
     */
    this.isProcessing = false;

    /**
     * @type {Number}
     */
    this.chunkSize = props.chunkSize || 5;

    /**
     * @type {Function}
     */
    this.processFn = props.processFn || function (_, done) { done(); };

    /**
     * @type {Boolean}
     */
    this.canProcess = (() => {
      if (props.canProcess === false) return false;
      if (props.canProcess === true) return true;
      else return true;
    })();

    /**
     * @type {Function}
     */
    this.debouncedWork = debounce(this.work, Number(this.delay));

    /**
     * @type {Object}
     */
    this.emit = {
      jobStart: () => this.pubsub.emit('jobStart'),
      jobEnd: () => this.pubsub.emit('jobEnd'),
    };
  }

  /**
   * Listens to an event and triggers the callback function when an event
   * is emitted.
   * @param {String} event
   * @param {Function} cb 
   * @returns {void}
   */
  on = (evt, cb) => this.pubsub.on(evt, cb);

  /**
   * Stops listening to an event by removing it from the list of callbacks.
   * @param {String} event
   * @param {Function} cb 
   * @returns {void}
   */
  off = (evt, cb) => this.pubsub.off(evt, cb);

  /**
   * Will start the jobQueue.
   * @returns {void}
   */
  start = () => {
    this.canProcess = true;
    this.isProcessing = true;
    this.work();
  }

  /**
   * Stops the next batch from being processed.
   * @returns {void}
   */
  stop = () => this.canProcess = false;

  /**
   * Stops the next batch from being processed.
   * @returns {void}
   */
  work = () => {
    this.process(this.q)
      .then(() => {
        if (!this.heap.isEmpty && this.canProcess) return this.work();
        else this.isProcessing = false;
      });
  };

  /**
   * Will add an item into the JobQueue.
   * @param {Number} message.priority - Priority level.
   * @param {*} message.data - The data related to this specific job item. 
   * @returns {JobQueue}
   */
  add = (message = {}) => {
    if (!message.priority || !message.data) {
      console.log('invalid job');
      return this;
    }

    this.heap.insert({
      priority: message.priority || 1,
      data: message.data,
    });

    if (this.isProcessing || !this.canProcess) return this;
    this.debouncedWork();
    return this;
  };

  /**
  * Takes x amount of items from the heap.
  * @returns {Queue}
  */
  grab = () => {
    let count = 0;
    let items = new Queue();
    while (!this.heap.isEmpty && count < this.chunkSize) {
      items.enqueue(this.heap.extract());
      count++;
    }

    return items;
  };

  /**
   * Uses the processFn passed into the class for handling the job. It passes
   * the done callback to the function used to indicate the the process is
   * completed.
   * @returns {Promise}
   */
  process = () => new Promise(resolve => {
    this.isProcessing = true;
    this.emit.jobStart();
    
    const done = () => {
      resolve();
      this.emit.jobEnd();
    };
    
    return this.processFn(this.grab(), done);
  });
}

export default JobQueue;