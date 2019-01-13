/**
 * Will use call the requestAnimationFrame function. This is an alternative
 * to using a throttling function.
 * @param {Function} cb 
 * @function
 * @returns {void}
 */
const withRaf = cb => {
  let isTicking = false;
  return e => {
    if (!isTicking) {
      isTicking = true;
      window.requestAnimationFrame(() => cb(e));
      isTicking = false;
    }
  };
};

export default withRaf;
