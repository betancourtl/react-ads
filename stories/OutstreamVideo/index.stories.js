import React from 'react';
import { Provider, Ad } from '../../src';
import { storiesOf } from '@storybook/react';
import prebid from '../utils';

const bidHandler = ({ id }) => {
  return {
    prebid: {
      code: id,
      mediaTypes: {
        video: {
          context: 'outstream',
          playerSize: [640, 480],
        }
      },
      bids: [{
        bidder: 'appnexus',
        params: {
          placementId: 13232385,
          video: {
            skippable: true,
            playback_method: ['auto_play_sound_off']
          }
        }
      }]
    }
  };
};

class Story extends React.Component {
  render() {
    return (
      <Provider
        bidProviders={[prebid]}
        bidHandler={bidHandler}
        enableVideoAds
        chunkSize={5}
        adUnitPath="prebid_outstream_adunit_1"
        networkId={19968336}
      >
        <h2>Outstream Video</h2>
        <Ad
          id="video1"
          type="video"
          sizeMap={[
            { viewPort: [0, 0], slots: [[1, 1]] },
          ]}
        />
      </Provider>
    );
  }
}

storiesOf('Outstream Video', module)
  .add('Outstream', () => (
    <Story />
  ));
