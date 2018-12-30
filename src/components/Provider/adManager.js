import JobQueue from '../../lib/JobQueue';

/**
 * @function
 * @param {Number} props.chunkSize - Max ads to process.
 * @param {Number} props.defineDelay - Display delay
 * @param {Number} props.refreshDelay - Refresh delay.
 * @param {Number} props.displayFn - Googletag display fn.
 * @param {Number} props.refreshFn - Googletag refresh fn.
 * @returns {Object}
 */
const adManager = (props = {}) => {
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
        const { slot, bidderCode } = q.dequeue().data;
        slots.push(slot);
        if (bidderCode) {
          adUnits.push(bidderCode);
        }
      }
  
      // Create the prebid object.      
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

export default adManager;
