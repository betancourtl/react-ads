export const startPrebidQueue = () => {
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
};

export const initAdserver = (resolve, codeArr = [], timeoutFnRef) => () => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      console.log('bids ', pbjs.getBidResponses());
      console.log('codeArr', codeArr);
      clearTimeout(timeoutFnRef);
      pbjs.setTargetingForGPTAsync(codeArr);
      resolve();
    });
  });
};

export const getBids = (timeout, failSafeTimeout,) => adUnits => new Promise(resolve => {
  // in case PBJS doesn't load
  const timeoutFn = setTimeout(function () {
    bidsBackHandler();
    console.log('Timed out');
  }, failSafeTimeout);
  const codeArr = adUnits.map(x => x.code);
  const bidsBackHandler = initAdserver(resolve, codeArr, timeoutFn);
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({ bidsBackHandler, timeout });
  });
});
