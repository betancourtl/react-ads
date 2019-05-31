"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Will hide or show a react component.
 * @param {React.Component} 
 */
var hideHOC = function hideHOC(Component) {
  return function (props) {
    if (!props.enableAds) return null;

    var Ad = _react["default"].createElement(Component, props);

    return Ad;
  };
};

var _default = hideHOC;
exports["default"] = _default;