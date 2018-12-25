const empyFn = () => { };

const types = {
  INITIAL: 'INITIAL',
  LAZY: 'LAZY'
};

const AdCallManager = (props = {}) => {
  const state = {
    heap: {},
    InitialQueue: [],
    LazyQueue: [],
    LazyRefreshQueue: [],
    isProcessing: false,
    requested: 0,
    rendered: 0,
    processDebounce: 10,
    chunkSize: 5,
    defineDelay: 100,
    refreshDelay: 100,
    displayFn: empyFn,
    refreshFn: empyFn,
    ...props,
  };

  const createMessage = (props = {}) => ({
    type: types.INITIAL,
    level: 1,
    data: {
      cb: empyFn,
      id: 'default-id'
    },
    ...props,
  });

  const define = (props) => {
    const message = createMessage(props);
    state.heap.add(message);
    if (!this.state.isProcessing) processDefinitions();
  };

  const processDefinitions = async () => {
    this.state.isProcessing = true;
    
    if (this.state.heap.empty()) {
      this.state.isProcessing = false;
      return;
    }

    [].forEach((message) => {
      if (message.type === 'initial') state.InitialQueue.add(message);
      if (message.type === 'lazy') state.LazyQueue.add(message);
    }, {});

    processInitialAds(state.InitialQueue);
    processLazyAds(state.LazyQueue);
    // process ads again.
    setTimeout(process, state.defineDelay);

  };

  const processInitialAds = (queue) => {
    const ids = [];
    
    while (queue.peek()) {
      const { id, cb } = queue.extract();
      cb();
      ids.push(id);
      state.displayFn(ids);
    }
  };

  const processLazyAds = () => {
    const lzq = state.LazyQueue;
    while (lzq.peek()) {
      const { cb } = lzq.extract();
      cb();
    }
  };

  const refresh = () => {
    const message = createMessage(props);
    state.LazyRefreshQueue.add(message);
    if (!state.isProcessing) processRefreshRequest(); //debounced
  };

  const processRefreshRequest = () => {
    const ids = [];
    const lzrq = state.LazyRefreshQueue;

    while (lzrq.peek()) {
      ids.push(lzrq.extract().id);
    }
    
    refresh(ids);
  };
};

