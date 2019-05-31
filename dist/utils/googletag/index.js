"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTargeting = exports.enableServices = exports.display = exports.getVersion = exports.collapseEmptyDivs = exports.enableVideoAds = exports.enableAsyncRendering = exports.setCentering = exports.disableInitialLoad = exports.enableSingleRequest = exports.createGPTScript = exports.addEventListener = exports.sizeMapping = exports.destroyAd = exports.define = exports.refresh = exports.destroySlots = exports.setAdIframeTitle = exports.cmdPush = exports.getWindowWidth = exports.events = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * @module googletag
 */
var events = {
  slotOnload: 'slotOnload',
  slotRenderEnded: 'slotRenderEnded',
  impressionViewable: 'impressionViewable',
  slotVisibilityChanged: 'slotVisibilityChanged',
  slotRequested: 'slotRequested'
};
exports.events = events;

var getWindowWidth = function getWindowWidth() {
  return window.innerWidth;
};
/**
 * Pushes a function to the googletag queue. 
 * @param {cb}
 * @returns {void}
 */


exports.getWindowWidth = getWindowWidth;

var cmdPush = function cmdPush(cb) {
  return window.googletag.cmd.push(cb);
};

exports.cmdPush = cmdPush;

var setAdIframeTitle = function setAdIframeTitle(title) {
  if (!title) return;
  cmdPush(function () {
    return window.googletag.setAdIframeTitle(title);
  });
};
/**
 * Destroys google slots.
 * @param {Slot[]} - Array of slots to destroy.
 * @returns {void}
 */


exports.setAdIframeTitle = setAdIframeTitle;

var destroySlots = function destroySlots(slots) {
  cmdPush(function () {
    return window.googletag.destroySlots(slots);
  });
};
/**
 * 
 * @param {Slot[]} Slot - Array of google slots.
 */


exports.destroySlots = destroySlots;

var refresh = function refresh(slots) {
  cmdPush(function () {
    return window.googletag.pubads().refresh(slots);
  });
};
/**
 * Add the pubads service to the slot.
 * @param {Boolean} outOfPageSlot
 * @param {String} adUnitPath
 * @param {Array | Array[Array[Number]] | String } mapSize
 * @param {String} id
 * @returns {void}
 */


exports.refresh = refresh;

var define = function define(outOfPageSlot, adUnitPath, mapSize, id) {
  return outOfPageSlot ? window.googletag.defineOutOfPageSlot(adUnitPath, id).addService(window.googletag.pubads()) : window.googletag.defineSlot(adUnitPath, mapSize, id).addService(window.googletag.pubads());
};
/**
 * Will destroy the googletag slot.
 * @param {Slot} slot
 * @returns {void}
 */


exports.define = define;

var destroyAd = function destroyAd(slot) {
  cmdPush(function () {
    return window.googletag.destroySlots([slot]);
  });
};
/**
 * Creates a new SizeMappingBuilder. 
 * @function
 * @returns {SizeMappingBuilder}
 */


exports.destroyAd = destroyAd;

var sizeMapping = function sizeMapping() {
  return window.googletag.sizeMapping();
};
/**
 * Will create the google tag scripts and load the googletag library.
 * @function
 * @param {Event} e - Event object.
 * @param {Function} cb - Function used to handle the event.
 * @returns {void}
 */


exports.sizeMapping = sizeMapping;

var addEventListener = function addEventListener(e, cb) {
  return window.googletag.pubads().addEventListener(e, cb);
};
/**
 * Will create the google tag scripts and load the googletag library.
 * @function
 * @returns {void}
 */


exports.addEventListener = addEventListener;

var createGPTScript = function createGPTScript() {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  var id = 'react-ads-google-tag-script';
  var scriptExists = document.getElementById(id);

  if (scriptExists) {
    // eslint-disable-next-line no-console
    console.error('google tag script already exists');
    return;
  }

  var script = document.createElement('script');
  script.id = id;
  script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
  script.async = true;
  document.head.appendChild(script);
};
/**
 * Will enable singleRequests so that multiple ads can be fetched from a single
 * HTTP request.
 * @function
 * @param {Boolean} enabled
 * @returns {void}
 */


exports.createGPTScript = createGPTScript;

var enableSingleRequest = function enableSingleRequest(enabled) {
  if (!enabled) return;
  cmdPush(function () {
    window.googletag.pubads().enableSingleRequest();
  });
};
/**
 * Will prevent the googletag.display fn from fetching all the ad when called.
 * @function
 * @param {Boolean} disabled - Will stop the initial ad load.
 */


exports.enableSingleRequest = enableSingleRequest;

var disableInitialLoad = function disableInitialLoad(disabled) {
  if (!disabled) return;
  cmdPush(function () {
    window.googletag.pubads().disableInitialLoad();
  });
};
/**
 * Will center the ads automatically.
 * @function
 * @param {Boolean} isCentered
 * @returns {void}
 */


exports.disableInitialLoad = disableInitialLoad;

var setCentering = function setCentering() {
  var isCentered = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  cmdPush(function () {
    window.googletag.pubads().setCentering(isCentered);
  });
};
/**
 * Will enable Async rendering. By default this is true, only use this
 * to override a previous setting.
 * @function
 * @param {Boolean} isEnabled
 * @returns {void}
 */


exports.setCentering = setCentering;

var enableAsyncRendering = function enableAsyncRendering() {
  var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (!isEnabled) return;
  cmdPush(function () {
    window.googletag.pubads().enableAsyncRendering(isEnabled);
  });
};
/**
 * Will enable video ads.
 * @function
 * @param {Boolean} isEnabled
 * @returns {void}
 */


exports.enableAsyncRendering = enableAsyncRendering;

var enableVideoAds = function enableVideoAds() {
  var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (!isEnabled) return;
  cmdPush(function () {
    window.googletag.pubads().enableVideoAds();
  });
};
/**
 * Will collapse empty divs. Enabling this might cause issues with SRA.
 * @function
 * @param {bool} isEnabled
 * @returns {void}
 */


exports.enableVideoAds = enableVideoAds;

var collapseEmptyDivs = function collapseEmptyDivs() {
  var isEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  cmdPush(function () {
    window.googletag.pubads().collapseEmptyDivs(isEnabled);
  });
};
/**
 * Will get the googletag version.
 * @function
 * @returns {void}
 */


exports.collapseEmptyDivs = collapseEmptyDivs;

var getVersion = function getVersion() {
  cmdPush(function () {
    window.googletag.getVersion();
  });
};
/**
 * Will fetch the google ad from DFP. When SRA is enabled this will
 * fetch ALL the ads that called the defineSlot function, but have
 * not been displayed.
 * @param {String|Slot} id - The slotElementId or the Slot Object.
 */


exports.getVersion = getVersion;

var display = function display(id) {
  cmdPush(function () {
    window.googletag.display(id);
  });
};
/**
 * Will enable googletag services.
 * @function
 * @returns {void}
 */


exports.display = display;

var enableServices = function enableServices() {
  cmdPush(function () {
    window.googletag.enableServices();
  });
};
/**
 * Will set page level targeting for all slots.
 * @function
 * @returns {void}
 */


exports.enableServices = enableServices;

var setTargeting = function setTargeting() {
  var targeting = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  cmdPush(function () {
    Object.entries(targeting).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      return window.googletag.pubads().setTargeting(k, v);
    });
  });
};

exports.setTargeting = setTargeting;