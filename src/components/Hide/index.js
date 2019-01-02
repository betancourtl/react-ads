import React from 'react';

const hideHOC = Component => props => {
  if (!props.provider.enableAds) return null;
  const Ad = <Component {...props} />;
  return Ad;
};

export default hideHOC;