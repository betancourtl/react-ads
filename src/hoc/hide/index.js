import React from 'react';

/**
 * Will hide or show a react component.
 * @param {React.Component} 
 */
const hideHOC = Component => props => {
  if (!props.enableAds) return null;
  const Ad = <Component {...props} />;
  return Ad;
};

export default hideHOC;