import Bidder from './';

describe('Bidder', () => {
  test('Throws error when name is not passed', () => {
    expect(() => new Bidder()).toThrow('Bidder expects a name to be passed.');
  });

  test('Throws error when methods are uninitialized.', () => {
    const bidder = new Bidder('test');
    expect(() => bidder.init()).toThrow('init is not implemented on test Bidder.');
    expect(() => bidder.handleResponse()).toThrow('handleResponse is not implemented on test Bidder.');
    expect(() => bidder.onTimeout()).toThrow('onTimeout is not implemented on test Bidder.');
    expect(() => bidder.onBidWon()).toThrow('onBidWon is not implemented on test Bidder.');
  });

  test('Should set isReady to true when init is called', () => {
    const bidder = new Bidder('test');
    bidder.init = jest.fn();
    bidder._init();
    expect(bidder.isReady).toBe(true);
  });

  test('Should set isReady to true when promise is resolved', done => {
    const bidder = new Bidder('test');
    bidder.init = () => new Promise(resolve => resolve());
    bidder._init();
    setTimeout(() => {
      expect(bidder.isReady).toBe(true);
      done();
    }, 5);
  });

  test('Should set isReady to false when promise is rejected', done => {
    const bidder = new Bidder('test');
    bidder.init = () => new Promise((_, reject) => reject());
    bidder._init();
    setTimeout(() => {
      expect(bidder.isReady).toBe(false);
      done();
    }, 5);
  });

  test('Should timeout the display bidder when it exceeds the failsafe timeout.', async () => {
    const bidder = new Bidder('test');
    bidder.isReady = true;
    bidder.safeTimeout = 5;
    bidder.fetchDisplayBids = () => new Promise(resolve => {
      setTimeout(() => resolve('resolved'), 50);
    });

    await expect(bidder._fetchDisplayBids()).rejects.toEqual('Timed Out');
  });

  test('Should resolve the display bidder when promise resolves before the safeTimeout.', async () => {
    const bidder = new Bidder('test');
    bidder.isReady = true;
    bidder.safeTimeout = 50;
    bidder.fetchDisplayBids = () => new Promise(resolve => {
      setTimeout(() => resolve('resolved'), 5);
    });

    await expect(bidder._fetchDisplayBids()).resolves.toEqual('resolved');
  });

  test('Should timeout the video bidder when it exceeds the failsafe timeout.', async () => {
    const bidder = new Bidder('test');
    bidder.isReady = true;
    bidder.safeTimeout = 5;
    bidder.fetchVideoBids = () => new Promise(resolve => {
      setTimeout(() => resolve('resolved'), 50);
    });

    await expect(bidder._fetchVideoBids()).rejects.toEqual('Timed Out');
  });

  test('Should resolve video bidder when the promise resolves before the safeTimeout.', async () => {
    const bidder = new Bidder('test');
    jest.mock('prebid.js');
    bidder.isReady = true;
    bidder.safeTimeout = 50;
    bidder.fetchVideoBids = () => new Promise(resolve => {
      setTimeout(() => resolve('resolved'), 5);
    });

    await expect(bidder._fetchVideoBids()).resolves.toEqual('resolved');
  });
});
