"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MaybeHiddenAd = exports.Ad = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _hide = _interopRequireDefault(require("../../hoc/hide"));

var _context = require("../context");

var _connector = _interopRequireDefault(require("../../hoc/connector"));

var _withRaf = _interopRequireDefault(require("../../utils/withRaf"));

var _inViewport = _interopRequireDefault(require("../../utils/inViewport"));

var _googletag = require("../../utils/googletag");

var _Ad$propTypes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Ad =
/*#__PURE__*/
function (_Component) {
  _inherits(Ad, _Component);

  function Ad(_props) {
    var _this;

    _classCallCheck(this, Ad);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ad).call(this, _props));
    /**
     * Reference the the googletag GPT slot.
     * @type {Object}
     */

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isFunction", function (maybeFn) {
      return typeof maybeFn === 'function';
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "breakPointRefresh", function () {
      if (_this.displayed) _this.refresh();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "withAdProps", function (props) {
      return _objectSpread({
        id: _this.id,
        ref: _this.ref
      }, props);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlotOnload", function () {
      return _this.handleGPTEvent(_googletag.events.slotOnLoad, _this.props.onSlotOnLoad);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlotRenderEnded", function () {
      return _this.handleGPTEvent(_googletag.events.slotRenderEnded, _this.props.onSlotRenderEnded);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onImpressionViewable", function () {
      return _this.handleGPTEvent(_googletag.events.impressionViewable, _this.props.onImpressionViewable);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlotVisibilityChanged", function () {
      return _this.handleGPTEvent(_googletag.events.slotVisibilityChanged, _this.props.onSlotVisibilityChanged);
    });

    _this.slot = null;
    /**
     * List of event listener removing functions.
     * @type {Array}
     */

    _this.listeners = [];
    /**
     * Reference the googletag GPT slot.
     * @type {Boolean}
     */

    _this.displayed = false;
    /**
     * Reference the the googletag GPT slot.
     * @type {Boolean}
     */

    _this.refreshed = false;
    /**
     * Will refresh the Ad when it is visible on the window.
     * @type {Function}
     */

    _this.refreshWhenVisible = (0, _withRaf.default)(_this.refreshWhenVisible.bind(_assertThisInitialized(_assertThisInitialized(_this))));
    /**
     * The ad's unique id. We only want the Id to be generated once.
     */

    _this.id = _props.id || _props.generateId(_props.type);
    return _this;
  }
  /**
   * Get the slot map sizes based on the media query breakpoints
   * @function
   * @returns {Array}
   */


  _createClass(Ad, [{
    key: "display",

    /**
     * Will display this slot. With SRA disabled display will not fetch the ad.
     * @function
     * @returns {void}
     */
    value: function display() {
      this.props.display(this.id);
      this.displayed = true;
    }
    /**
     * Will refresh this slot using the refresh function passed by the provider.
     * component.
     * @function   
     * @returns {void}
     */

  }, {
    key: "refresh",
    value: function refresh() {
      this.props.refresh({
        priority: this.props.priority,
        data: {
          bids: this.bidHandler,
          slot: this.slot
        }
      });
      this.refreshed = true;
    }
    /**
     * Will trigger a refresh whenever it this slots enters in a new breakpoint
     * specified on the sizeMap.
     * @funtion
     * @returns {void}
     */

  }, {
    key: "refreshWhenVisible",

    /**
    * Event listener for lazy loaded ads that triggers the refresh function when
    * the ad becomes visible.
    * @function   
    * @returns {void}
    */
    value: function refreshWhenVisible() {
      if (this.props.lazy && this.isVisible && !this.refreshed) {
        this.define();
        window.removeEventListener('scroll', this.refreshWhenVisible);
      }
    }
    /**
     * Will collapse this ad whenever it is empty.
     * @function   
     * @returns {void}
     */

  }, {
    key: "setCollapseEmpty",
    value: function setCollapseEmpty() {
      // Test
      if (!this.props.setCollapseEmpty) return;
      this.slot.setCollapseEmptyDiv(true, true);
    }
    /**
     * Will set the targeting parameters for this ad.
     * @function   
     * @returns {void}
     */

  }, {
    key: "setTargeting",
    value: function setTargeting() {
      var _this2 = this;

      // Test
      Object.entries(this.props.targeting).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        return _this2.slot.setTargeting(k, v);
      });
    }
    /**
     * Will create the sizeMaps that will show the different ads depending on the
     * viewport size.
     * @function   
     * @returns {void}
     */

  }, {
    key: "setMappingSize",
    value: function setMappingSize() {
      if (!this.props.sizeMap) return;
      var mapping = this.props.sizeMap.reduce(function (acc, x) {
        return acc.addSize(x.viewPort, x.slots);
      }, (0, _googletag.sizeMapping)());
      this.slot.defineSizeMapping(mapping.build());
    }
    /**
     * Will listen to mediaQueries for hiding/refreshing ads on the page.
     * @function   
     * @returns {void}
     */

  }, {
    key: "setMQListeners",
    value: function setMQListeners() {
      var _this3 = this;

      // Test
      if (!this.props.sizeMap) return;
      this.props.sizeMap.forEach(function (_ref3) {
        var _ref3$viewPort = _slicedToArray(_ref3.viewPort, 1),
            width = _ref3$viewPort[0];

        var mq = window.matchMedia("(max-width: ".concat(width, "px)"));
        mq.addListener(_this3.breakPointRefresh);

        _this3.listeners.push(function () {
          return mq.removeListener(_this3.breakPointRefresh);
        });
      });
    }
    /**
     * Will remove the listener from the page.
     * @function   
     * @returns {void}
     */

  }, {
    key: "unsetMQListeners",
    value: function unsetMQListeners() {
      this.listeners.forEach(function (fn) {
        return fn();
      });
    }
    /**
     * Returns the id and the reference to this slot.
     * @function
     * @returns {Object}
     */

  }, {
    key: "handleGPTEvent",

    /**
     * Will handle a GPT event for this slot. This method was not auto-binded for 
     * testing reases.
     * @param {String} event
     * @param {Function} cb - Callback function for the event.
     * @returns {void}
     */
    value: function handleGPTEvent(event, cb) {
      var _this4 = this;

      // TEST
      if (this.isFunction(cb)) {
        this.props.addEventListener(event, function (e) {
          if (e.slot == _this4.slot) cb(_this4.withAdProps(e));
        });
      }
    }
    /**
     * Will listen to the slotOnload event and then call the passed function.
     * @function   
     * @returns {void}
     */

  }, {
    key: "define",
    value: function define() {
      var _this5 = this;

      this.props.cmdPush(function () {
        _this5.slot = _this5.props.define(_this5.props.outOfPageSlot, _this5.props.adUnitPath, _this5.mapSize, _this5.id);

        _this5.onSlotOnload();

        _this5.onSlotRenderEnded();

        _this5.onImpressionViewable();

        _this5.onSlotVisibilityChanged(); //configure slot


        _this5.setMappingSize();

        _this5.setMQListeners();

        _this5.setCollapseEmpty();

        _this5.setTargeting(); // display & fetch slot


        _this5.display();

        _this5.refresh();
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('Ad Mounted');
      performance.mark('ads:end');
      performance.measure('ads:', 'ads:start', 'ads:end');
      var measures = performance.getEntriesByName('ads:');
      var time = measures[measures.length - 1];
      console.log('time', time);

      if (!this.props.lazy) {
        this.define();
      } else {
        this.refreshWhenVisible();
        window.addEventListener('scroll', this.refreshWhenVisible);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unsetMQListeners();
      window.removeEventListener('scroll', this.refreshWhenVisible);
      this.props.destroyAd(this.slot);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      return _react.default.createElement("div", {
        id: this.id,
        ref: function ref(_ref4) {
          return _this6.ref = _ref4;
        },
        style: _objectSpread({}, this.props.style),
        className: this.props.className
      });
    }
  }, {
    key: "mapSize",
    get: function get() {
      var _this7 = this;

      if (!this.props.sizeMap) return this.props.size;

      try {
        return this.props.sizeMap.filter(function (_ref5) {
          var _ref5$viewPort = _slicedToArray(_ref5.viewPort, 1),
              width = _ref5$viewPort[0];

          return width <= _this7.props.getWindowWidth();
        }).sort(function (a, b) {
          return a > b;
        }).slice(0, 1)[0].slots;
      } catch (err) {
        console.log('Could not get the correct sizes from the sizeMapping array');
        return this.props.size;
      }
    }
    /**
     * Will call the bidder function.
     * @funtion
     * @returns {Function | Object}
     */

  }, {
    key: "bidHandler",
    get: function get() {
      return this.props.bidHandler ? this.props.bidHandler({
        id: this.id,
        sizes: this.mapSize
      }) : null;
    }
    /**
    * Return true if the slot is visible on the page. This is used for refreshing
    * lazy loaded ads.
    * @funtion
    * @returns {Boolean}
    */

  }, {
    key: "isVisible",
    get: function get() {
      return (0, _inViewport.default)(_reactDom.default.findDOMNode(this), this.props.lazyOffset);
    }
    /**
     * Returns true when the parameter is a function.
     * @param {Function} maybeFn
     * @returns {Boolean}
     */

  }]);

  return Ad;
}(_react.Component);

