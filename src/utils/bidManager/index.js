/* eslint-disable no-console */
import JobQueue from '../../lib/JobQueue';
import bidDispatcher from '../bidDispatcher';

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
    refreshDelay = 100,
    bidTimeout = 1000,
    bidProviders = [],
  } = props;


  const refreshJob = new JobQueue({
    chunkSize: chunkSize,
    delay: refreshDelay,
    processFn: (q, done) => {
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

      // There are no bidProviders or there are no bids requested.
      if ([bidProviders, Object.keys(nextBids)].some(x => x.length === 0)) {
        refresh(slots);
        return done();
      }

      // Fetch the bids.
      bidDispatcher(
        bidProviders.map(bidder => bidder.fetchBids(nextBids[bidder.name])),
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
    }
  });

  return {
    refresh: refreshJob.add,
  };
};

export default bidManager;
