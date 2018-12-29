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

  const displayFn = display => (q, done) => {
    const ids = [];
    const onDisplayCbs = [];
    if (q.isEmpty) return done();

    while (!q.isEmpty) {
      const { id, onDefine, onDisplay } = q.dequeue().data;
      onDefine();
      ids.push(id);
      onDisplayCbs.push(onDisplay);
    }

    ids.forEach((id, i) => display(id, onDisplayCbs[i]));
    done();
  };

  const refreshFn = (refresh, getBids, prebidEnabled) => (q, done) => {
    const slots = [];
    const adUnits = [];

    while (!q.isEmpty) {
      const { slot, bidderCode } = q.dequeue().data;
      slots.push(slot);
      if (bidderCode) adUnits.push(bidderCode);
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
  };

  const displayJob = new JobQueue({
    chunkSize: props.chunkSize || 5,
    delay: props.defineDelay || 100,
    processFn: displayFn(props.displayFn),
  });

  const refreshJob = new JobQueue({
    chunkSize: props.chunkSize || 5,
    delay: props.refreshDelay || 100,
    processFn: refreshFn(props.refreshFn, props.getBids, props.prebidEnabled),
  });

  return {
    refresh: refreshJob.add,
    define: displayJob.add,
  };
};

export default adManager;
