/**
 * 
 * @param {Array[]?} - Array or numbers or Array or Arrays of numbers.
 * @returns {Array[]}
 */
export const formatSizes = (sizes) => {
  if (typeof sizes === 'string') return [];
  const isArray = Array.isArray(sizes);
  const isArrayOfArrays = isArray && sizes.every(x => Array.isArray(x)); 
  
  return isArray && !isArrayOfArrays ? [sizes] : sizes;
};