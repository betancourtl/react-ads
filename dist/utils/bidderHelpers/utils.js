"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatSizes = void 0;

/**
 * 
 * @param {Array[]?} - Array or numbers or Array or Arrays of numbers.
 * @returns {Array[]}
 */
var formatSizes = function formatSizes(sizes) {
  if (typeof sizes === 'string') return [];
  var isArray = Array.isArray(sizes);
  var isArrayOfArrays = isArray && sizes.every(function (x) {
    return Array.isArray(x);
  });
  return isArray && !isArrayOfArrays ? [sizes] : sizes;
};

exports.formatSizes = formatSizes;