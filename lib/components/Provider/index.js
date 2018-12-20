"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Pubsub = _interopRequireDefault(require("../../lib/Pubsub"));

var _googletag = require("../../helpers/googletag");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Enables the googletag service and configures the GPT service.
 * TODO [] - Create initial ads queue.
 * TODO [] - Create lazy-loded ads queue, by monkey patching the gpt cmd array.
 * TODO [] - Create custom lazy-loaded functionality similar to nfl/react-gpt
 */
var Provider =
/*#__PURE__*/
function (_Component) {
  _inherits(Provider, _Component);

  function Provider(props) {
    var _this;

    _classCallCheck(this, Provider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Provider).call(this, props));
    _this.state = {
      ads: [],
      isMounted: false,
      version: undefined,
      apiReady: undefined,
      pubadsReady: undefined,
      setCentering: undefined,
      enableLazyLoad: undefined,
      enableVideoAds: undefined,
      collapseEmptyDivs: undefined,
      disableInitialLoad: undefined,
      enableSingleRequest: undefined,
      enableSyncRendering: undefined,
      enableAsyncRendering: undefined
    };
    _this.pubSub = new _Pubsub.default();
    (0, _googletag.createGPTScript)();
    (0, _googletag.startGoogleTagQue)();
    (0, _googletag.createGoogleTagEvents)(_this.pubSub);

    _this.setStateInConstructor = function (props) {
      window.googletag.cmd.push(function () {
        _this.state.isMounted ? _this.setState(props) : _this.state = _objectSpread({}, _this.state, props);
      });
    }; // proxy the apiReady property so that we an load ads when ready.
    // pubSub.on('pubadsReady', (pubadsReady) => this.setState({ pubadsReady }));
    // pubSub.on('apiReady', (apiReady) => this.setState({ apiReady }));


    _this.pubSub.on('refresh', function () {
      console.log('refresh called');
    });

    _this.pubSub.on('display', function () {
      console.log('display called');
    }); // this.pubSub.on('destroySlots', () => console.log('destroySlots'));
    // this.pubSub.on('enableServices', () => console.log('enableServices'));


    _this.pubSub.on('getVersion', function (version) {
      return _this.setStateInConstructor({
        version: version
      });
    }); // this.pubSub.on('defineSlot', slot => console.log('defineSlot', slot.getSlotElementId()));


    _this.pubSub.on('setCentering', function (setCentering) {
      return _this.setStateInConstructor({
        setCentering: setCentering
      });
    });

    _this.pubSub.on('enableLazyLoad', function (enableLazyLoad) {
      return _this.setStateInConstructor({
        enableLazyLoad: enableLazyLoad
      });
    });

    _this.pubSub.on('enableVideoAds', function (enableVideoAds) {
      return _this.setStateInConstructor({
        enableVideoAds: enableVideoAds
      });
    });

    _this.pubSub.on('collapseEmptyDivs', function (collapseEmptyDivs) {
      return _this.setStateInConstructor({
        collapseEmptyDivs: collapseEmptyDivs
      });
    });

    _this.pubSub.on('disableInitialLoad', function (disableInitialLoad) {
      return _this.setStateInConstructor({
        disableInitialLoad: disableInitialLoad
      });
    });

    _this.pubSub.on('enableSingleRequest', function (enableSingleRequest) {
      return _this.setStateInConstructor({
        enableSingleRequest: enableSingleRequest
      });
    });

    _this.pubSub.on('enableAsyncRendering', function (enableAsyncRendering) {
      return _this.setStateInConstructor({
        enableAsyncRendering: enableAsyncRendering
      });
    });

    (0, _googletag.getVersion)();
    (0, _googletag.setCentering)(_this.props.setCentering);
    (0, _googletag.enableVideoAds)(_this.props.enableVideoAds);
    (0, _googletag.enableLazyLoad)(_this.props.enableLazyLoad);
    (0, _googletag.collapseEmptyDivs)(_this.props.collapseEmptyDivs);
    (0, _googletag.disableInitialLoad)(_this.props.disableInitialLoad);
    (0, _googletag.enableSingleRequest)(_this.props.enableSingleRequest);
    (0, _googletag.enableAsyncRendering)(_this.props.enableAsyncRendering); // Must be the last fn to run in the constructor.

    console.log('Service Enabled');
    (0, _googletag.enableServices)();
    return _this;
  }

  _createClass(Provider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // The event listener triggers setState before the component is fully mounted
      // This triggers an error in react.
      this.setState({
        isMounted: true
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Clears the event listener.
      this.pubSub.clear();
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return Provider;
}(_react.Component);

Provider.defaultProps = {
  setCentering: true,
  enableLazyLoad: true,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  disableInitialLoad: false,
  enableSingleRequest: true,
  enableAsyncRendering: true
};
Provider.propTypes = {
  setCentering: _propTypes.default.bool,
  enableVideoAds: _propTypes.default.bool,
  collapseEmptyDivs: _propTypes.default.bool,
  disableInitialLoad: _propTypes.default.bool,
  enableSingleRequest: _propTypes.default.bool,
  enableAsyncRendering: _propTypes.default.bool,
  children: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.arrayOf(_propTypes.default.node)]),
  enableLazyLoad: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.shape({
    fetchMarginPercent: _propTypes.default.number,
    renderMarginPercent: _propTypes.default.number,
    mobileScaling: _propTypes.default.number
  })])
};
var _default = Provider;
exports.default = _default;