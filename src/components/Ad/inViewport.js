/**
 * 
 * @param {HTMLElement} el - Ad HTML element.
 */
const elementInViewport = (el, offset = 0) => {
  let top = el.offsetTop;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
  }

  return inView({
    windowInnerHeight: window.innerHeight,
    windowPageYOffset: window.pageYOffset,
    elementYOffset: top,
    elementHeight: el.offsetHeight,
    offset,
  });
};

const inView = ({ windowInnerHeight, windowPageYOffset, elementYOffset, elementHeight, offset }) => {
  let visibleRect = {
    top: windowPageYOffset, // 50
    bottom: windowPageYOffset + windowInnerHeight, // 100
  };

  let elRect = {
    top: elementYOffset - offset, // 50
    bottom: elementYOffset + elementHeight + offset, // 60
  };

  return elRect.bottom >= visibleRect.top && elRect.top <= visibleRect.bottom;
};

export default elementInViewport;




