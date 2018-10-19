import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, Ad } from '../src';

const App = (props = {}) => {
  return (
    <div>
      <Ad id="id-1"/>
    </div>
  );
};

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.querySelector('#root')
);

module.hot.accept();