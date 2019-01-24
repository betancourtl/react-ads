"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoContext = exports.AdsContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdsContext = _react.default.createContext({});

exports.AdsContext = AdsContext;

var VideoContext = _react.default.createContext({});

exports.VideoContext = VideoContext;