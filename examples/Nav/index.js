import React from 'react';
import { NavLink } from 'react-router-dom';

export default (props = {}) => {
  return (
    <ul>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/InfiniteScroll'>InfiniteScroll</NavLink></li>
      <li><NavLink to='/Prebid'>Prebid</NavLink></li>
    </ul>
  );
};