/**
 * @class
 * @classdesc Acts as an interface to communicate with the bidding system.
 */
class Bidder {
  constructor(name) {
    if (!name) throw Error('Bidder expects a name to be passed.');

    /**
     * The name of the bidder.
     * @type {String}
     */
    this.name = name;

    /**
     * If the bidder is ready to make bids.
     * @type {Boolean}
     */
    this.isReady = false;

    /**
     * Bids timeout. If the bidder does not get any responses from the server in
     * the specified amount of time it will end the bidder request.
     * @type {Number}
     */
    this.timeout = 1000;

    /**
     * Failsafe timeout used to stop waiting fir bids in case the first timeout 
     * fails for some reason.
     * @type {Number}
     */
    this.safeTimeout = 3000;
  }

  /**
   * Internal function used to throw errors in methods that are not defined.
   * @private
   * @throws
   * @param {String}
   * @returns {void}   
   */
  _interfaceError = (fnName) => {
    throw Error(`${fnName} is not implemented on ${this.name} Bidder.`);
  }

  /**
   * Should call the init function and set the bidder status to ready.
   * @private
   * @function
   * @returns {Promise}
   */
  _init = (x) => {
    const p = this.init(x);
    if (p && p.then) return p
      .then(() => {
        this.isReady = true;
        return `${this.name} resolved`;
      })
      .catch(() => {
        this.isReady = false;
        return `${this.name} rejected`;
      });
    else {
      this.isReady = true;
      return Promise.resolve(`${this.name} resolved`);
    }
  }

  /**
   * Initializes the bidder.
   * @function
   * @returns {void}
   */
  init = () => {
    this._interfaceError('init');
  }

  /**
   * Handles the bidders response.
   * @function
   * @returns {*}
   */
  handleResponse = () => {
    this._interfaceError('handleResponse');
  }

  /**
   * Handles the bidders onTimeout event. This happens when the bidder gets no
   * response from the server in x amount of time.
   * @function
   * @returns {*}
   */
  onTimeout = () => {
    this._interfaceError('onTimeout');
  }

  /**
   * Handles the video bidder timeout. This happens when the bidder gets no
   * response from the server in x amount of time.
   * @function
   * @returns {*}
   */
  onVideoBidTimeout = () => {
    this._interfaceError('onVideoBidTimeout');
  }

  /**
   * Handles the bidders onBidWon event. This happens when the bidder bids back
   * from the server.
   * @function
   * @returns {*}
   */
  onBidWon = () => {
    this._interfaceError('onBidWon');
  }

  /**
   * Will automatically handle timing out the promise in the case
   * that it exceeds the ammount of time that it should take to
   * get bids back from the server.
   */
  _fetchDisplayBids = (...props) => new Promise((resolve, reject) => {
    if (!this.isReady) {
      console.log(`${this.name} Bidder is not ready`);
      return reject('Bidder is not ready.');
    }

    const id = setTimeout(() => {
      reject('Timed Out');
    }, this.safeTimeout);

    return this.fetchDisplayBids(...props)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(id);
      });
  });

  /**
   * Will make the API call to fetch the bids.
   * @function
   * @returns {Promise}
   */
  fetchDisplayBids = () => {
    this._interfaceError('fetchDisplayBids');
  };

  /**
   * Will automatically handle timing out the promise in the case
   * that it exceeds the ammount of time that it should take to
   * get bids back from the server.
   */
  _fetchVideoBids = (...props) => new Promise((resolve, reject) => {
    if (!this.isReady) {
      console.log(`${this.name} Bidder is not ready`);
      return reject('Bidder is not ready.');
    }

    const id = setTimeout(() => {
      reject('Timed Out');
    }, this.safeTimeout);

    return this.fetchVideoBids(...props)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(id);
      });
  });

  /**
   * Will make the API call to fetch the bids.
   * @function
   * @returns {Promise}
   */
  fetchVideoBids = () => {
    this._interfaceError('fetchVideoBids');
  };
}

export default Bidder;
