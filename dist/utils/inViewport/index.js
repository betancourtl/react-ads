"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.inView = void 0;

/**
 * Will return true if the element is in view.
 * @param {HTMLElement} el - Ad HTML element.
 * @param {Number} offset - Amount of offset to add detect when an the element 
 * is in view.
 * @returns {Boolean}
 */
var elementInViewport = function elementInViewport(el) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var top = el.offsetTop;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return inView({
    windowInnerHeight: window.innerHeight,
    windowPageYOffset: window.pageYOffset,
    elementYOffset: top,
    elementHeight: el.offsetHeight,
    offset: offset
  });
};

var inView = function inView(_ref) {
  var windowInnerHeight = _ref.windowInnerHeight,
      windowPageYOffset = _ref.windowPageYOffset,
      elementYOffset = _ref.elementYOffset,
      elementHeight = _ref.elementHeight,
      offset = _ref.offset;
  var visibleRect = {
    top: windowPageYOffset,
    bottom: windowPageYOffset + windowInnerHeight
  };
  var elRect = {
    top: elementYOffset - offset,
    bottom: elementYOffset + elementHeight + offset
  };
  return elRect.bottom >= visibleRect.top && elRect.top <= visibleRect.bottom;
};

exports.inView = inView;
var _default = elementInViewport;
exports.default = _default;