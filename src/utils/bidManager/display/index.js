import timedPromise, { status } from '../../timedPromise';

// TODO [] - Add tests
/**
 * 
 * @param {Bidder[]} bidProviders 
 * @param {Number} bidTimeout 
 * @param {Function} refresh 
 * @param {Queue} q 
 * @returns {Promise}
 */
const processDisplay = (bidProviders, bidTimeout, refresh, q) => new Promise(resolve => {
  const slots = [];
  const nextBids = {};

  // tested
  if (q.isEmpty) return resolve();

  while (!q.isEmpty) {
    const { slot, bids } = q.dequeue().data;
    slots.push(slot);

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

  // expect bidder.fetchDisplayBids to be called.
  // expect bidder.handleResponse to be called.
  // expect refresh.toBeCalledTimes(1)
  timedPromise(
    bidProviders.map(bidder => bidder._fetchDisplayBids(nextBids[bidder.name])),
    bidTimeout
  )
    .then(responses => {
      responses.forEach((res, i) => {
        if (res.status === status.fulfilled) {          
          bidProviders[i].onBidWon(res.data);
          bidProviders[i].handleResponse(res.data);
        }

        if (res.status === status.rejected) {
          bidProviders[i].onTimeout(res.err);
        }
      });
    })
    .catch(err => console.log('error', err))
    .finally(() => {
      refresh(slots);
      resolve();
    });
});

export default processDisplay;
