import React from 'react';
import { Provider, Ad } from '../../src';
import { storiesOf } from '@storybook/react';

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
        chunkSize={5}
        enableAds={true}
        lazyOffset={800}
        initTimeout={400}
        bidTimeout={1200}
        setCentering={true}
        networkId={19968336}
        adUnitPath="header-bid-tag-0"
      >
        <Ad
          lazy
          size={[300, 250]}
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-0"
          sizeMap={[{ viewPort: [0, 0], slots: [300, 250] }]}
        />
        <Ad
          lazy
          size={[728, 90]}
          bidHandler={bidHandler}
          adUnitPath="header-bid-tag-1"
          sizeMap={[{ viewPort: [0, 0], slots: [[728, 90], [70, 250]] }]}
        />
      </Provider>
    );
  }
}

storiesOf('Prebid', module)
  .add('with text', () => (
    <Story />
  ));
