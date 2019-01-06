const DEFAULT_TIMEOUT = 1000;
export const status = {
  rejected: 'rejected',
  fulfilled: 'fulfilled',
};
const resolved = data => ({ data, status: status.fulfilled });
const rejected = err => ({ err, status: status.rejected });
const reflect = p => p.then(resolved, rejected);

const dispatchBidders = (promises, ms = DEFAULT_TIMEOUT) => Promise
  .all([].concat(promises).map((promise) => {
    let timeout = new Promise((_, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in ' + ms + 'ms.');
      }, ms);
    });
    return reflect(Promise.race([promise, timeout]));
  }));

export default dispatchBidders;
