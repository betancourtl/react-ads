/* eslint-disable no-console */
import Queue from '../../lib/Queue';
import JobQueue from '../../lib/JobQueue';
import processVideo from './video';
import processDisplay from './display';

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
export const getBidsFn = (bidProviders, bidTimeout) => (q, done) => {
  const displayQueue = new Queue();
  const videoQueue = new Queue();
  const slots = [];
  const ids = [];

  while (!q.isEmpty) {
    const item = q.dequeue();
    if (item.data.type === 'video') videoQueue.enqueue(item);
    else if (item.data.type === 'display') {
      if (item.data.slot) slots.push(item.data.slot);
      if (item.data.id) ids.push(item.data.id);
      displayQueue.enqueue(item);
    }
  }

  Promise.all([
    processVideo(bidProviders, bidTimeout, videoQueue),
    processDisplay(bidProviders, bidTimeout, displayQueue),
  ]).then(() => done({ slots, ids }));
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

  const waiting = {};

  const prebidJob = new JobQueue({
    canProcess: false,
    delay: 10,
    chunkSize: chunkSize,
    processFn: getBidsFn(bidProviders, bidTimeout)
  });

  prebidJob.on('jobEnd', ({ ids }) => {
    console.log('ids', ids);
    console.log('waiting', waiting);
    const slots = [];
    const idArr = [];

    ids.forEach(id => {
      const item = waiting[id];
      item.status = 'success';
      if (item.slot) {
        slots.push(item.slot);
        idArr.push(id);
        delete waiting[id];
      }
    });

    if (!slots.length) return;

    var pbjs = window.pbjs || {};
    var googletag = window.googletag || {};
    googletag.cmd.push(function () {
      pbjs.que.push(function () {
        console.log('setting targeting');
        pbjs.setTargetingForGPTAsync(idArr);
        refreshJob.add({
          priority: 1,
          data: slots,
        });
      });
    });
  });

  const refreshJob = new JobQueue({
    canProcess: false,
    delay: 10,
    chunkSize: chunkSize,
    processFn: (q, done) => {
      while (!q.isEmpty) {
        const slots = q.dequeue().data.slots;
        if (slots) {
          refresh(slots);
        }
      }
      done();
    },
  });

  const bidJob = new JobQueue({
    canProcess: false,
    delay: refreshDelay,
    chunkSize: chunkSize,
    processFn: getBidsFn(bidProviders, bidTimeout)
  });

  bidJob.on('jobEnd', (results) => {
    if (!results || !results.slots) return;
    const { slots } = results;
    if (!slots.length) return;
    refreshJob.add({ priority: 1, data: { slots } });
  });

  // Wait for the bidders to be ready before starting the job.
  onBiddersReady(bidJob.start);
  onBiddersReady(prebidJob.start);
  onBiddersReady(refreshJob.start);

  const refreshFn = message => {
    const id = message.data.id;

    if (message.data.type === 'prefetch') {
      waiting[id] = {
        slot: null,
        status: 'fetching',
      };
      message.data.type = 'display';
      return prebidJob.add(message);
    }

    if (message.data.type === 'video') {
      return bidJob.add(message);
    }

    else if (message.data.type === 'display') {
      // check to see if it has prefetched bids.
      const found = waiting[id];

      if (!found) return bidJob.add(message);

      if (found.status === 'fetching') {
        found.slot = message.data.slot;
        // console.log('display ad is being fetched', message.data.id);
        return;
      }

      if (found.status === 'success') {
        found.slot = message.data.slot;
        var pbjs = window.pbjs || {};
        var googletag = window.googletag || {};
        googletag.cmd.push(function () {
          pbjs.que.push(function () {
            console.log('display ad success is being refreshsed', id);
            delete waiting[id];
            pbjs.setTargetingForGPTAsync([id]);
            refresh([message.data.slot]);
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
