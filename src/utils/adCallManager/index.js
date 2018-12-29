import MinHeap from '../../lib/MinHeap';
import Queue from '../../lib/Queue';
import debounce from 'debounce-promise';
/**
 * Empty function.
 * 
 * @function
 * @returns {void} 
 */
export const empyFn = () => { };

/**
 * @property {String} INITIAL - Ads that should load on the initial load.
 * @property {String} LAZY - Ads that should load after the initial load.
 */
export const types = {
  INITIAL: 'INITIAL',
  LAZY: 'LAZY'
};

/**
 * Creates the message object that the heap will accept. This contains all
 * the sorting parameters as well as the googletag callbacks.
 * 
 * @param {String} props.type - Type used to sort the heap.
 * @param {String} props.level - Level used to sort the heap.
 * @param {String} props.data.onDefine - Callback function when define is called.
 * @param {String} props.data.onDisplay - Callback function when display is called.
 * @param {String} props.data.id - Id of the ad.
 * @returns {Object}
 */
export const createMessage = (props = {}) => ({
  type: props.type || types.INITIAL,
  level: props.level || 1,
  data: {
    onDefine: (props.data && props.data.onDefine) ? props.data.onDefine : empyFn,
    onDisplay: (props.data && props.data.onDisplay) ? props.data.onDisplay : empyFn,
    id: (props.data && props.data.id) ? props.data.id : 'default-id',
  },
});

/**
 * 
 * @param {Object} msg1 - Heap message object created by the createMessage function.
 * @param {Object} msg2 - Heap message object created by the createMessage function.
 * @returns {Boolean}
 */
export const comparisonFn = (msg1, msg2) => {
  // type comparisons
  if (msg1.type === types.INITIAL && msg2.type === types.LAZY) return false;
  if (msg1.type === types.LAZY && msg2.type === types.INITIAL) return true;

  // priority comparisons
  return msg1.level > msg2.level;
};

/**
 * @function
 * @param {Number} props.chunkSize - Max number of ads the queue can process at 
 * a time.
 * @param {Number} props.defineDelay - Time to wait before the the initialQueue 
 * gets processed.
 * @param {Number} props.refreshDelay - Time to wait before the the 
 * lazyRefreshQueue gets processed.
 * @param {Number} props.displayFn - Googletag display fn.
 * @param {Number} props.refreshFn - Googletag refresh fn.
 * @returns {Object} - Returns the debounced refresh/define functions, that wrap
 *  the googletag.define and googletag.refresh functions.
 */
const adCallManager = (props = {}) => {
  const state = {
    heap: new MinHeap(comparisonFn),
    refreshQueue: new Queue(),
    chunkSize: props.chunkSize || 5,
    defineDelay: props.defineDelay || 150,
    refreshDelay: props.refreshDelay || 100,
    displayFn: props.displayFn || empyFn,
    refreshFn: props.refreshFn || empyFn,
    isProcessing: false,
    isRefreshing: false,
    //testing
    getBids: props.getBids || Promise.resolve,
    prebidEnabled: props.prebidEnabled || false,
  };

  window.managerState = () => state;

  /**
   * Gets the sate of the adCallManager.
   * @function
   * @returns {void}
   */
  const getState = () => state;

  /**
   * @function
   * @param {Object} props - Heap message.
   * @returns {void}
   */
  const define = (props = {}) => {
    const message = createMessage(props);
    state.heap.insert(message);

    if (state.isProcessing) return;
    
    const work = () => {
      state.isProcessing = true;
      processDefinitions()
        .then(() => {
          console.log('processing definitions', state.isProcessing);
          if (!state.heap.isEmpty) work();
          else state.isProcessing = false;
        });
    };
    work();
  };

  /**
   * Will process the the heap messages. It will delay a bit before the fn
   * gets called so that ads can bennefit from SRA architecture by fetching
   * various ads together.
   * @returns {void}
   */
  const processDefinitions = debounce(() => {
    return new Promise(resolve => {
      const queue = new Queue();
      let count = 0;
      // Should take 5
      while (!state.heap.isEmpty && count < state.chunkSize) {
        const message = state.heap.extract();
        queue.enqueue(message);
        count++;
      }

      displayAds(queue, resolve);
    });
  }, state.defineDelay, { leading: false });

  /**
   * These will process ads that are not lazy-loaded. It calls the display
   * and the refresh functions. Ads will display immediately after the refresh 
   * call.
   * @function
   * @param {Queue} queue - Initial ads queue.
   */
  const displayAds = (queue, resolve) => {
    const ids = [];
    const onDisplayCbs = [];
    if (queue.isEmpty) return resolve();

    while (!queue.isEmpty) {
      const { id, onDefine, onDisplay } = queue.dequeue().data;
      onDefine();
      ids.push(id);
      onDisplayCbs.push(onDisplay);
    }

    ids.forEach((id, i) => state.displayFn(id, onDisplayCbs[i]));
    resolve();
  };

  /**
   * Will refresh the googletag slots.
   * @function
   * @param {Slot} slot - googletag slot.
   */
  const refresh = slot => {
    state.refreshQueue.enqueue(slot);

    if (state.isRefreshing) return;

    const work = () => {
      state.isRefreshing = true;
      processRefreshRequest()
        .then(() => {
          if (!state.refreshQueue.isEmpty) work();
          else state.isRefreshing = false;
        });
    };
    work();
  };

  /**
   * Will wait a certain ammount of ms to allow additional ads that called refresh to be 
   * added to the queue. Then it will call the reresh function.
   * @function
   * @param {Slot} slot - googletag slot.
   */
  const processRefreshRequest = debounce(() => {
    return new Promise(resolve => {
      const slots = [];
      const adUnits = [];
      let count = 0;

      // Should take 5
      while (!state.refreshQueue.isEmpty && count < state.chunkSize) {
        const { slot, bidderCode } = state.refreshQueue.dequeue();
        slots.push(slot);
        if (bidderCode) adUnits.push(bidderCode);
        count++;
      }

      // Create the prebid object.      
      if (!adUnits) {
        state.refreshFn(slots);
        return resolve();
      }

      state.getBids(adUnits)
        .then(() => {
          state.refreshFn(slots);
        }).catch(err => {
          console.log('error', err);
        }).finally(() => {
          resolve();
        });
    });
  }, state.refreshDelay, { leading: false });

  return {
    refresh,
    define,
    getState,
    processDefinitions,
  };
};

export default adCallManager;
