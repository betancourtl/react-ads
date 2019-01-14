"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pubsub = _interopRequireDefault(require("../../lib/Pubsub"));

var _context = require("../context");

var _bidManager = _interopRequireDefault(require("../../utils/bidManager"));

var _googletag = require("../../utils/googletag");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Provider =
/*#__PURE__*/
function (_Component) {
  _inherits(Provider, _Component);

  function Provider(props) {
    var _this;

    _classCallCheck(this, Provider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Provider).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "generateId", function () {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ad';
      _this.slotCount[type];
      if (isNaN(_this.slotCount[type])) _this.slotCount[type] = 1;else _this.slotCount[type] = _this.slotCount[type] + 1;
      return "".concat(type).concat(_this.props.divider).concat(_this.slotCount[type]);
    });

    var gpt = props.gpt;
    if (!props.enableAds) return _possibleConstructorReturn(_this);
    _this.slotCount = {};
    _this.pubSub = new _Pubsub.default();
    gpt.createGPTScript();
    gpt.createGoogleTagEvents(_this.pubSub);
    gpt.setCentering(props.setCentering);
    gpt.enableVideoAds(props.enableVideoAds);
    gpt.collapseEmptyDivs(props.collapseEmptyDivs);
    gpt.enableAsyncRendering(true);
    gpt.enableSingleRequest(true);
    gpt.disableInitialLoad(true);
    gpt.setTargeting(props.targeting);
    gpt.enableServices();
    gpt.destroySlots();
    _this.bidManager = (0, _bidManager.default)({
      refresh: gpt.refresh,
      chunkSize: props.chunkSize,
      bidTimeout: props.bidTimeout,
      bidProviders: props.bidProviders,
      refreshDelay: props.refreshDelay
    });
    props.bidProviders.forEach(function (bidder) {
      return bidder.init();
    });

    _this.pubSub.on('refresh', function () {});

    _this.pubSub.on('display', function () {});

    _this.pubSub.on('defineSlot', function () {});

    _this.pubSub.on('destroySlots', function () {});

    return _this;
  }

  _createClass(Provider, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.enableAds) return;
      this.pubSub.clear();
    }
    /**
     * Will generate the id for the adSlot.
     * @param {String} type
     * @returns 
     */

  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(_context.AdsContext.Provider, {
        value: {
          generateId: this.generateId,
          enableAds: this.props.enableAds,
          networkId: this.props.networkId,
          refresh: this.bidManager.refresh,
          adUnitPath: this.props.adUnitPath,
          bidHandler: this.props.bidHandler,
          lazyOffset: this.props.lazyOffset
        }
      }, this.props.children);
    }
  }]);

  return Provider;
}(_react.Component);

Provider.defaultProps = {
  divider: '_',
  networkId: 0,
  chunkSize: 4,
  targeting: {},
  enableAds: true,
  lazyOffset: 800,
  bidProviders: [],
  bidTimeout: 1000,
  refreshDelay: 200,
  setCentering: true,
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
    collapseEmptyDivs: _googletag.collapseEmptyDivs,
    disableInitialLoad: _googletag.disableInitialLoad,
    enableSingleRequest: _googletag.enableSingleRequest,
    enableAsyncRendering: _googletag.enableAsyncRendering,
    createGoogleTagEvents: _googletag.createGoogleTagEvents
  }
};
Provider.propTypes = {
  divider: _propTypes.default.string,
  enableAds: _propTypes.default.bool,
  bidHandler: _propTypes.default.func,
  targeting: _propTypes.default.object,
  chunkSize: _propTypes.default.number,
  adUnitPath: _propTypes.default.string,
  bidTimeout: _propTypes.default.number,
  lazyOffset: _propTypes.default.number,
  setCentering: _propTypes.default.bool,
  bidProviders: _propTypes.default.array,
  refreshDelay: _propTypes.default.number,
  enableVideoAds: _propTypes.default.bool,
  collapseEmptyDivs: _propTypes.default.bool,
  networkId: _propTypes.default.number.isRequired,
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.arrayOf(_propTypes.default.node)]),
  gpt: _propTypes.default.shape({
    refresh: _propTypes.default.func.isRequired,
    destroySlots: _propTypes.default.func.isRequired,
    setCentering: _propTypes.default.func.isRequired,
    setTargeting: _propTypes.default.func.isRequired,
    enableServices: _propTypes.default.func.isRequired,
    createGPTScript: _propTypes.default.func.isRequired,
    collapseEmptyDivs: _propTypes.default.func.isRequired,
    disableInitialLoad: _propTypes.default.func.isRequired,
    enableSingleRequest: _propTypes.default.func.isRequired,
    enableAsyncRendering: _propTypes.default.func.isRequired,
    createGoogleTagEvents: _propTypes.default.func.isRequired
  })
};
var _default = Provider;
exports.default = _default;