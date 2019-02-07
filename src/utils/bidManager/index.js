/* eslint-disable no-console */
import Queue from '../../lib/Queue';
import JobQueue from '../../lib/JobQueue';
import processVideo from './video';
import processDisplay from './display';
import prefetchBids from './prefetch';

/**
 * This function will make bid requests and then call the bidders functions
 * for callbacks for a successfull bid call.
 * @param {Bidder[]} props.bidProviders - Array of bidProviders.
 * @param {Number} props.bidTimeout - Ammount of time to wait for bidders.
 * @param {Queue} q - The items that the job passed to thie processing fn.
 * @param {Promise.resolve} done - Resolves a promise and ends the job.
 * @function
 * @returns {[]Slot}
 */
export const getBidsFn = (bidProviders, bidTimeout) => (q, done) => new Promise((resolve) => {
  const displayQueue = new Queue();
  const videoQueue = new Queue();
  const slots = [];
  const ids = [];

  while (!q.isEmpty) {
    const item = q.dequeue();
    if (item.data.type === 'video') videoQueue.enqueue(item);
    else if (item.data.type === 'display') {
      if (item.slot) slots.push(item.slot);
      if (item.id) ids.push(item.id);
      displayQueue.enqueue(item);
    }
  }

  Promise.all([
    processVideo(bidProviders, bidTimeout, videoQueue),
    processDisplay(bidProviders, bidTimeout, displayQueue),
  ]).then(() => {
    resolve({ slots, ids });
    done();
  });
});

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

  const waiting = {};

  const prebidJob = new JobQueue({
    canProcess: false,
    delay: 10,
    chunkSize: chunkSize,
    processFn: getBidsFn(bidProviders, bidTimeout).then(({ ids }) => {
      const slots = [];

      ids.forEach(id => {
        const item = waiting[id];
        if (!item) return;
        if (item.slot) slots.push(item.slot);
        delete waiting[id];
      });

      if (!slots.length) return;

      refreshJob.add({
        priority: 1,
        data: slots,
      });
    }),
  });

  const refreshJob = new JobQueue({
    canProcess: false,
    delay: 10,
    chunkSize: chunkSize,
    processFn: (q, done) => {
      const slots = [];
      while (!q.isEmpty) {
        const slot = q.dequeue().data;
        slots.push(slot);
      }
      refresh(slots);
      done();
    },
  });

  // fetche the bids and returns the slots.
  const bidJob = new JobQueue({
    canProcess: false,
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: getBidsFn(bidProviders, bidTimeout).then(({ slots }) => {
      if (!slots.length) return;
      refreshJob.add({ priority: 1, slots });
    }),
  });

  // Wait for the bidders to be ready before starting the job.
  onBiddersReady(bidJob.start);
  onBiddersReady(prebidJob.start);
  onBiddersReady(refreshJob.start);

  const refreshFn = message => {
    const id = message.id;

    if (message.type === 'prefetch') {
      waiting[id] = {
        slot: null,
        status: 'fetching',
      };

      return prebidJob.add(message);
    }

    else if (message.type === 'video') {
      return bidJob.add(message);
    }

    else if (message.type === 'display') {
      // check to see if it has prefetched bids.
      const found = waiting[id];

      if (!found) return bidJob.add(message);

      if (found.status === 'fetching') {
        found.slot = message.data.slot;
        return;
      }

      if (found.status === 'success') {
        found.slot = message.data.slot;
        var pbjs = window.pbjs || {};
        var googletag = window.googletag || {};
        googletag.cmd.push(function () {
          pbjs.que.push(function () {
            delete waiting[id];
            pbjs.setTargetingForGPTAsync([id]);
            refresh([message.slot]);
          });
        });
      }
    }
  };

  return {
    refresh: refreshFn,
  };
};

export default bidManager;
