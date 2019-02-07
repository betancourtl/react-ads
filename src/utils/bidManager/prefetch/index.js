import timedPromise, { status } from '../../timedPromise';

// This function will prefetch the display bids.
/**
 * 
 * @param {Bidder[]} bidProviders 
 * @param {Number} bidTimeout 
 * @param {Function} refresh 
 * @param {Queue} q 
 * @returns {Promise}
 */
const prefetchBids = (bidProviders, bidTimeout, q) => new Promise(resolve => {
  const nextBids = {};

  if (q.isEmpty) return resolve();

  while (!q.isEmpty) {
    const { bids } = q.dequeue().data;

    if (bids) {
      Object
        .entries(bids)
        .forEach(([key, val]) => {
          if (!nextBids[key]) nextBids[key] = [];
          nextBids[key].push(val);
        });
    }
  }

  const noBidsOrProviders = [bidProviders, Object.keys(nextBids)]
    .some(x => x.length === 0);

  if (noBidsOrProviders) return resolve();

  timedPromise(
    bidProviders.map(bidder => bidder._fetchDisplayBids(nextBids[bidder.name])),
    bidTimeout
  )
    .then(responses => {
      responses.forEach((res, i) => {
        if (res.status === status.fulfilled) {
          bidProviders[i].handlePrefetchedBids(res.data);
        }

        if (res.status === status.rejected) {
          bidProviders[i].onTimeout(res.err);
        }
      });
    })
    .catch(err => console.log('error', err))
    .finally(() => {
      resolve();
    });
});

export default prefetchBids;
