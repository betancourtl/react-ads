/* eslint-disable no-console */
import Queue from '../../lib/Queue';
import JobQueue from '../../lib/JobQueue';
import processVideo from './video';
import processDisplay from './display';

// TODO [] - Add tests

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
    processVideo(bidProviders, bidTimeout, videoQueue),
    processDisplay(bidProviders, bidTimeout, refresh, displayQueue),
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
    canProcess: false,
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: processFn(bidProviders, bidTimeout, refresh),
  });

  // Wait for the bidders to be ready before starting the job.
  onBiddersReady(refreshJob.start);

  return {
    refresh: refreshJob.add,
  };
};

export default bidManager;
