import processVideo from './';
import Bidder from '../../Bidder';
import Queue from '../../../lib/Queue';

const createVideoAdUnit = (adUnit = {}, callback, params = {}) => ({
  priority: 1,
  data: {
    params,
    callback,
    type: 'video',
    bids: adUnit,
  }
});

describe('video', () => {
  let bidder;
  beforeEach(() => {
    bidder = new Bidder('prebid');
    bidder.init = Promise.resolve;
    bidder.onBidWon = jest.fn();
    bidder.onTimeout = jest.fn();
    bidder.handleVideoResponse = jest.fn();
    bidder.fetchVideoBids = jest.fn().mockImplementation(() => Promise.resolve('resolved'));
    bidder.onVideoBidTimeout = jest.fn();
    // initialize the bidder to aviod waiting for the promise.
    bidder.isReady = true;
  });

  test('Should resolve a Promise, when the Queue is empty', done => {
    const promise = processVideo([bidder], 1400, new Queue());
    promise.then(res => {
      expect(res).toBe('Que is empty');
      done();
    });
  });

  test('Should resolve a Promise and call the cb, when there are no bidProviders', done => {
    const bid = {
      prebid: {
        code: 'video-1',
        mediaTypes: {
          video: {
            context: 'instream',
            playerSize: [640, 480],
          },
        },
        bids: []
      }
    };

    const cb = jest.fn();
    const adUnit = createVideoAdUnit(bid, cb);

    const q = new Queue();
    q.enqueue(adUnit);

    const promise = processVideo([bidder], 1400, q);
    promise.then(res => {
      expect(bidder.handleVideoResponse).toBeCalledTimes(1);
      expect(bidder.handleVideoResponse).toBeCalledWith('resolved', cb);
      done();
    });
  });

  test('Should call onTimeout', done => {
    const bid = {
      prebid: {
        code: 'video-1',
        mediaTypes: {
          video: {
            context: 'instream',
            playerSize: [640, 480],
          },
        },
        bids: []
      }
    };

    // resolve the promise in 20ms
    bidder.fetchVideoBids = () => new Promise(resolve => {
      setTimeout(resolve, 20);
    });

    const cb = jest.fn();
    const adUnit = createVideoAdUnit(bid, cb);

    const q = new Queue();
    q.enqueue(adUnit);

    // timesout the promise in 10ms
    const promise = processVideo([bidder], 10, q);
    promise.then(res => {
      expect(bidder.onVideoBidTimeout).toBeCalledTimes(1);
      expect(bidder.onVideoBidTimeout).toBeCalledWith({ err: 'Timed out in 10ms.', status: 'rejected' });
      done();
    });
  });
});
