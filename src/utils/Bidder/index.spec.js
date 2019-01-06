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

  test('Should set isReady to true when promise is resolved', (done) => {
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
});