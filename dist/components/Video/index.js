"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

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

var VideoPlayer =
/*#__PURE__*/
function (_Component) {
  _inherits(VideoPlayer, _Component);

  function VideoPlayer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, VideoPlayer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(VideoPlayer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadScripts", function (scripts) {
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadCss", function () {
      return new Promise(function (resolve, reject) {
        var timeout = setTimeout(reject, 4000);
        var stylesheets = ['//googleads.github.io/videojs-ima/node_modules/video.js/dist/video-js.min.css', '//googleads.github.io/videojs-ima/node_modules/videojs-contrib-ads/dist/videojs.ads.css', '//googleads.github.io/videojs-ima/dist/videojs.ima.css'];
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

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadPlayer", function () {
      return _this.loadScripts(['//googleads.github.io/videojs-ima/node_modules/video.js/dist/video.min.js'], '-1').then(function () {
        return _this.loadScripts(['//imasdk.googleapis.com/js/sdkloader/ima3.js', '//googleads.github.io/videojs-ima/node_modules/videojs-contrib-ads/dist/videojs.ads.min.js', '//googleads.github.io/videojs-ima/dist/videojs.ima.js']);
      }, '-2').then(function () {
        return _this.loadCss();
      });
    });

    return _this;
  }

  _createClass(VideoPlayer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var options = {
        id: 'content-video',
        adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator='
      };
      this.loadPlayer().then(function () {
        _this2.player = window.videojs(_this2.videoNode, _this2.props);

        _this2.player.ima(options);
      });
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
      var _this3 = this;

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        "data-vjs-player": true
      }, _react.default.createElement("video", {
        id: "content-video",
        ref: function ref(node) {
          return _this3.videoNode = node;
        },
        className: "video-js"
      })));
    }
  }]);

  return VideoPlayer;
}(_react.Component);

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
var _default = VideoPlayer;
exports.default = _default;