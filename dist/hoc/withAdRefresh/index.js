"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _connector = _interopRequireDefault(require("../connector"));

var _context = require("../../components/context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Will wrap a Component with the the refreshAdById function.
 * @param {React.Context} AdsContext - The Ad Provider context.
 * @param {Function} props - Provider props to pass to the wrapped component.
 * @returns {React.Component}
 */
var withAdRefresh = (0, _connector.default)(_context.AdsContext, function (_ref) {
  var refreshAdById = _ref.refreshAdById;
  return {
    refreshAdById: refreshAdById
  };
});
var _default = withAdRefresh;
exports.default = _default;