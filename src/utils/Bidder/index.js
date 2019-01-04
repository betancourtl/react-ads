class Bidder {
  constructor(name) {
    this.name = name;
    this.bidQueue = [];
    this.isReady = false;
    this.timeout = 1000;
    this.safeTimeout = 3000;
  }

  interfaceError = (fnName) => {
    throw Error(`${fnName} is not implemented on ${this.name} Bidder`);
  }

  // Should call the init fn.
  _init = () => {
    const p = this.init()
    if (!p.then) this.isReady = true;
    else p.then(() => this.isReady = true);
  }

  init = () => {
    interfaceError('init');
  }

  handleResponse = () => {
    interfaceError('interpretResponse');
  }

  onTimeout = () => {
    interfaceError('onTimeout');
  }

  onBidWon = () => {
    interfaceError('onBidWon');
  }
};

export default Bidder;