import processDisplay from './';
import Bidder from '../../Bidder';
import Queue from '../../../lib/Queue';

const createDisplayAdUnit = (adUnit = {}) => ({
  priority: 1,
  data: {
    slot: 'slot',
    type: 'display',
    bids: adUnit,
  }
});

describe('display', () => {
  let bidder;
  beforeEach(() => {
    bidder = new Bidder('prebid');
    bidder.init = Promise.resolve;
    bidder.onBidWon = jest.fn();
    bidder.onTimeout = jest.fn();
    bidder.handleResponse = jest.fn();
    bidder.fetchDisplayBids = jest.fn().mockImplementation(() => Promise.resolve('resolved'));
    bidder.fetchVideoBids = jest.fn();
    // initialize the bidder to aviod waiting for the promise.
    bidder.isReady = true;
  });

  const refresh = jest.fn();
  test('Should resolve if the Queue is empty.', () => {
    const promise = processDisplay([bidder], 1400, refresh, new Queue());
    expect(promise).resolves.toEqual(undefined);
  });

  test('Should call refreshFn and not call bidder._fetchDisplayBids.', () => {
    const refresh = jest.fn();
    const adUnit = createDisplayAdUnit({
      code: 'ad-1',
      mediaTypes: {
        banner: {
          sizes: [[320, 50]]
        }
      },
      bids: [
        {
          prebid: {
            bidder: 'appnexus',
            params: {
              placementId: 13144370
            }
          }
        }
      ]
    });

    const q = new Queue();
    q.enqueue(adUnit);

    const promise = processDisplay([], 1400, refresh, q);
    expect(refresh).toBeCalledTimes(1);
    expect(bidder.fetchDisplayBids).not.toBeCalled();
    expect(promise).resolves.toEqual(undefined);
  });

  test('Should fetchDisplayBids and resolve the promise when a bidProvider is set and there are bids.', done => {
    const refresh = jest.fn();
    const adUnit = createDisplayAdUnit({
      prebid: {
        code: 'ad-1',
        mediaTypes: {
          banner: {
            sizes: [[320, 50]]
          }
        },
        bids: [{
          bidder: 'appnexus',
          params: {
            placementId: 13144370
          }
        }]
      }
    });

    const q = new Queue();
    q.enqueue(adUnit);

    const promise = processDisplay([bidder], 1400, refresh, q);

    promise.then(() => {
      expect(bidder.fetchDisplayBids).toBeCalledTimes(1);
      expect(bidder.onBidWon).toBeCalledTimes(1);
      expect(bidder.handleResponse).toBeCalledTimes(1);
      expect(refresh).toBeCalledTimes(1);
      expect(refresh).toBeCalledWith(['slot']);
      done();
    });
  });

  test('Should fetchDisplayBids and reject the promise.', done => {
    bidder.fetchDisplayBids = jest.fn().mockImplementation(() => Promise.reject('rejected'));
    const refresh = jest.fn();
    const adUnit = createDisplayAdUnit({
      prebid: {
        code: 'ad-1',
        mediaTypes: {
          banner: {
            sizes: [[320, 50]]
          }
        },
        bids: [{
          bidder: 'appnexus',
          params: {
            placementId: 13144370
          }
        }]
      }
    });

    const q = new Queue();
    q.enqueue(adUnit);

    const promise = processDisplay([bidder], 1400, refresh, q);

    promise.then(() => {
      expect(bidder.fetchDisplayBids).toBeCalledTimes(1);
      expect(bidder.onTimeout).toBeCalledTimes(1);
      expect(bidder.handleResponse).toBeCalledTimes(0);
      expect(refresh).toBeCalledTimes(1);
      expect(refresh).toBeCalledWith(['slot']);
      done();
    });
  });

  test('Should timeout the bid and reject the promise.', done => {
    const refresh = jest.fn();
    const adUnit = createDisplayAdUnit({
      prebid: {
        code: 'ad-1',
        mediaTypes: {
          banner: {
            sizes: [[320, 50]]
          }
        },
        bids: [{
          bidder: 'appnexus',
          params: {
            placementId: 13144370
          }
        }]
      }
    });

    const q = new Queue();
    q.enqueue(adUnit);

    // resolve the promise in 20ms
    bidder.fetchDisplayBids = () => new Promise(resolve => {
      setTimeout(resolve, 20);
    });

    const fetchDisplayBidsSpy = jest.spyOn(bidder, 'fetchDisplayBids');

    // Set the waiting time to 10 ms so the promise times out.
    const promise = processDisplay([bidder], 10, refresh, q);

    promise.then(() => {
      expect(fetchDisplayBidsSpy).toBeCalledTimes(1);
      expect(bidder.onTimeout).toBeCalledTimes(1);
      expect(bidder.onTimeout).toBeCalledWith('Timed out in 10ms.');
      expect(bidder.handleResponse).toBeCalledTimes(0);
      expect(refresh).toBeCalledTimes(1);
      expect(refresh).toBeCalledWith(['slot']);
      done();
    });
  });
});
