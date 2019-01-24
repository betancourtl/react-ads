"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VideoPlayer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _context = require("../context");

var _connector = _interopRequireDefault(require("../../hoc/connector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VideoPlayer =
/*#__PURE__*/
function (_Component) {
  _inherits(VideoPlayer, _Component);

  function VideoPlayer(_props) {
    var _this;

    _classCallCheck(this, VideoPlayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VideoPlayer).call(this, _props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadPlayer", function () {
      var _this$props = _this.props,
          id = _this$props.id,
          props = _objectWithoutProperties(_this$props, ["id"]);

      var options = {
        id: id,
        adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator='
      };
      _this.player = window.videojs(_this.videoNode, props);

      _this.player.ima(options);
    });

    _this.state = {
      playerLoaded: _props.isReady
    };
    return _this;
  }

  _createClass(VideoPlayer, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.playerLoaded === false && this.props.isReady === true) {
        this.loadPlayer();
        console.log('player loaded');
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.state.playerLoaded) {
        this.loadPlayer();
      }
    } // destroy player on unmount

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.player) {
        this.player.dispose();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        "data-vjs-player": true
      }, _react.default.createElement("video", {
        id: this.props.id,
        ref: function ref(node) {
          return _this2.videoNode = node;
        },
        className: "video-js"
      })));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (state.playerLoaded === false && props.isReady === true) {
        return {
          playerLoaded: true
        };
      }

      return null;
    }
  }]);

  return VideoPlayer;
}(_react.Component);

exports.VideoPlayer = VideoPlayer;
VideoPlayer.defaultProps = {
  autoplay: true,
  controls: true,
  sources: [{
    src: 'http://techslides.com/demos/sample-videos/small.webm',
    type: 'video/webm'
  }, {
    src: 'http://techslides.com/demos/sample-videos/small.ogv',
    type: 'video/ogv'
  }, {
    src: 'http://techslides.com/demos/sample-videos/small.mp4',
    type: 'video/mp4'
  }, {
    src: 'http://techslides.com/demos/sample-videos/small.3gp',
    type: 'video/3gp'
  }]
};

var _default = (0, _connector.default)(_context.VideoContext, function (_ref) {
  var isReady = _ref.isReady;
  return {
    isReady: isReady
  };
})(VideoPlayer);

exports.default = _default;