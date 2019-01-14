/* eslint-disable no-console */
import JobQueue from '../../lib/JobQueue';
import bidDispatcher from '../bidDispatcher';

/**
 * This function will make bid requests and then call the bidders functions
 * for callbacks for a successfull bid call.
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Number} props.bidTimeout - Ammount of time to wait for bidders.
 * @param {Function} props.dispatchBidders - function that fetches the bids.
 * @param {Function} q - The items that the job passed to thie processing fn.
 * @param {Function} done - Resolves a promise and ends the job.
 */
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

  dispatchBidders(
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
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Number} props.chunkSize - Max ads to process.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Function} props.getBids - Prebid function used to fetch bids.
 * @param {Number} props.refreshDelay - Refresh delay.
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
