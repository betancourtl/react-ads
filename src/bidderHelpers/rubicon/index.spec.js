import { rubiconBids } from './';

const accountId = 1090;

const screen = {
  mobile: 'mobile',
  desktop: 'desktop',
};

const options = [
  // mobile
  { zoneId: 705194, siteId: 65531, mq: screen.mobile, size: [300, 250], accountId },
  { zoneId: 706194, siteId: 85531, mq: screen.mobile, size: [320, 50], accountId },
];

describe('rubiconBids', () => {
  it('should create the rubicon bids', () => {
    const result = rubiconBids(options)(screen.mobile, [[300, 250], [320, 50]]);
    expect(result).toEqual([
      {
        bidder: 'rubicon',
        params: {
          accountId,
          siteId: 65531,
          zoneId: 705194,
        },
      },
      {
        bidder: 'rubicon',
        params: {
          accountId,
          siteId: 85531,
          zoneId: 706194,
        }
      }
    ]);
  });

  it('should create the rubicon bids when size is not an array of arrays', () => {
    const result = rubiconBids(options)(screen.mobile, [320, 50]);
    expect(result).toEqual([
      {
        bidder: 'rubicon',
        params: {
          accountId,
          siteId: 85531,
          zoneId: 706194,
        },
      },
    ]);
  });
});