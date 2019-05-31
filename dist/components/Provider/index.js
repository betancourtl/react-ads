"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pubsub = _interopRequireDefault(require("../../lib/Pubsub"));

var _context = require("../context");

var _prebid = _interopRequireDefault(require("../../utils/Bidder/prebid"));

var _bidManager = _interopRequireDefault(require("../../utils/bidManager"));

var _timedPromise = _interopRequireDefault(require("../../utils/timedPromise"));

var _googletag = require("../../utils/googletag");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var STARTED = 'STARTED';
var SUCCESS = 'SUCCESS';
var FAIL = 'FAIL';

var Provider =
/*#__PURE__*/
function (_Component) {
  _inherits(Provider, _Component);

  function Provider(_props) {
    var _this;

    _classCallCheck(this, Provider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Provider).call(this, _props)); // Prevent constructor from running when SSR.

    _defineProperty(_assertThisInitialized(_this), "initGPT", function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
          props = _assertThisInitialize.props;

      var gpt = props.gpt;
      gpt.createGPTScript();
      gpt.setCentering(props.setCentering);
      gpt.setAdIframeTitle(props.adIframeTitle);
      gpt.enableVideoAds(props.enableVideoAds);
      gpt.collapseEmptyDivs(props.collapseEmptyDivs);
      gpt.enableAsyncRendering(true);
      gpt.enableSingleRequest(true);
      gpt.disableInitialLoad(true);
      gpt.setTargeting(props.targeting);
      gpt.enableServices();
      gpt.destroySlots();
    });

    _defineProperty(_assertThisInitialized(_this), "initBidders", function () {
      if (!_this.props.bidProviders.length) _this.pubsub.emit('bidders-ready', true);else {
        (0, _timedPromise["default"])(_this.props.bidProviders.map(function (bidder) {
          return bidder._init();
        }), _this.props.initTimeout)["catch"](function (err) {
          return console.log('Error initializing bidders', err);
        })["finally"](function () {
          return _this.pubsub.emit('bidders-ready', true);
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "loadVideoScripts", function (scripts) {
      var postFix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'postfix';
      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(reject, 4000);
        var remaining = scripts.length;

        var onLoad = function onLoad() {
          remaining = remaining - 1;

          if (remaining <= 0) {
            clearTimeout(timeout);
            resolve();
          }
        };

        var fragment = document.createDocumentFragment();
        scripts.forEach(function (src, index) {
          var id = "instream-js-".concat(index + postFix);
          var exists = document.getElementById(id);
          if (exists) return onLoad();
          var el = document.createElement('script');
          el.src = src;
          el.id = id;
          el.async = true;
          el.defer = true;
          el.onload = onLoad;
          el.onerror = onLoad;
          fragment.appendChild(el);
        });
        document.head.appendChild(fragment);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "loadVideoCss", function () {
      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(reject, 4000);
        var stylesheets = ['https://cdnjs.cloudflare.com/ajax/libs/video.js/7.5.0/video-js.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.6.1/videojs-contrib-ads.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/1.5.2/videojs.ima.min.css'];
        var remaining = stylesheets.length;

        var onLoad = function onLoad() {
          remaining = remaining - 1;

          if (remaining <= 0) {
            clearTimeout(timeout);
            resolve();
          }
        };

        var fragment = document.createDocumentFragment();
        stylesheets.forEach(function (href, index) {
          var id = "instream-css-".concat(index);
          var exists = document.getElementById(id);
          if (exists) return onLoad();
          var el = document.createElement('link');
          el.href = href;
          el.id = id;
          el.rel = 'stylesheet';
          el.onload = onLoad;
          el.onerror = onLoad;
          fragment.appendChild(el);
        });
        document.head.appendChild(fragment);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "loadVideoPlayer", function (cb) {
      if (_this.videoStatus === FAIL) return;
      if (_this.videoStatus === STARTED) return _this.videoQue.push(cb);
      if (_this.videoStatus === SUCCESS) return cb();

      if (_this.videoStatus === '') {
        _this.videoQue.push(cb);

        _this.videoStatus = STARTED;
      }

      return _this.loadVideoScripts(['https://cdnjs.cloudflare.com/ajax/libs/video.js/7.5.0/video.min.js'], '-1').then(function () {
        return _this.loadVideoScripts(['//imasdk.googleapis.com/js/sdkloader/ima3.js', 'https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.6.1/videojs-contrib-ads.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/1.5.2/videojs.ima.min.js']);
      }, '-2').then(function () {
        return _this.loadVideoCss();
      }).then(function () {
        _this.videoStatus = SUCCESS;

        _this.videoQue.forEach(function (fn) {
          return fn();
        });
      })["catch"](function () {
        _this.videoStatus = FAIL;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "generateId", function () {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ad';
      _this.slotCount[type];
      if (isNaN(_this.slotCount[type])) _this.slotCount[type] = 1;else _this.slotCount[type] = _this.slotCount[type] + 1;
      return "".concat(type).concat(_this.props.divider).concat(_this.slotCount[type]);
    });

    _defineProperty(_assertThisInitialized(_this), "refreshAdById", function (ids) {
      [].concat(ids).forEach(function (id) {
        window.dispatchEvent(new CustomEvent('refresh-ad', {
          detail: {
            id: id
          }
        }));
      });
    });

    if (typeof window === 'undefined') return _possibleConstructorReturn(_this);
    var _gpt = _props.gpt;
    if (!_props.enableAds) return _possibleConstructorReturn(_this);
    _this.pubsub = _props.pubsub;
    _this.slotCount = {};

    _this.initGPT();

    _this.bidManager = (0, _bidManager["default"])({
      refresh: _gpt.refresh,
      chunkSize: _props.chunkSize,
      bidTimeout: _props.bidTimeout,
      bidProviders: _props.bidProviders,
      refreshDelay: _props.refreshDelay,
      onBiddersReady: function onBiddersReady(fn) {
        return _this.pubsub.on('bidders-ready', fn);
      }
    });

    _this.initBidders(); // video


    _this.videoStatus = '';
    _this.videoQue = [];
    return _this;
  }
  /**
   * Initializes GPT.
   * @function
   * @returns {void}
   */


  _createClass(Provider, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Do not do anything.
      if (typeof window === 'undefined') return;
      if (!this.props.enableAds) return;
      this.pubsub.clear();
    }
    /**
     * Will fire the custom refresh-ad event, when fired.   
     * @param {String|String[]} ids - An Array of ids'
     * @function
     * @returns {void}
     */

  }, {
    key: "render",
    value: function render() {
      if (typeof window === 'undefined') return null;
      return _react["default"].createElement(_context.AdsContext.Provider, {
        value: {
          generateId: this.generateId,
          enableAds: this.props.enableAds,
          networkId: this.props.networkId,
          refresh: this.bidManager.refresh,
          adUnitPath: this.props.adUnitPath,
          bidHandler: this.props.bidHandler,
          lazyOffset: this.props.lazyOffset,
          refreshAdById: this.refreshAdById,
          loadVideoPlayer: this.loadVideoPlayer
        }
      }, this.props.children);
    }
  }]);

  return Provider;
}(_react.Component);

Provider.defaultProps = {
  divider: '_',
  networkId: 0,
  chunkSize: 5,
  targeting: {},
  enableAds: true,
  lazyOffset: 800,
  bidProviders: [_prebid["default"]],
  bidTimeout: 1000,
  initTimeout: 350,
  refreshDelay: 200,
  adIframeTitle: '',
  setCentering: true,
  pubsub: new _Pubsub["default"](),
  bidHandler: undefined,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  // GPT
  gpt: {
    refresh: _googletag.refresh,
    setCentering: _googletag.setCentering,
    setTargeting: _googletag.setTargeting,
    destroySlots: _googletag.destroySlots,
    enableServices: _googletag.enableServices,
    enableVideoAds: _googletag.enableVideoAds,
    createGPTScript: _googletag.createGPTScript,
    setAdIframeTitle: _googletag.setAdIframeTitle,
    collapseEmptyDivs: _googletag.collapseEmptyDivs,
    disableInitialLoad: _googletag.disableInitialLoad,
    enableSingleRequest: _googletag.enableSingleRequest,
    enableAsyncRendering: _googletag.enableAsyncRendering
  }
};
Provider.propTypes = {
  divider: _propTypes["default"].string,
  enableAds: _propTypes["default"].bool,
  bidHandler: _propTypes["default"].func,
  targeting: _propTypes["default"].object,
  chunkSize: _propTypes["default"].number,
  adUnitPath: _propTypes["default"].string,
  bidTimeout: _propTypes["default"].number,
  lazyOffset: _propTypes["default"].number,
  setCentering: _propTypes["default"].bool,
  bidProviders: _propTypes["default"].array,
  initTimeout: _propTypes["default"].number,
  refreshDelay: _propTypes["default"].number,
  enableVideoAds: _propTypes["default"].bool,
  adIframeTitle: _propTypes["default"].string,
  collapseEmptyDivs: _propTypes["default"].bool,
  pubsub: _propTypes["default"].instanceOf(_Pubsub["default"]),
  networkId: _propTypes["default"].number.isRequired,
  children: _propTypes["default"].oneOfType([_propTypes["default"].node, _propTypes["default"].arrayOf(_propTypes["default"].node)]),
  gpt: _propTypes["default"].shape({
    refresh: _propTypes["default"].func.isRequired,
    destroySlots: _propTypes["default"].func.isRequired,
    setCentering: _propTypes["default"].func.isRequired,
    setTargeting: _propTypes["default"].func.isRequired,
    enableServices: _propTypes["default"].func.isRequired,
    createGPTScript: _propTypes["default"].func.isRequired,
    setAdIframeTitle: _propTypes["default"].func.isRequired,
    collapseEmptyDivs: _propTypes["default"].func.isRequired,
    disableInitialLoad: _propTypes["default"].func.isRequired,
    enableSingleRequest: _propTypes["default"].func.isRequired,
    enableAsyncRendering: _propTypes["default"].func.isRequired
  })
};
var _default = Provider;
exports["default"] = _default;