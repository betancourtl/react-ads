import React from 'react';
import { Provider, Ad } from '../../src';

class Page extends React.Component {
  render() {
    return (
      <Provider
        adUnitPath="travel"
        networkId={6355419}
      >
        <div style={{ height: '150vh' }} /> 
        <Ad
          id="div-1"
          lazy={true}
          lazyOffset={0}
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] }
          ]}
        />
      </Provider>
    );
  }
}

export default Page;