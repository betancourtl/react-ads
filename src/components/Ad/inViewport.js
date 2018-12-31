/**
 * Will return true if the element is in view.
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

export const inView = ({ 
  windowInnerHeight,
  windowPageYOffset, 
  elementYOffset, 
  elementHeight, 
  offset 
}) => {
  let visibleRect = {
    top: windowPageYOffset,
    bottom: windowPageYOffset + windowInnerHeight,
  };

  let elRect = {
    top: elementYOffset - offset,
    bottom: elementYOffset + elementHeight + offset,
  };

  return elRect.bottom >= visibleRect.top && elRect.top <= visibleRect.bottom;
};

export default elementInViewport;




