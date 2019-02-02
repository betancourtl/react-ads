import timedPromise, { status } from '../timedPromise';

const processVideo = (bidProviders, bidTimeout, q) => new Promise((resolve) => {
  let promises = [];

  // Get the bid params.
  while (!q.isEmpty) {
    const { data } = q.dequeue();
    const { callback, bids, params } = data;
    const nextBids = {};

    // If there are bid then separate them by bidder type.
    if (bids) {
      Object
        .entries(bids)
        .forEach(([key, val]) => {
          if (!nextBids[key]) nextBids[key] = val;
        });
    }

    const noBidsOrProviders = [bidProviders, Object.keys(nextBids)]
      .some(x => x.length === 0);

    // When no bidders are provided just call the callback fn
    if (noBidsOrProviders) return promises.push(Promise.resolve(callback()));

    // If a bid is provided. Pass the bids to the bidProviders.
    const p = timedPromise(
      bidProviders.map(bidder => bidder._fetchVideoBids(nextBids[bidder.name], params)),
      bidTimeout
    )
      .then(responses => {
        responses.forEach((res, i) => {
          if (res.status === status.fulfilled) {
            const bidderResponse = res.data;
            // handles the response. Calls the callback fn.
            bidProviders[i].handleVideoResponse(bidderResponse, callback);
          }

          if (res.status === status.rejected) {
            bidProviders[i].onTimeout();
          }
        });
      })
      .catch(err => console.log('error', err));

    // Save the promise in an arary so we can verify when they are all completed
    // using promise.all.
    promises.push(p);
  }

  // Finally resolve the promise.
  return Promise.all(promises)
    .then(resolve)
    .catch(resolve);
});

export default processVideo;
