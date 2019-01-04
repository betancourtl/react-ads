class BidManager {
  constructor(name) {
    this.name = name;
  }

  interfaceError = (fnName) => {
    throw Error(`${fnName} is not implemented on ${this.name} BidManager`);
  }

  isBidRequestValid = () => {
    interfaceError('isBidRequestValid');
  }

  buildRequests = () => {
    interfaceError('buildRequests');
  }

  interpretResponse = () => {
    interfaceError('interpretResponse');
  }

  onTimeout = () => {
    interfaceError('onTimeout');
  }

  onBidWon = () => {
    interfaceError('onBidWon');
  }

  onSetTargeting = () => {
    interfaceError('onSetTargeting');
  }
};
