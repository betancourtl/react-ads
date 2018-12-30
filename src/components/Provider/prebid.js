export const startPrebidQueue = () => {
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
};

export const initAdserver = (resolve, adUnitCodes = [], timeoutFnRef) => () => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      // console.log('bids ', pbjs.getBidResponses());
      if (timeoutFnRef) clearTimeout(timeoutFnRef);
      pbjs.setTargetingForGPTAsync(adUnitCodes);
      resolve();
    });
  });
};

export const getBids = (timeout, failSafeTimeout) => adUnits => new Promise(resolve => {
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {

    // in case PBJS doesn't load
    const timeoutFn = setTimeout(function () {
      initAdserver(resolve, adUnitCodes);
    }, failSafeTimeout);

    const adUnitCodes = adUnits.map(x => x.code);
    const bidsBackHandler = initAdserver(resolve, adUnitCodes, timeoutFn);
    // console.log('adUnits', adUnits);
    // console.log('adUnitCodes', adUnitCodes);
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
      bidsBackHandler,
      adUnitCodes,
      timeout
    });
  });
});
