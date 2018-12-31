export const ixBids = indx => (adUnitId, sizes) => {
  const adMap = indx.mapping[adUnitId];
  if (!adMap) return [];
  const adUnitSizes = adMap.reduce((acc, sizeId) => {
    acc.push(indx.xSlots[sizeId]);
    return acc;
  }, []);

  const bidderSizes = sizes.reduce((acc, size) => {
    if (typeof size === 'string') return acc;
    const [width1, height1] = size;

    const params = adUnitSizes.find(({ size: [width2, height2] }) => {
      return width1 === width2 && height1 === height2;
    });

    if (!params) return acc;
    acc.push({
      bidder: 'ix',
      params,
    });
    return acc;
  }, []);

  // console.log(`idx - ${adUnitId}`, JSON.stringify(bidderSizes, null, 2));

  return bidderSizes;
};
