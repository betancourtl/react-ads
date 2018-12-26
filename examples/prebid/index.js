import React from 'react';
import { Ad, Provider } from '../../../src';

class Page extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Provider>
        <h2>Ad 1</h2>
        <Ad
          id="ad-1"
          adUnitPath="/4020/test"
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [1050, 200], slots: [120, 600] },
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [320, 700], slots: [300, 250] },
            { viewPort: [100, 100], slots: [1, 1] }
          ]}
        />
        <h2>Ad 2</h2>
        <Ad
          id="ad-2"
          adUnitPath="/4020/test"
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [1050, 200], slots: [300, 250] },
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [320, 700], slots: [120, 600] },
            { viewPort: [100, 100], slots: [1, 1] }
          ]}
        />
      </Provider>
    );
  }
}

export default Page;