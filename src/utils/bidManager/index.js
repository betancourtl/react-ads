/* eslint-disable no-console */
import JobQueue from '../../lib/JobQueue';
import bidDispatcher from '../bidDispatcher';

// Create a bidProvider
// Create push bids into a Queue.

export const processFn = (bidProviders, bidTimeout, refresh, dispatchBidders = bidDispatcher) => (q, done) => {
  const slots = [];
  const nextBids = {};

  while (!q.isEmpty) {
    const { slot, bids } = q.dequeue().data;
    slots.push(slot);

    if (!bids) break;

    Object
      .entries(bids)
      .forEach(([key, val]) => {
        if (!nextBids[key]) nextBids[key] = [];
        nextBids[key].push(val);
      });
  }

  const noBidsOrProviders = [bidProviders, Object.keys(nextBids)]
    .some(x => x.length === 0);

  if (noBidsOrProviders) {
    refresh(slots);
    return done();
  }

  // Fetch the bids.
  dispatchBidders(
    // calls Promise.all[]
    bidProviders.map(bidder => bidder._fetchBids(nextBids[bidder.name])),
    bidTimeout
  )
    .then((responses) => {
      responses.forEach((res, i) => {
        if (res.status === 'fulfilled') {
          bidProviders[i].onBidWon();
          bidProviders[i].handleResponse(res.data);
        }

        if (res.status === 'rejected') {
          bidProviders[i].onTimeout();
        }
      });
    })
    .catch(err => console.log('error', err))
    .finally(() => {
      refresh(slots);
      done();
    });
};

/** 
 * @param {Number} props.chunkSize - Max ads to process.
 * @param {Number} props.refreshDelay - Refresh delay.
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Function} props.getBids - Prebid function used to fetch bids.
 * @param {Boolean} props.prebidEnabled - Function to used to fetch prebid bids.
 * @function
 * @returns {Object}
 */
const bidManager = (props = {}) => {
  const {
    refresh,
    chunkSize = 5,
    bidProviders = [],
    bidTimeout = 1000,
    refreshDelay = 100,
  } = props;

  const refreshJob = new JobQueue({
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: processFn(bidProviders, bidTimeout, refresh),
  });

  return {
    refresh: refreshJob.add,
  };
};

export default bidManager;
