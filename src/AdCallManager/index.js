import MinHeap from '../lib/MinHeap';
import Queue from '../lib/Queue';
import debounce from 'debounce-promise';

export const empyFn = () => { };

export const types = {
  INITIAL: 'INITIAL',
  LAZY: 'LAZY'
};

export const createMessage = (props = {}) => ({
  type: props.type || types.INITIAL,
  level: props.level || 1,
  data: {
    onDefine: (props.data && props.data.onDefine) ? props.data.onDefine : empyFn,
    onDisplay: (props.data && props.data.onDisplay) ? props.data.onDisplay : empyFn,
    id: (props.data && props.data.id) ? props.data.id : 'default-id',
  },
});

export const comparisonFn = (msg1, msg2) => {
  // type comparisons
  if (msg1.type === types.INITIAL && msg2.type === types.LAZY) return false;
  if (msg1.type === types.LAZY && msg2.type === types.INITIAL) return true;

  // priority comparisons
  return msg1.priority > msg2.priority;
};

const adCallManager = (props = {}) => {
  const state = {
    heap: new MinHeap(comparisonFn),
    initialQueue: new Queue(),
    lazyQueue: new Queue(),
    lazyRefreshQueue: new Queue(),
    chunkSize: props.chunkSize || 5,
    defineDelay: props.defineDelay || 150,
    refreshDelay: props.refreshDelay || 100,
    displayFn: props.displayFn || empyFn,
    refreshFn: props.refreshFn || empyFn,
    isProcessing: false,
    //testing
    processInitialAds: props.processInitialAds || true,
    processLazyAds: props.processLazyAds || true,
  };

  const getState = () => state;

  const define = (props = {}) => {
    const message = createMessage(props);
    state.heap.insert(message);
    if (state.isProcessing) return;

    processDefinitions()
      .then(() => {
        if (!state.heap.isEmpty) processDefinitions();
      });
  };

  const processDefinitions = debounce(() => {
    return new Promise(resolve => {
      let count = 0;
      // Should take 5
      while (!state.heap.isEmpty && count < state.chunkSize) {
        const message = state.heap.extract();
        if (message.type === types.INITIAL) state.initialQueue.enqueue(message);
        else if (message.type === types.LAZY) state.lazyQueue.enqueue(message);
        count++;
      }

      if (state.processInitialAds) processInitialAds(state.initialQueue);
      if (state.processLazyAds) processLazyAds(state.lazyQueue);
      resolve();
    });
  }, state.defineDelay, { leading: false });

  const processInitialAds = queue => {
    const ids = [];
    const onDisplayCbs = [];
    const slots = [];
    if (queue.isEmpty) return;

    while (!queue.isEmpty) {
      const { id, onDefine, onDisplay } = queue.dequeue().data;
      ids.push(id);
      onDisplayCbs.push(onDisplay);
      slots.push(onDefine());
    }

    ids.forEach((id, i) => {
      state.displayFn(id);
      onDisplayCbs[i]();
    });

    state.refreshFn(slots);
  };

  const processLazyAds = queue => {    
    const ids = [];
    const onDisplayCbs = [];
    const slots = [];

    if (queue.isEmpty) return;

    while (!queue.isEmpty) {
      const { id, onDefine, onDisplay } = queue.dequeue().data;
      ids.push(id);
      slots.push(onDefine());
      onDisplayCbs.push(onDisplay);
    }

    ids.forEach((id, i) => {
      state.displayFn(id);
      onDisplayCbs[i]();
    });
  };

  const refresh = slot => {
    state.lazyRefreshQueue.enqueue(slot);
    processRefreshRequest(state.lazyRefreshQueue);
  };

  const processRefreshRequest = debounce(queue => {
    const slots = [];
    if (queue.isEmpty) return;

    while (!queue.isEmpty) {
      const slot = queue.dequeue();
      slots.push(slot);
    }

    state.refreshFn(slots);
  }, state.refreshDelay, { leading: false });

  return {
    refresh,
    define,
    getState,
    processDefinitions,
  };
};

export default adCallManager;
