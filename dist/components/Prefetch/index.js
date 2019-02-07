"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Prefetch = exports.stateToProps = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _hide = _interopRequireDefault(require("../../hoc/hide"));

var _context = require("../context");

var _connector = _interopRequireDefault(require("../../hoc/connector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Prefetch =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Prefetch, _React$Component);

  function Prefetch(props) {
    var _this;

    _classCallCheck(this, Prefetch);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Prefetch).call(this, props)); // Call prefetch right away.

    console.log('prefetch running');

    _this.prefetch();

    return _this;
  }
  /**
   * Will call the bidHandler function that generates the adUnit code.
   * @funtion
   * @returns {Function | Null}
   */


  _createClass(Prefetch, [{
    key: "prefetch",

    /**
     * Will refresh this slot using the refresh function passed by the provider.
     * component.
     * @function   
     * @returns {void}
     */
    value: function prefetch() {
      console.log('prefetch called');
      this.props.refresh({
        priority: this.props.priority,
        data: {
          id: this.props.id,
          bids: this.bidHandler,
          type: 'prefetch'
        }
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      console.log('component mounted');
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", null, "Hello");
    }
  }, {
    key: "bidHandler",
    get: function get() {
      return this.props.bidHandler({
        id: this.props.id,
        sizes: this.props.sizes
      });
    }
  }]);

  return Prefetch;
}(_react.default.Component);

exports.Prefetch = Prefetch;
Prefetch.defaultProps = {
  id: '',
  priority: 1,
  refresh: function refresh() {},
  bidHandler: function bidHandler() {}
};
Prefetch.propTypes = {
  priority: _propTypes.default.number,
  id: _propTypes.default.string.isRequired,
  refresh: _propTypes.default.func.isRequired,
  bidHandler: _propTypes.default.func.isRequired
};

var stateToProps = function stateToProps(_ref) {
  var refresh = _ref.refresh;
  return {
    refresh: refresh
  };
};

exports.stateToProps = stateToProps;

var _default = (0, _connector.default)(_context.AdsContext, stateToProps)(Prefetch);

exports.default = _default;