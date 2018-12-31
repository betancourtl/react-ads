const createBid = ({ siteId, zoneId, accountId }) => ({
  bidder: 'rubicon',
  params: {
    accountId,
    siteId,
    zoneId,
  }
});

export const rubiconBids = maps => (screen, sizes) => {   
  if (typeof sizes === 'string') return [];
  const isArray = Array.isArray(sizes);
  const isArrayOfArrays = isArray && sizes.every(x => Array.isArray(x));

  let _sizes = isArray && !isArrayOfArrays ? [sizes] : sizes;

  const options = maps.filter(({ mq }) => mq === screen);
  if (!options) return [];
  
  const bids = _sizes.reduce((acc, [width, height]) => {
    const params = options.find(({size: [width2, height2]}) => width2 === width && height2 === height);    
    if (!params) return acc;    
    acc.push(createBid(params));
    return acc;
  }, []);

  return bids;
};
