import amazon from './';

describe('Amazon test', () => {
  let init, fetchBids;
  beforeEach(() => {
    window.apstag = {};
    init = jest.fn();    
    fetchBids = jest.fn();    
    window.apstag.init = init;
    window.apstag.fetchBids = fetchBids;
  });

  test('amazon.init', () => {
    const addScript = jest.fn();
    amazon.init(addScript);
    expect(addScript).toBeCalledTimes(1);
    expect(init).toBeCalledWith({
      pubID: 123,
      adServer: 'googletag',
      bidTimeout: 1000,
    });
  });

  test('amazon.fetchBids', () => {
  });

  test('amazon.onBidWon', () => {
    expect(amazon.onBidWon()).toBe(undefined);
  });

  test('amazon.onBidWon', () => {
    expect(amazon.onBidWon()).toBe(undefined);
  });
});