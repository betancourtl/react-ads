"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VideoPlayer = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _context = require("../context");

var _connector = _interopRequireDefault(require("../../hoc/connector"));

var _inViewport = _interopRequireDefault(require("../../utils/inViewport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

// TODO [] - Add tests
var VideoPlayer =
/*#__PURE__*/
function (_Component) {
  _inherits(VideoPlayer, _Component);

  function VideoPlayer(props) {
    var _this;

    _classCallCheck(this, VideoPlayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VideoPlayer).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadPlayer", function (adTagUrl) {
      _this.player = window.videojs(_this.videoNode, _this.props.videoProps);

      _this.player.ima(_objectSpread({}, _this.props.imaProps, {
        id: _this.props.id,
        adTagUrl: adTagUrl
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refresh", function () {
      _this.props.refresh({
        priority: _this.props.priority,
        data: {
          bids: _this.props.bidHandler({
            id: _this.props.id,
            playerSize: _this.props.playerSize
          }),
          params: _this.props.params,
          callback: _this.loadPlayer,
          type: 'video'
        }
      });

      _this.refreshedOnce = true;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "refreshWhenVisible", function () {
      if (_this.props.lazy && _this.isVisible && !_this.refreshedOnce) {
        _this.props.loadVideoPlayer(_this.refresh);

        window.removeEventListener('scroll', _this.refreshWhenVisible);
      }
    });

    _this.unmounted = false;
    _this.refreshedOnce = false;
    _this.refreshWhenVisible = _this.refreshWhenVisible.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }
  /**
  * Returns true if the slot is visible on the page. This is used for refreshing
  * lazy loaded ads.
  * @funtion
  * @returns {Boolean}
  */


  _createClass(VideoPlayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.lazy) this.props.loadVideoPlayer(this.refresh);else {
        this.refreshWhenVisible();
        window.addEventListener('scroll', this.refreshWhenVisible);
      }
    } // destroy player on unmount

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unmounted = true;
      if (this.player) this.player.dispose();
    }
    /**
     * Renders the videojs player. Do not remove the outer empty div. This is
     * used when unmounting videojs.
     */

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
  }, {
    key: "isVisible",
    get: function get() {
      return (0, _inViewport.default)(this.videoNode, this.props.lazyOffset);
    } // Make the prebid API call.

  }]);

  return VideoPlayer;
}(_react.Component);

exports.VideoPlayer = VideoPlayer;
VideoPlayer.defaultProps = {
  id: '',
  priority: 5,
  params: {},
  loadVideoPlayer: Promise.reject,
  imaProps: {// adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=',
  },
  videoProps: {
    autoplay: true,
    controls: true,
    muted: true,
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
  }
};
VideoPlayer.propTypes = {
  id: _propTypes.default.string,
  lazy: _propTypes.default.bool,
  priority: _propTypes.default.number,
  lazyOffset: _propTypes.default.number,
  refresh: _propTypes.default.func.isRequired,
  // https://support.google.com/admanager/answer/1068325?hl=en
  params: _propTypes.default.shape({
    // required
    env: _propTypes.default.string,
    gdfp_req: _propTypes.default.number,
    unviewed_position_start: _propTypes.default.number,
    // required variable
    output: _propTypes.default.oneOf(['vast', 'xml_vast3', 'vmap', 'xml_vmap1', 'xml_vast4']),
    iu: _propTypes.default.string,
    sz: _propTypes.default.string,
    description_url: _propTypes.default.string,
    url: _propTypes.default.string,
    correlator: _propTypes.default.number,
    // optional
    ad_rule: _propTypes.default.number,
    ciu_szs: _propTypes.default.string,
    cmsid: _propTypes.default.number,
    vid: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
    // http://prebid.org/dev-docs/publisher-api-reference.html#pbjsadserversdfpbuildvideourloptions 
    cust_params: _propTypes.default.object,
    hl: _propTypes.default.string,
    msid: _propTypes.default.string,
    an: _propTypes.default.string,
    nofb: _propTypes.default.string,
    pp: _propTypes.default.string,
    ppid: _propTypes.default.number,
    rdid: _propTypes.default.string,
    idtype: _propTypes.default.string,
    is_lat: _propTypes.default.string,
    tfcd: _propTypes.default.string,
    npa: _propTypes.default.string,
    // ima props these are included by IMA by default do not use them.
    pod: _propTypes.default.number,
    ppos: _propTypes.default.number,
    vpos: _propTypes.default.oneOf(['preroll', 'midroll', 'postroll']),
    mridx: _propTypes.default.string,
    lip: _propTypes.default.boolean,
    min_ad_duration: _propTypes.default.number,
    max_ad_duration: _propTypes.default.number,
    pmnd: _propTypes.default.number,
    pmxd: _propTypes.default.number,
    pmad: _propTypes.default.number,
    // These parameters are specific to optimized pods, which are available to 
    // publishers with an advanced video package. They also should not be used 
    // for VMAP (when ad_rule=1). 
    vpmute: _propTypes.default.string,
    vpa: _propTypes.default.string,
    scor: _propTypes.default.number,
    vad_type: _propTypes.default.oneOf(['linear', 'nonlinear']),
    excl_cat: _propTypes.default.string
  }),
  bidHandler: _propTypes.default.func,
  imaProps: _propTypes.default.shape({
    adTagUrl: _propTypes.default.string
  }),
  videoProps: _propTypes.default.shape({
    autoplay: _propTypes.default.bool,
    controls: _propTypes.default.bool,
    sources: _propTypes.default.arrayOf(_propTypes.default.shape({
      src: _propTypes.default.string,
      type: _propTypes.default.string
    }))
  }),
  loadVideoPlayer: _propTypes.default.func.isRequired,
  playerSize: _propTypes.default.arrayOf(_propTypes.default.number)
};

var _default = (0, _connector.default)(_context.AdsContext, function (_ref) {
  var loadVideoPlayer = _ref.loadVideoPlayer,
      refresh = _ref.refresh;
  return {
    refresh: refresh,
    loadVideoPlayer: loadVideoPlayer
  };
})(VideoPlayer);

exports.default = _default;