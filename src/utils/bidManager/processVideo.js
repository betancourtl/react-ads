import timedPromise, { status } from '../timedPromise';

const processVideo = (bidProviders, bidTimeout, refresh, q) => new Promise((resolve) => {
  while (!q.isEmpty) {
    const { callback } = q.dequeue().data;
    callback();
  }

  resolve();
});

export default processVideo;
