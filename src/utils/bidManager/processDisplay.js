import timedPromise, { status } from '../timedPromise';

const processDisplay = (bidProviders, bidTimeout, refresh, q) => new Promise(resolve => {
  const slots = [];
  const nextBids = {};

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

export default processDisplay;