exports.Ad = Ad;
Ad.defaultProps = {
  id: '',
  size: [],
  style: {},
  lazy: false,
  priority: 1,
  sizeMap: null,
  targeting: {},
  adUnitPath: '',
  lazyOffset: -1,
  className: '',
  type: 'default',
  bidHandler: null,
  onSlotOnLoad: null,
  outOfPageSlot: false,
  networkId: undefined,
  setCollapseEmpty: false,
  onSlotRenderEnded: null,
  onImpressionViewable: null,
  onSlotVisibilityChanged: null,
  // gpt events
  define: _googletag.define,
  display: _googletag.display,
  cmdPush: _googletag.cmdPush,
  destroyAd: _googletag.destroyAd,
  sizeMapping: _googletag.sizeMapping,
  getWindowWidth: _googletag.getWindowWidth,
  addEventListener: _googletag.addEventListener
};
Ad.propTypes = (_Ad$propTypes = {
  lazy: _propTypes.default.bool,
  type: _propTypes.default.string,
  style: _propTypes.default.object,
  bidHandler: _propTypes.default.func,
  className: _propTypes.default.string,
  networkId: _propTypes.default.number,
  targeting: _propTypes.default.object,
  lazyOffset: _propTypes.default.number,
  onSlotOnLoad: _propTypes.default.func,
  outOfPageSlot: _propTypes.default.bool,
  id: _propTypes.default.string.isRequired,
  setCollapseEmpty: _propTypes.default.bool,
  onSlotRenderEnded: _propTypes.default.func,
  onImpressionViewable: _propTypes.default.func,
  generateId: _propTypes.default.func.isRequired,
  adUnitPath: _propTypes.default.string.isRequired,
  onSlotVisibilityChanged: _propTypes.default.func,
  priority: _propTypes.default.number,
  size: _propTypes.default.oneOfType([_propTypes.default.array.isRequired, _propTypes.default.string.isRequired]),
  sizeMap: _propTypes.default.arrayOf(_propTypes.default.shape({
    viewPort: _propTypes.default.arrayOf(_propTypes.default.number),
    slots: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.number), _propTypes.default.arrayOf(_propTypes.default.arrayOf(_propTypes.default.number))])
  })),
  refresh: _propTypes.default.func
}, _defineProperty(_Ad$propTypes, "adUnitPath", _propTypes.default.string), _defineProperty(_Ad$propTypes, "define", _propTypes.default.func.isRequired), _defineProperty(_Ad$propTypes, "display", _propTypes.default.func.isRequired), _defineProperty(_Ad$propTypes, "cmdPush", _propTypes.default.func.isRequired), _defineProperty(_Ad$propTypes, "destroyAd", _propTypes.default.func.isRequired), _defineProperty(_Ad$propTypes, "networkId", _propTypes.default.number.isRequired), _defineProperty(_Ad$propTypes, "sizeMapping", _propTypes.default.func.isRequired), _defineProperty(_Ad$propTypes, "getWindowWidth", _propTypes.default.func.isRequired), _defineProperty(_Ad$propTypes, "addEventListener", _propTypes.default.func.isRequired), _Ad$propTypes);
var MaybeHiddenAd = (0, _hide.default)(Ad); // TEST

