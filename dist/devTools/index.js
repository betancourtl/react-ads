"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var DevTools =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DevTools, _React$Component);

  function DevTools(_props) {
    var _this;

    _classCallCheck(this, DevTools);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DevTools).call(this, _props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "creatItem", function () {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return {
        id: props.id,
        adUnitPath: props.adUnitPath,
        breakpoints: props.breakpoints,
        targeting: props.targeting,
        sizes: props.sizes
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getSlots", function () {
      var slots = window.googletag.pubads().getSlots();
      var adUnits = slots.reduce(function (acc, slot) {
        var item = _this.creatItem({
          id: slot.getSlotElementId(),
          adUnitPath: slot.getAdUnitPath(),
          targeting: Object.entries(slot.getTargeting()),
          breakpoints: slot.La.j.map(function (_ref) {
            var m = _ref.m;
            return m;
          }),
          sizes: slot.La.j.map(function (_ref2) {
            var j = _ref2.j;
            return j;
          })
        });

        acc.push(item);
        return acc;
      }, []);

      _this.setState({
        adUnits: adUnits
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "toggleTools", function () {
      _this.setState({
        isOpen: !_this.state.isOpen
      });
    });

    _this.state = {
      adUnits: [],
      isOpen: true
    };
    return _this;
  }

  _createClass(DevTools, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.interval = setInterval(this.getSlots, 1000);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: "render",
    value: function render() {
      var _closingHandle;

      var styles = {
        devTools: {
          position: 'fixed',
          left: 0,
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ccc',
          width: '200px',
          top: 0,
          bottom: 0,
          transform: this.state.isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .2s ease '
        },
        closingHandle: (_closingHandle = {
          position: 'absolute',
          width: '32px',
          height: '32px'
        }, _defineProperty(_closingHandle, "position", 'absolute'), _defineProperty(_closingHandle, "width", '32px'), _defineProperty(_closingHandle, "height", '32px'), _defineProperty(_closingHandle, "left", '100%'), _defineProperty(_closingHandle, "top", 0), _defineProperty(_closingHandle, "backgroundColor", 'white'), _defineProperty(_closingHandle, "display", 'flex'), _defineProperty(_closingHandle, "alignItems", 'center'), _defineProperty(_closingHandle, "justifyContent", 'center'), _defineProperty(_closingHandle, "border", '1px solid #ccc'), _defineProperty(_closingHandle, "background", '#222'), _defineProperty(_closingHandle, "color", 'white'), _closingHandle)
      };
      return _react.default.createElement("div", {
        id: "ad-tools",
        style: styles.devTools
      }, _react.default.createElement("span", {
        id: "ad-tool-closing-handle",
        style: styles.closingHandle,
        onClick: this.toggleTools
      }, "x"), _react.default.createElement("div", {
        style: {
          overflowY: 'scroll',
          padding: '8px',
          width: '100%',
          height: '100%'
        }
      }, this.state.adUnits.map(function (_ref3) {
        var id = _ref3.id,
            adUnitPath = _ref3.adUnitPath,
            targeting = _ref3.targeting,
            breakpoints = _ref3.breakpoints,
            sizes = _ref3.sizes;
        return _react.default.createElement(_react.default.Fragment, {
          key: id
        }, _react.default.createElement("ul", {
          style: {
            listStyleType: 'none',
            margin: 0,
            padding: 0
          },
          onClick: function onClick() {
            return document.getElementById(id).scrollIntoView();
          }
        }, _react.default.createElement("li", null, "id: ", id), _react.default.createElement("li", null, "adUnitPath: ", adUnitPath), _react.default.createElement("li", null, "targeting: ", targeting), _react.default.createElement("li", null, "breakpoints: ", JSON.stringify(breakpoints)), _react.default.createElement("li", null, "sizes: ", JSON.stringify(sizes))), _react.default.createElement("br", null));
      })));
    }
  }]);

  return DevTools;
}(_react.default.Component);

var _default = DevTools;
exports.default = _default;