import { ixBids, createBid } from './';

const indx = {
  xSlots: {
    14: { siteId: 211035, size: [300, 250] },
    15: { siteId: 211036, size: [300, 600] },
    16: { siteId: 211037, size: [300, 1050] },
  },
  mapping: {
    rect_1: ['14', '15', '16'],
  }
};

describe('ixBidder helper', () => {
  it('should map adUnit name when using many an array of arrays with numbers', () => {
    const bids = ixBids(indx)('rect_1', [[300, 250], [300, 600]]);
    expect(bids).to.deep.equal([
      createBid({siteId: 211035,size: [300, 250]}),
      createBid({siteId: 211036,size: [300, 600]}),
    ]);
  });

  it('should map adUnit name when using only an array', () => {
    const bids = ixBids(indx)('rect_1', [300, 250]);
    expect(bids).to.deep.equal([
      createBid({siteId: 211035,size: [300, 250]}),
    ]);
  });
});