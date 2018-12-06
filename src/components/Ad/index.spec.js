describe('Ad', () => {
  it('should sizeMap', () => {
    const sizeMap = [
      { viewPort: [750, 200], slots: [728, 90] },
      { viewPort: [1050, 200], slots: [300, 250] },
      { viewPort: [100, 100], slots: [1, 1] },
      { viewPort: [320, 700], slots: [120, 600] }
    ];

    const getAdDimensions = (
      size,
      sizeMap,
      wWidth
    ) => {
      return sizeMap
        .sort((a, b) => a.viewPort[0] <= b.viewPort[0] ? -1 : 1)
        .reduce((acc, { viewPort: [vWidth], slots: [width, height] }) => {
          if (wWidth >= vWidth) return { width, height };
          return acc;
        }, { width: size.width, height: size.height });
    };

    const result = getAdDimensions({ width: 500 }, sizeMap, 100);

    console.log('result', result);
  });
});
