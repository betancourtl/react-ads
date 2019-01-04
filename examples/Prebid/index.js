import React from 'react';
import { Provider, Ad } from '../../src';
import prebid from '../../src/utils/Bidder/prebid';
import amazon from '../../src/utils/Bidder/amazon';

const bidHandler = ({ id, sizes }) => ({
  prebid: {
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
  }
});

class Page extends React.Component {
  render() {
    return (
      <Provider
        bidProviders={[prebid, amazon]}
        bidHandler={bidHandler}
        chunkSize={5}
        prebidTimeout={1000}
        prebidFailsafeTimeout={1200}
        adUnitPath="header-bid-tag-0"
        networkId={19968336}
      >
        <Ad
          id="div-1"
          lazy
          adUnitPath="header-bid-tag-0"
          size={[300, 250]}
          sizeMap={[
            { viewPort: [0, 0], slots: [300, 250] },
          ]}
        />

        <Ad
          id="div-2"
          adUnitPath="header-bid-tag-1"
          lazy
          size={[728, 90]}
          sizeMap={[
            { viewPort: [0, 0], slots: [[728, 90], [70, 250]] },
          ]}
        />
      </Provider>
    );
  }
}

export default Page;