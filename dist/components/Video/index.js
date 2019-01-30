"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.VideoPlayer=void 0;var _react=_interopRequireWildcard(require("react")),_propTypes=_interopRequireDefault(require("prop-types")),_context=require("../context"),_connector=_interopRequireDefault(require("../../hoc/connector")),_inViewport=_interopRequireDefault(require("../../utils/inViewport"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _interopRequireWildcard(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)if(Object.prototype.hasOwnProperty.call(a,c)){var d=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(a,c):{};d.get||d.set?Object.defineProperty(b,c,d):b[c]=a[c]}return b.default=a,b}function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _objectSpread(a){for(var b=1;b<arguments.length;b++){var c=null==arguments[b]?{}:arguments[b],d=Object.keys(c);"function"==typeof Object.getOwnPropertySymbols&&(d=d.concat(Object.getOwnPropertySymbols(c).filter(function(a){return Object.getOwnPropertyDescriptor(c,a).enumerable}))),d.forEach(function(b){_defineProperty(a,b,c[b])})}return a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var VideoPlayer=function(a){function b(a){var c;return _classCallCheck(this,b),c=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this,a)),_defineProperty(_assertThisInitialized(_assertThisInitialized(c)),"loadPlayer",function(a){if(!c.unmounted){var b=_objectSpread({},c.props.imaProps,{id:c.props.id,adTagUrl:a});c.player=window.videojs(c.videoNode,c.props.videoProps),c.player.ima(b)}}),_defineProperty(_assertThisInitialized(_assertThisInitialized(c)),"refresh",function(){if(c.props.adTagUrl)return c.loadPlayer(c.props.adTagUrl);var a=window.pbjs||{};a.que=a.que||[],a.que.push(function(){var b=c.props.bidHandler({id:c.props.id,playerSize:c.props.playerSize}).prebid;a.addAdUnits(b),window.pbjs.requestBids({adUnitCodes:[b.code],bidsBackHandler:function e(){var d=a.adServers.dfp.buildVideoUrl({adUnit:b,params:_objectSpread({},c.props.params)});c.loadPlayer(d)}})})}),c.unmounted=!1,c.refreshWhenVisible=c.refreshWhenVisible.bind(_assertThisInitialized(_assertThisInitialized(c))),c}return _inherits(b,a),_createClass(b,[{key:"refreshWhenVisible",value:function a(){this.props.lazy&&this.isVisible&&(this.props.loadVideoPlayer(this.refresh),window.removeEventListener("scroll",this.refreshWhenVisible))}},{key:"componentDidMount",value:function a(){this.props.lazy?(this.refreshWhenVisible(),window.addEventListener("scroll",this.refreshWhenVisible)):this.props.loadVideoPlayer(this.refresh)}},{key:"componentWillUnmount",value:function a(){this.unmounted=!0,this.player&&this.player.dispose()}},{key:"render",value:function b(){var a=this;return _react.default.createElement("div",{"data-vjs-player":!0},_react.default.createElement("video",{id:this.props.id,ref:function c(b){return a.videoNode=b},className:"video-js"}))}},{key:"isVisible",get:function a(){return(0,_inViewport.default)(this.videoNode,this.props.lazyOffset)}}]),b}(_react.Component);exports.VideoPlayer=VideoPlayer,VideoPlayer.defaultProps={id:"",params:{},loadVideoPlayer:Promise.reject,imaProps:{adTagUrl:"http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator="},videoProps:{autoplay:!0,controls:!0,sources:[{src:"http://techslides.com/demos/sample-videos/small.webm",type:"video/webm"},{src:"http://techslides.com/demos/sample-videos/small.ogv",type:"video/ogv"},{src:"http://techslides.com/demos/sample-videos/small.mp4",type:"video/mp4"},{src:"http://techslides.com/demos/sample-videos/small.3gp",type:"video/3gp"}]}};var _default=(0,_connector.default)(_context.AdsContext,function(a){var b=a.loadVideoPlayer;return{loadVideoPlayer:b}})(VideoPlayer);exports.default=_default;