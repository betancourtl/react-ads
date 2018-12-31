import { ixBids } from './';

const indx = {
  xSlots: {
    14: { siteId: '211035', size: [300, 250] },
    15: { siteId: '211036', size: [300, 600] },
    16: { siteId: '211037', size: [300, 1050] },
  },
  mapping: {
    rect_1: ['14', '15', '16'],
  }
};

describe('ixBidder helper', () => {
  it('should map adUnit name to sizes', () => {
    const bids = ixBids(indx)('rect_1', [[300, 250], [300, 600]]);
  });
});