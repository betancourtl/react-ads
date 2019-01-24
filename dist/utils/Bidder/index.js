"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @class
 * @classdesc Acts as an interface to communicate with the bidding system.
 */
var Bidder = function Bidder(name) {
  var _this = this;

  _classCallCheck(this, Bidder);

  _defineProperty(this, "_interfaceError", function (fnName) {
    throw Error("".concat(fnName, " is not implemented on ").concat(_this.name, " Bidder."));
  });

  _defineProperty(this, "_init", function () {
    var p = _this.init();

    if (p && p.then) return p.then(function () {
      _this.isReady = true;
      return "".concat(_this.name, " resolved");
    }).catch(function () {
      _this.isReady = false;
      return "".concat(_this.name, " rejected");
    });else {
      _this.isReady = true;
      return Promise.resolve("".concat(_this.name, " resolved"));
    }
  });

  _defineProperty(this, "init", function () {
    _this._interfaceError('init');
  });

  _defineProperty(this, "handleResponse", function () {
    _this._interfaceError('handleResponse');
  });

  _defineProperty(this, "onTimeout", function () {
    _this._interfaceError('onTimeout');
  });

  _defineProperty(this, "onBidWon", function () {
    _this._interfaceError('onBidWon');
  });

  _defineProperty(this, "_fetchBids", function () {
    for (var _len = arguments.length, props = new Array(_len), _key = 0; _key < _len; _key++) {
      props[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      if (!_this.isReady) {
        console.log("".concat(_this.name, " Bidder is not ready"));
        return reject('Bidder is not ready.');
      }

      var id = setTimeout(function () {
        reject('Timed Out');
      }, _this.safeTimeout);
      return _this.fetchBids.apply(_this, props).then(resolve).catch(reject).finally(function () {
        clearTimeout(id);
      });
    });
  });

  _defineProperty(this, "fetchBids", function () {
    _this._interfaceError('fetchBids');
  });

  if (!name) throw Error('Bidder expects a name to be passed.');
  /**
   * The name of the bidder.
   * @type {String}
   */

  this.name = name;
  /**
   * If the bidder is ready to make bids.
   * @type {Boolean}
   */

  this.isReady = false;
  /**
   * Bids timeout. If the bidder does not get any responses from the server in
   * the specified amount of time it will end the bidder request.
   * @type {Number}
   */

  this.timeout = 1000;
  /**
   * Failsafe timeout used to stop waiting fir bids in case the first timeout 
   * fails for some reason.
   * @type {Number}
   */

  this.safeTimeout = 3000;
}
/**
 * Internal function used to throw errors in methods that are not defined.
 * @private
 * @throws
 * @param {String}
 * @returns {void}   
 */
;

var _default = Bidder;
exports.default = _default;