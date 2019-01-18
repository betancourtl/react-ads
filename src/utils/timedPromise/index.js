const DEFAULT_TIMEOUT = 1000;
export const status = {
  rejected: 'rejected',
  fulfilled: 'fulfilled',
};

/**
 * Resolve promise handler.
 * @param {*} data
 * @returns {void}
 */
const resolved = data => ({ data, status: status.fulfilled });

/**
 * Resolve promise handler.
 * @param {*} err 
 * @returns {void}
 */
const rejected = err => ({ err, status: status.rejected });

/**
 * Reject promise handler.
 * @param {*} p
 * @returns {Object} 
 */
const reflect = p => p.then(resolved, rejected);

/**
 * @param {Promise[]} promises
 * @param {Number} ms - Amount of time to wait for bid calls.
 * @returns {Object}
 */
const timedPromise = (promises, ms = DEFAULT_TIMEOUT) => Promise
  .all([].concat(promises).map((promise) => {
    let timeout = new Promise((_, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in ' + ms + 'ms.');
      }, ms);
    });
    return reflect(Promise.race([promise, timeout]));
  }));

export default timedPromise;
