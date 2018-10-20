import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, Ad } from '../src';

const lazyLoad = {
  fetchMarginPercent: 50,  // Fetch slots within 5 viewports.
  renderMarginPercent: 50,  // Render slots within 2 viewports.
  mobileScaling: 1.5  // Double the above values on mobile.
};

ReactDOM.render(
  <Provider
    enableLazyLoad={lazyLoad}
    enableSingleRequest
    setCentering
  >
    <Ad
      id="id-1"
      adUnitPath="/6355419/travel"
      size={[300, 50]}
      sizeMapping={[
        { viewPort: [1050, 200], slots: [1024, 120] },
        { viewPort: [750, 200], slots: [728, 90] },
        { viewPort: [320, 700], slots: [320, 50] },
        { viewPort: [100, 100], slots: [300, 50] }
      ]}
      targeting={{ test: 'responsive' }}
    />
    <Ad
      id="id-2"
      adUnitPath="/6355419/Travel/Europe/France/Paris"
      size={[300, 250]}
      sizeMapping={[
        { viewPort: [1050, 200], slots: [] },
        { viewPort: [750, 200], slots: [] },
        { viewPort: [320, 700], slots: [300, 250] },
        { viewPort: [100, 100], slots: [300, 250] }
      ]}
    />
    <Ad
      id="id-3"
      adUnitPath="/6355419/Travel/Europe/France/Paris"
      size={[300, 250]}
      sizeMapping={[
        { viewPort: [1050, 200], slots: [] },
        { viewPort: [750, 200], slots: [] },
        { viewPort: [320, 700], slots: [300, 250] },
        { viewPort: [100, 100], slots: [300, 250] }
      ]}
    />

  </Provider>,
  document.querySelector('#root')
);

module.hot.accept();