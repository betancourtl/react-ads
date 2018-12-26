import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';

ReactDOM.render(<Routes />, document.querySelector('#root'));

module.hot.accept();