exports.MaybeHiddenAd = MaybeHiddenAd;

var stateToProps = function stateToProps(_ref6, props) {
  var adUnitPath = _ref6.adUnitPath,
      generateId = _ref6.generateId,
      lazyOffset = _ref6.lazyOffset,
      networkId = _ref6.networkId,
      bidHandler = _ref6.bidHandler,
      rest = _objectWithoutProperties(_ref6, ["adUnitPath", "generateId", "lazyOffset", "networkId", "bidHandler"]);

  var _networkId = props.networkId || networkId;

  var _adUnitPath = adUnitPath ? ['', _networkId, adUnitPath].join('/') : ['', _networkId, props.adUnitPath].join('/');

  var _lazyOffset = props.lazyOffset && props.lazyOffset >= 0 ? props.lazyOffset : lazyOffset;

  var results = _objectSpread({
    adUnitPath: _adUnitPath,
    networkId: _networkId,
    lazyOffset: _lazyOffset,
    generateId: generateId
  }, rest);

  if (bidHandler && props.bidHandler) results.bidHandler = function (x) {
    return props.bidHandler(x, bidHandler(x));
  };else if (bidHandler) results.bidHandler = function (x) {
    return bidHandler(x, []);
  };else if (props.bidHandler) results.bidHandler = function (x) {
    return props.bidHandler(x, []);
  };
  return results;
};

var _default = (0, _connector.default)(_context.AdsContext, stateToProps)(MaybeHiddenAd);

exports.default = _default;