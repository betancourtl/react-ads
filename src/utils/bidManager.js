import JobQueue from '../lib/JobQueue';

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
    getBids, 
    refresh, 
    prebidEnabled,
    chunkSize = 5,
    refreshDelay = 100,
  } = props;

  const refreshJob = new JobQueue({
    chunkSize: chunkSize,
    delay: refreshDelay,
    processFn: (q, done) => {
      const slots = [];
      const adUnits = [];
      
      while (!q.isEmpty) {
        const { slot, bids } = q.dequeue().data;
        slots.push(slot);
        if (bids) {
          adUnits.push(bids);
        }
      }
    
      if (!prebidEnabled || !adUnits) {
        refresh(slots);
        return done();
      }
  
      getBids(adUnits)
        .then(() => {
          refresh(slots);
        }).catch(err => {
          console.log('error', err);
        }).finally(() => {
          done();
        });
    }
  });

  return {
    refresh: refreshJob.add,
  };
};

export default bidManager;
