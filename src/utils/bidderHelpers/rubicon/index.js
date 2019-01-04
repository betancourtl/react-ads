import { formatSizes } from '../utils';

const createBid = ({ siteId, zoneId, accountId }) => ({
  bidder: 'rubicon',
  params: {
    accountId,
    siteId,
    zoneId,
  }
});

export const rubiconBids = maps => (screen, sizes) => {   
  const _sizes = formatSizes(sizes);
  const options = maps.filter(({ mq }) => mq === screen);  
  
  if (!options) return [];  
  const bids = _sizes.reduce((acc, [w1, h1]) => {
    const params = options.find(({size: [w2, h2]}) => w1 === w2 && h1 === h2);      
  
    if (!params) return acc;    
    acc.push(createBid(params));
  
    return acc;
  }, []);

  return bids;
};
