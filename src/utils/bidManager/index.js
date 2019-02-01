/* eslint-disable no-console */
import JobQueue from '../../lib/JobQueue';
import timedPromise, { status } from '../timedPromise';
import Queue from '../../lib/Queue';

export const processVideo = (bidProviders, bidTimeout, refresh, q) => new Promise((resolve) => {
  resolve();
});

export const processDisplay = (bidProviders, bidTimeout, refresh, q) => new Promise((resolve) => {
  console.log('q', q);
  const slots = [];
  const nextBids = {};

  while (!q.isEmpty) {
    const { slot, bids } = q.dequeue().data;
    slots.push(slot);

    // test
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

  if (noBidsOrProviders) {
    refresh(slots);
    return resolve();
  }

  timedPromise(
    bidProviders.map(bidder => bidder._fetchBids(nextBids[bidder.name])),
    bidTimeout
  )
    .then(responses => {
      responses.forEach((res, i) => {
        if (res.status === status.fulfilled) {
          bidProviders[i].onBidWon();
          bidProviders[i].handleResponse(res.data);
        }

        if (res.status === status.rejected) {
          bidProviders[i].onTimeout();
        }
      });
    })
    .catch(err => console.log('error', err))
    .finally(() => {
      refresh(slots);
      resolve();
    });
});

/**
 * This function will make bid requests and then call the bidders functions
 * for callbacks for a successfull bid call.
 * @param {Function} props.refresh - Googletag refresh fn.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Number} props.bidTimeout - Ammount of time to wait for bidders.
 * @param {Function} props.dispatchBidders - function that fetches the bids.
 * @param {Queue} q - The items that the job passed to thie processing fn.
 * @param {Promise.resolve} done - Resolves a promise and ends the job.
 * @function
 * @returns {void}
 */
export const processFn = (bidProviders, bidTimeout, refresh) => (q, done) => {
  const displayQueue = new Queue();
  const videoQueue = new Queue();

  while (!q.isEmpty) {
    const item = q.dequeue();
    if (item.data.type === 'video') videoQueue.enqueue(item);
    else if (item.data.type === 'display') displayQueue.enqueue(item);
  }

  Promise.all([
    processDisplay(bidProviders, bidTimeout, refresh, displayQueue),
    processVideo(bidProviders, bidTimeout, refresh, videoQueue),
  ]).then(done);
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
    onBiddersReady = () => { },
  } = props;

  const refreshJob = new JobQueue({
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: processFn(bidProviders, bidTimeout, refresh),
    canProcess: false
  });

  // Wait for the bidders to be ready before starting the job.
  onBiddersReady(refreshJob.start);

  return {
    refresh: refreshJob.add,
  };
};

export default bidManager;
