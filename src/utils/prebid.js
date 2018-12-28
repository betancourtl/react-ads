export const startPrebidQueue = () => {
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
};

export const initAdserver = () => {
  var pbjs = window.pbjs || {};
  var googletag = window.googletag || {};
  
  if (pbjs.initAdserverSet) return;
  
  pbjs.initAdserverSet = true;
  
  googletag.cmd.push(function () {
    pbjs.que.push(function () {
      pbjs.setTargetingForGPTAsync();
    });
  });
};

export const getBids = (bidsBackHandler, adUnits, timeout) => {
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({ bidsBackHandler, timeout });
  });
};
