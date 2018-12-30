import React from 'react';
import { Provider, Ad } from '../../src';
import prebid from '@webdeveloperpr/prebid';

const bidderCode = (id, sizes) => ({
  code: id,
  mediaTypes: {
    banner: {
      sizes: sizes
    }
  },
  bids: [{
    bidder: 'appnexus',
    params: {
      placementId: 13144370
    }
  }]
});

class Page extends React.Component {
  render() {
    return (
      <Provider
        prebid={prebid}
        chunkSize={5}
        prebidTimeout={1000}
        prebidFailsafeTimeout={1200}
        adUnitPath="header-bid-tag-0"
        networkId={19968336}
      >
        <Ad
          id="div-1"
          adUnitPath="header-bid-tag-0"
          lazy
          bidderCode={bidderCode}
          size={[300, 250]}
          sizeMapping={[
            { viewPort: [0, 0], slots: [300, 250] },
          ]}
        />

        <Ad
          id="div-2"
          adUnitPath="header-bid-tag-1"
          lazy
          bidderCode={bidderCode}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [0, 0], slots: [[728, 90], [70, 250]] },
          ]}
        />
      </Provider>
    );
  }
}

export default Page;