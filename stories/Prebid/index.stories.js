import React from 'react';
import { Provider, Ad } from '../../src';
import { storiesOf } from '@storybook/react';
import prebid from '../../src/utils/Bidder/prebid';

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

class Story extends React.Component {
  render() {
    return (
      <Provider
        bidProviders={[prebid]}
        bidHandler={bidHandler}
        chunkSize={5}
        adUnitPath="header-bid-tag-0"
        networkId={19968336}
      >
        <Ad
          lazy
          type="lazy"
          adUnitPath="header-bid-tag-0"
          size={[300, 250]}
          sizeMap={[
            { viewPort: [0, 0], slots: [300, 250] },
          ]}
        />

        <Ad
          adUnitPath="header-bid-tag-1"
          lazy
          type="lazy"
          size={[728, 90]}
          sizeMap={[
            { viewPort: [0, 0], slots: [[728, 90], [70, 250]] },
          ]}
        />
      </Provider>
    );
  }
}

storiesOf('Readme', module)
  .add('example', () => (
    <Story />
  ));
