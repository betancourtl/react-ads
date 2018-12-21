"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _context = require("../context");

var _connector = _interopRequireDefault(require("../connector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "cmdPush", function (cb) {
      return function () {
        return window.googletag.cmd.push(cb);
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "defineSlot", function () {
      window.googletag.cmd.push(function () {
        _this.slot = _this.props.outOfPageSlot ? window.googletag.defineOutOfPageSlot(_this.props.adUnitPath, _this.props.id) : window.googletag.defineSlot(_this.props.adUnitPath, _this.props.size, _this.props.id);
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "display", _this.cmdPush(function () {
      window.googletag.display(_this.props.id);
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refresh", _this.cmdPush(function () {
      window.googletag.pubads().refresh([_this.slot]);
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "destroyAd", _this.cmdPush(function () {
      return window.googletag.destroySlots([_this.slot]);
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "addService", _this.cmdPush(function () {
      return _this.slot.addService(window.googletag.pubads());
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setCollapseEmpty", _this.cmdPush(function () {
      if (!_this.props.setCollapseEmpty) return;

      _this.slot.setCollapseEmptyDiv(true, true);
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setTargeting", _this.cmdPush(function () {
      return Object.entries(_this.props.targeting).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        return _this.slot.setTargeting(k, v);
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setMQListeners", _this.cmdPush(function () {
      if (!_this.props.sizeMapping) return;

      _this.props.sizeMapping.forEach(function (_ref3) {
        var _ref3$viewPort = _slicedToArray(_ref3.viewPort, 1),
            width = _ref3$viewPort[0];

        var mq = window.matchMedia("(max-width: ".concat(width, "px)"));
        mq.addListener(_this.refresh);

        _this.listeners.push(function () {
          return mq.removeListener(_this.refresh);
        });
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "unsetMQListeners", _this.cmdPush(function () {
      _this.listeners.forEach(function (fn) {
        return fn();
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "setMappingSize", _this.cmdPush(function () {
      if (!_this.props.sizeMapping) return;

      var mapping = _this.props.sizeMapping.reduce(function (acc, x) {
        return acc.addSize(x.viewPort, x.slots);
      }, window.googletag.sizeMapping());

      _this.slot.defineSizeMapping(mapping.build());
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "withAdProps", function (props) {
      return _objectSpread({
        id: _this.props.id,
        ref: _this.ref
      }, props);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slotRenderEnded", _this.cmdPush(function () {
      if (typeof _this.props.onSlotRenderEnded !== 'function') return;
      window.googletag.pubads().addEventListener('slotRenderEnded', function (e) {
        if (e.slot === _this.slot) _this.props.onSlotRenderEnded(_this.withAdProps(e));
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "impressionViewable", _this.cmdPush(function () {
      if (typeof _this.props.onImpressionViewable !== 'function') return;
      window.googletag.pubads().addEventListener('impressionViewable', function (e) {
        if (e.slot === _this.slot) _this.props.onImpressionViewable(_this.withAdProps(e));
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slotVisibilityChanged", _this.cmdPush(function () {
      if (typeof _this.props.onSlotVisibilityChanged !== 'function') return;
      window.googletag.pubads().addEventListener('slotVisibilityChanged', function (e) {
        if (e.slot === _this.slot) _this.props.onSlotVisibilityChanged(_this.withAdProps(e));
      });
    }));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "slotOnload", _this.cmdPush(function () {
      window.googletag.pubads().addEventListener('slotOnload', function (e) {
        if (typeof _this.props.onSlotOnLoad === 'function') {
          if (e.slot === _this.slot) _this.props.onSlotOnLoad(_this.withAdProps(e));
        }

        _this._setState({
          showBorder: false
        });
      });
    }));

    _this.state = {
      showBorder: true
    };
    /**
     * Reference the the googletag GPT slot.
     * @type {object}
     */

    _this.slot = null;
    /**
     * List of event listener removing functions.
     * @type {Array}
     */

    _this.listeners = [];

    _this._setState = function (props) {
      if (_this.unmounted) return;

      _this.setState(props);
    };

    return _this;
  }

  _createClass(Ad, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.props.provider.display(function () {
        _this2.defineSlot(); // event start


        _this2.slotOnload();

        _this2.slotRenderEnded();

        _this2.impressionViewable();

        _this2.slotVisibilityChanged(); // events end


        _this2.setMappingSize();

        _this2.setMQListeners();

        _this2.setCollapseEmpty();

        _this2.addService();

        _this2.setTargeting();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
      this.destroyAd();
      this.unsetMQListeners();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return _react.default.createElement("div", {
        id: this.props.id,
        ref: function ref(_ref4) {
          return _this3.ref = _ref4;
        },
        className: this.props.className,
        style: _objectSpread({}, this.props.style)
      });
    }
  }]);

  return Ad;
}(_react.Component);

Ad.defaultProps = {
  id: 'id',
  style: {},
  targeting: {},
  className: null,
  size: [300, 250],
  outOfPageSlot: false,
  setCollapseEmpty: false,
  adUnitPath: '/6355419/Travel/Europe/France/Paris',
  onSlotRenderEnded: null,
  onImpressionViewable: null,
  onSlotOnLoad: null,
  onSlotVisibilityChanged: null
};
Ad.propTypes = {
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  targeting: _propTypes.default.object,
  outOfPageSlot: _propTypes.default.bool,
  id: _propTypes.default.string.isRequired,
  setCollapseEmpty: _propTypes.default.bool,
  adUnitPath: _propTypes.default.string.isRequired,
  size: _propTypes.default.oneOfType([_propTypes.default.array.isRequired, _propTypes.default.string.isRequired]),
  sizeMapping: _propTypes.default.arrayOf(_propTypes.default.shape({
    viewPort: _propTypes.default.arrayOf(_propTypes.default.number),
    slots: _propTypes.default.arrayOf(_propTypes.default.number)
  })),
  // events
  onSlotOnLoad: _propTypes.default.func,
  onSlotRenderEnded: _propTypes.default.func,
  onImpressionViewable: _propTypes.default.func,
  onSlotVisibilityChanged: _propTypes.default.func
};

var _default = (0, _connector.default)(_context.AdsContext, Ad);

exports.default = _default;