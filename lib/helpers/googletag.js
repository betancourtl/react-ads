"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGoogleTagEvents = exports.enableServices = exports.getVersion = exports.collapseEmptyDivs = exports.enableVideoAds = exports.enableAsyncRendering = exports.setCentering = exports.enableLazyLoad = exports.disableInitialLoad = exports.enableSingleRequest = exports.startGoogleTagQue = exports.createGPTScript = void 0;

/**
 * @module googletag
 */

/**
 * Will create the google tag scripts and load the googletag library.
 *
 * @function
 * @returns {void}
 */
var createGPTScript = function createGPTScript() {
  var id = 'react-ads-google-tag-script';
  var scriptExists = document.getElementById(id);

  if (scriptExists) {
    console.log('google tag script already exists');
    return;
  }

  var script = document.createElement('script');
  script.id = id;
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
  script.async = true;
  document.head.appendChild(script);
};
/**
 * Will create the googleTag queue for handling asynchronous calls.
 *
 * @function
 * @returns {void}
 */


exports.createGPTScript = createGPTScript;

var startGoogleTagQue = function startGoogleTagQue() {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
};
/**
 * Will enable singleRequests so that multiple ads can be fetched from a single
 * HTTP request.
 *
 * @function
 * @param {bool} enabled
 * @returns {void}
 */


exports.startGoogleTagQue = startGoogleTagQue;

var enableSingleRequest = function enableSingleRequest(enabled) {
  if (!enabled) return;
  window.googletag.cmd.push(function () {
    window.googletag.pubads().enableSingleRequest();
  });
};
/**
 * Will stop the initial ad load.
 *
 * @function
 * @param {bool} disabled
 */


exports.enableSingleRequest = enableSingleRequest;

var disableInitialLoad = function disableInitialLoad(disabled) {
  if (!disabled) return;
  window.googletag.cmd.push(function () {
    window.googletag.pubads().disableInitialLoad();
  });
};
/**
 * Will enable lazy loading ads.
 *
 * @function
 * @param {bool|object} props
 * @returns {void}
 */


exports.disableInitialLoad = disableInitialLoad;

var enableLazyLoad = function enableLazyLoad() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (!props) return;
  window.googletag.cmd.push(function () {
    var value = props === true ? {
      fetchMarginPercent: 10,
      // Fetch slots within 5 viewports.
      renderMarginPercent: 10,
      // Render slots within 2 viewports.
      mobileScaling: 1 // Double the above values on mobile.

    } : props;
    window.googletag.pubads().enableLazyLoad(value);
  });
};
/**
 * Will center the ads automatically.
 *
 * @function
 * @param {bool} isCentered
 * @returns {void}
 */


exports.enableLazyLoad = enableLazyLoad;

var setCentering = function setCentering() {
  var isCentered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  window.googletag.cmd.push(function () {
    window.googletag.pubads().setCentering(isCentered);
  });
};
/**
 * Will enable Async rendering. By default this is true, Only use this
 * to override a previous setting.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */


exports.setCentering = setCentering;

var enableAsyncRendering = function enableAsyncRendering() {
  var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (!isEnabled) return;
  window.googletag.cmd.push(function () {
    window.googletag.pubads().enableAsyncRendering(isEnabled);
  });
};
/**
 * Will enable enable video ads.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */


exports.enableAsyncRendering = enableAsyncRendering;

var enableVideoAds = function enableVideoAds() {
  var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (!isEnabled) return;
  window.googletag.cmd.push(function () {
    window.googletag.pubads().enableVideoAds();
  });
};
/**
 * Will collapse empty divs. Enabling this might cause issues with SRA.
 *
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */


exports.enableVideoAds = enableVideoAds;

var collapseEmptyDivs = function collapseEmptyDivs() {
  var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  window.googletag.cmd.push(function () {
    window.googletag.pubads().collapseEmptyDivs(isEnabled);
  });
};
/**
 * Will get the googletag version.
 *
 * @function
 * @returns {void}
 */


exports.collapseEmptyDivs = collapseEmptyDivs;

var getVersion = function getVersion() {
  window.googletag.cmd.push(function () {
    window.googletag.getVersion();
  });
};
/**
 * Will enable googletag services.
 *
 * @function
 * @returns {void}
 */


exports.getVersion = getVersion;

var enableServices = function enableServices() {
  window.googletag.cmd.push(function () {
    window.googletag.enableServices();
  });
};
/**
 * Will monkey patch the global googletag functions so that we can subscribe to
 * Whenever the function is called.
 *
 * @function
 * @param {callback} pubSub - PubSub instance used to emit events.
 * @returns {void}
 */


exports.enableServices = enableServices;

var createGoogleTagEvents = function createGoogleTagEvents(pubSub) {
  var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  window.googletag.cmd.push(function () {
    // Pass this outside the function. There is no need to know about the inner
    // workings of the pubSub.
    var callback = function callback(evtName, result) {
      if (log) console.log('fired ', evtName);
      pubSub.emit(evtName, result);
    };

    var fns = [{
      ref: window.googletag,
      events: ['defineSlot', 'destroySlots', 'enableServices', 'display']
    }, {
      ref: window.googletag.pubads(),
      events: ['disableInitialLoad', 'enableAsyncRendering', 'enableSyncRendering', 'enableLazyLoad', 'enableSingleRequest', 'enableVideoAds', 'setCentering', 'collapseEmptyDivs', 'getVersion', 'refresh']
    }];

    var monkeyPatch = function monkeyPatch(obj, fnName, cb) {
      var fn = obj[fnName];

      obj[fnName] = function () {
        var result = fn.apply(this, arguments);
        cb(fnName, result);
        return result;
      };
    };

    fns.forEach(function (_ref) {
      var ref = _ref.ref,
          events = _ref.events;
      events.forEach(function (evt) {
        return monkeyPatch(ref, evt, callback);
      });
    });
  });
};

exports.createGoogleTagEvents = createGoogleTagEvents;