import { ixBids } from './';

const indx = {
  xSlots: {
    14: { siteId: '211035', size: [300, 250] },
    15: { siteId: '211036', size: [300, 600] },
    16: { siteId: '211037', size: [300, 1050] },
  },
  mapping: {
    rect_12: ['30'],
    rect_SS4: ['45'],
    lb_1: ['3', '1', '2'],
    lb_2: ['4'],
    lb_3: ['5'],
    lb_4: ['6'],
    lb_5: ['7'],
    lb_6: ['8'],
    lb_7: ['9'],
    lb_SS1: ['10', '11', '12'],
    lb_SS2: ['13'],
    rect_1: ['14', '15', '16'],
  }
};

describe.only('ixBidder helper', () => {
  it('should map adUnit name to sizes', () => {
    const bids = ixBids(indx)('rect_1', [[300, 250], [300, 600]]);
    console.log(bids);
  });
});