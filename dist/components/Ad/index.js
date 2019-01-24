"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MaybeHiddenAd = exports.Ad = exports.stateToProps = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _hide = _interopRequireDefault(require("../../hoc/hide"));

var _context = require("../context");

var _connector = _interopRequireDefault(require("../../hoc/connector"));

var _withRaf = _interopRequireDefault(require("../../utils/withRaf"));

var _inViewport = _interopRequireDefault(require("../../utils/inViewport"));

var _googletag = require("../../utils/googletag");

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
     * Reference to the googletag GPT slot.
     * @type {Object}
     */

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isFunction", function (maybeFn) {
      return typeof maybeFn === 'function';
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "breakPointRefresh", function () {
      if (_this.canRefresh) _this.refresh();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "withAdProps", function (props) {
      return _objectSpread({
        id: _this.id,
        ref: _this.ref
      }, props);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlotOnload", function () {
      return _this.handleGPTEvent(_googletag.events.slotOnload, _this.props.onSlotOnload);
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onSlotRequested", function () {
      return _this.handleGPTEvent(_googletag.events.slotRequested, _this.props.onSlotRequested);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleCustomRefreshEvent", function (_ref) {
      var detail = _ref.detail;
      if (detail.id !== _this.id) return;

      if (!_this.canRefresh) {
        console.log('Ad has to call window.googletag.display before triggering a refresh.');
        return;
      }

      _this.refresh();
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "imperativeRefresh", function () {
      if (!_this.canRefresh) {
        console.log('Ad has to call window.googletag.display before triggering a refresh.');
        return;
      }

      _this.refresh();
    });

    _this.slot = null;
    /**
     * List of event listener removing functions.
     * @type {Array}
     */

    _this.listeners = [];
    /**
     * Flag to indicate that this slot has been displayed.
     * @type {Boolean}
     */

    _this.displayed = false;
    /**
     * Flag to indicate that this slot has been refreshedOnce.
     * @type {Boolean}
     */

    _this.refreshedOnce = false;
    /**
     * Will refresh the Ad when it is visible on the window.
     * @type {Function}
     */

    _this.refreshWhenVisible = (0, _withRaf.default)(_this.refreshWhenVisible.bind(_assertThisInitialized(_assertThisInitialized(_this))));
    /**
     * Will refresh the Ad.
     * @type {Function}
     */

    _this.refresh = _this.refresh.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    /**
     * The ad's unique id. We only want the id to be generated once, so we run
     * generateId in the constructor.
     *  @type {String}
     */

    _this.id = _props.id || _props.generateId(_props.type);
    return _this;
  }
  /**
   * Will return a flag that signal if an ad can be refreshed via a CustomEvent
   * or via an imperative event.
   * @function
   * @returns {Boolean}
   */


  _createClass(Ad, [{
    key: "display",

    /**
     * Will display this slot. With SRA disabled display will not fetch the ad.
     * @function
     * @returns {void}
     */
    value: function display() {
      this.props.gpt.display(this.id);
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
      this.refreshedOnce = true;
    }
    /**
     * Will trigger a refresh whenever this slot enters into a new breakpoint.
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
      if (this.props.lazy && this.isVisible && !this.refreshedOnce) {
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

      Object.entries(this.props.targeting).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            k = _ref3[0],
            v = _ref3[1];

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
      }, this.props.gpt.sizeMapping());
      this.slot.defineSizeMapping(mapping.build());
    }
    /**
     * Will listen to mediaQueries. This is used for hiding/refreshing ads on the 
     * page.
     * @function   
     * @returns {void}
     */

  }, {
    key: "setMQListeners",
    value: function setMQListeners() {
      var _this3 = this;

      if (!this.props.sizeMap) return;
      this.props.sizeMap.forEach(function (_ref4) {
        var _ref4$viewPort = _slicedToArray(_ref4.viewPort, 1),
            width = _ref4$viewPort[0];

        var mq = window.matchMedia("(max-width: ".concat(width, "px)"));
        mq.addListener(_this3.breakPointRefresh);

        _this3.listeners.push(function () {
          return mq.removeListener(_this3.breakPointRefresh);
        });
      });
    }
    /**
     * Will remove the listeners from the page.
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
     * testing reasons.
     * @param {String} event
     * @param {Function} cb
     * @returns {void}
     */
    value: function handleGPTEvent(event, cb) {
      var _this4 = this;

      if (this.isFunction(cb)) {
        this.props.gpt.addEventListener(event, function (e) {
          if (e.slot == _this4.slot) cb(_this4.withAdProps(e));
        });
      }
    }
    /**
     * Will listen to the onSlotOnload event and then call the passed function.
     * @function   
     * @returns {void}
     */

  }, {
    key: "define",

    /**
     * Will initialize the adSlot.
     * @function
     * @returns {void}
     */
    value: function define() {
      var _this5 = this;

      this.props.gpt.cmdPush(function () {
        _this5.slot = _this5.props.gpt.define(_this5.props.outOfPageSlot, _this5.props.adUnitPath, _this5.mapSize, _this5.id);

        _this5.onSlotOnload();

        _this5.onSlotRenderEnded();

        _this5.onImpressionViewable();

        _this5.onSlotVisibilityChanged();

        _this5.onSlotRequested(); // configures the slot.


        _this5.setMappingSize();

        _this5.setMQListeners();

        _this5.setCollapseEmpty();

        _this5.setTargeting(); // display & fetches the slot.


        _this5.display();

        _this5.refresh();
      });
    }
    /**
     * Will refresh the ad when a CustomEvent is fired.
     * @function
     * @param {Object} option.detail.id - The id of the ad to refresh.
     * @returns {void}
     */

  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.ref.refresh = this.imperativeRefresh;
      window.addEventListener('refresh-ad', this.handleCustomRefreshEvent);
      if (!this.props.lazy) this.define();else {
        this.refreshWhenVisible();
        window.addEventListener('scroll', this.refreshWhenVisible);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unsetMQListeners();
      window.removeEventListener('scroll', this.refreshWhenVisible);
      window.removeEventListener('refresh-ad', this.handleCustomRefreshEvent);
      this.props.gpt.destroySlots(this.slot);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      return _react.default.createElement("div", {
        id: this.id,
        ref: function ref(_ref5) {
          return _this6.ref = _ref5;
        },
        style: _objectSpread({}, this.props.style),
        className: this.props.className,
        "data-react-ad": true
      });
    }
  }, {
    key: "canRefresh",
    get: function get() {
      return this.displayed;
    }
    /**
     * Get the slot map sizes based on the current media query breakpoint.
     * @function
     * @returns {Array}
     */

  }, {
    key: "mapSize",
    get: function get() {
      var _this7 = this;

      if (!this.props.sizeMap) return this.props.size;
      return this.props.sizeMap.filter(function (_ref6) {
        var _ref6$viewPort = _slicedToArray(_ref6.viewPort, 1),
            width = _ref6$viewPort[0];

        return width <= _this7.props.getWindowWidth();
      }).sort(function (a, b) {
        return a > b;
      }).slice(0, 1)[0].slots;
    }
    /**
     * Will call the bidHandler function that generates the adUnit code.
     * @funtion
     * @returns {Function | Null}
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
    * Returns true if the slot is visible on the page. This is used for refreshing
    * lazy loaded ads.
    * @funtion
    * @returns {Boolean}
    */

  }, {
    key: "isVisible",
    get: function get() {
      return (0, _inViewport.default)(this.ref, this.props.lazyOffset);
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
  className: '',
  sizeMap: null,
  targeting: {},
  adUnitPath: '',
  getWindowWidth: _googletag.getWindowWidth,
  lazyOffset: -1,
  type: 'default',
  bidHandler: null,
  onSlotOnload: null,
  outOfPageSlot: false,
  networkId: undefined,
  onSlotRequested: null,
  onSlotRenderEnded: null,
  setCollapseEmpty: false,
  onImpressionViewable: null,
  onSlotVisibilityChanged: null,
  gpt: {
    define: _googletag.define,
    display: _googletag.display,
    cmdPush: _googletag.cmdPush,
    sizeMapping: _googletag.sizeMapping,
    destroySlots: _googletag.destroySlots,
    addEventListener: _googletag.addEventListener
  }
};
Ad.propTypes = {
  lazy: _propTypes.default.bool,
  type: _propTypes.default.string,
  refresh: _propTypes.default.func,
  style: _propTypes.default.object,
  bidHandler: _propTypes.default.func,
  priority: _propTypes.default.number,
  className: _propTypes.default.string,
  networkId: _propTypes.default.number,
  targeting: _propTypes.default.object,
  lazyOffset: _propTypes.default.number,
  onSlotOnload: _propTypes.default.func,
  outOfPageSlot: _propTypes.default.bool,
  id: _propTypes.default.string.isRequired,
  onSlotRequested: _propTypes.default.func,
  setCollapseEmpty: _propTypes.default.bool,
  onSlotRenderEnded: _propTypes.default.func,
  onImpressionViewable: _propTypes.default.func,
  generateId: _propTypes.default.func.isRequired,
  adUnitPath: _propTypes.default.string.isRequired,
  onSlotVisibilityChanged: _propTypes.default.func,
  getWindowWidth: _propTypes.default.func.isRequired,
  size: _propTypes.default.oneOfType([_propTypes.default.array.isRequired, _propTypes.default.string.isRequired]),
  sizeMap: _propTypes.default.arrayOf(_propTypes.default.shape({
    viewPort: _propTypes.default.arrayOf(_propTypes.default.number),
    slots: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.number), _propTypes.default.arrayOf(_propTypes.default.arrayOf(_propTypes.default.number))])
  })),
  gpt: _propTypes.default.shape({
    define: _propTypes.default.func.isRequired,
    cmdPush: _propTypes.default.func.isRequired,
    display: _propTypes.default.func.isRequired,
    sizeMapping: _propTypes.default.func.isRequired,
    destroySlots: _propTypes.default.func.isRequired,
    addEventListener: _propTypes.default.func.isRequired
  })
};
var MaybeHiddenAd = (0, _hide.default)(Ad);
exports.MaybeHiddenAd = MaybeHiddenAd;

var stateToProps = function stateToProps(_ref7, props) {
  var adUnitPath = _ref7.adUnitPath,
      generateId = _ref7.generateId,
      lazyOffset = _ref7.lazyOffset,
      networkId = _ref7.networkId,
      bidHandler = _ref7.bidHandler,
      rest = _objectWithoutProperties(_ref7, ["adUnitPath", "generateId", "lazyOffset", "networkId", "bidHandler"]);

  var withSlash = function withSlash(x) {
    return x ? '/'.concat(x) : x;
  };

  var _networkId = props.networkId || networkId;

  var _adUnitPath = [_networkId, props.adUnitPath || adUnitPath].map(function (x) {
    return withSlash(x);
  }).join('');

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

exports.stateToProps = stateToProps;

var _default = (0, _connector.default)(_context.AdsContext, stateToProps)(MaybeHiddenAd);

exports.default = _default;