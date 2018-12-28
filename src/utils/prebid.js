export const startPrebidQueue = () => {
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
};

export const initAdserver = resolve => () => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};

  if (pbjs.initAdserverSet) return;

  pbjs.initAdserverSet = true;

  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      pbjs.setTargetingForGPTAsync();
      resolve();
    });
  });
};

export const getBids = (timeout, failSafeTimeout) => adUnits => new Promise(resolve => {
  const bidsBackHandler = initAdserver(resolve);
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({ bidsBackHandler, timeout });
  });

  // in case PBJS doesn't load
  setTimeout(function () {
    bidsBackHandler();
  }, failSafeTimeout);
});
