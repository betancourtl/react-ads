import { formatSizes } from '../utils';

export const createBid = ({ siteId, size }) => ({
  bidder: 'ix',
  params: {
    siteId,
    size,
  },
});

export const ixBids = indx => (adUnitId, sizes) => {
  const adMap = indx.mapping[adUnitId];

  if (!adMap) return [];

  const adUnitSizes = adMap.map(sizeId => indx.xSlots[sizeId]);

  if (typeof sizes === 'string') return [];

  let _sizes = formatSizes(sizes);

  const bidderSizes = _sizes.reduce((acc, size) => {
    if (typeof size === 'string') return acc;

    const [w1, h1] = size;

    const params = adUnitSizes
      .find(({ size: [w2, h2] }) => w1 === w2 && h1 === h2);


    if (!params) return acc;

    acc.push(createBid({
      siteId: params.siteId,
      size: params.size,
    }));

    return acc;
  }, []);

  // console.log(`idx - ${adUnitId}`, JSON.stringify(bidderSizes, null, 2));

  return bidderSizes;
};
