/**
 * Will create the prebid queue.
 * @function
 * @returns {void}
 */
export const startPrebidQueue = () => {
  var pbjs = window.pbjs || {};
  pbjs.que = pbjs.que || [];
};

/**
 * Callback funtion executed after the prebid bids are fetched.
 * @function
 * @param {Promise} resolve
 * @param {Array} adUnitCodes
 * @param {Function} timeoutFnRef
 * @returns {void}
 */
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

/**
 * This function will remove the adUnits from the pbjs.adUnits array.
 * @function
 * @param {String} adUnitCodes
 * @returns {void}
 */
const removeFromAdUnits = (adUnitCodes) =>  {
  adUnitCodes.forEach(adUnitCode => window.pbjs.removeAdUnit(adUnitCode));
};

/**
 * Will fetch the prebid bids.
 * @param {Number} timeout 
 * @param {Number} failSafeTimeout 
 * @param {Object} adUnits 
 * @returns {Promise}
 */
export const getBids = (timeout, failSafeTimeout) => adUnits => new Promise(resolve => {
  var pbjs = window.pbjs || {};
  pbjs.que.push(function () {

    // in case PBJS doesn't load
    const timeoutFn = setTimeout(function () {
      initAdserver(resolve, adUnitCodes);
    }, failSafeTimeout);

    const adUnitCodes = adUnits.map(x => x.code);    
    const bidsBackHandler = initAdserver(resolve, adUnitCodes, timeoutFn);
    // Remove old adUnit settings.
    removeFromAdUnits(adUnitCodes);    
    // Set new adUnit settings.
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
      bidsBackHandler,
      adUnitCodes,
      timeout
    });
  });
});
