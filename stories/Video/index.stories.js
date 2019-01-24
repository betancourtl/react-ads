import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider, Video } from '../../src';
import prebid from '../utils';

const bidHandler = ({ id, sizes }) => ({
  prebid: {
    code: id,
    sizes: sizes,
    mediaTypes: {
      video: {
        playerSize: sizes,
        context: 'outstream',
      }
    },
    renderer: {
      url: 'http://cdn.adnxs.com/renderer/video/ANOutstreamVideo.js',
      render: function (bid) {
        window.ANOutstreamVideo.renderAd({
          targetId: bid.adUnitCode,
          adResponse: bid.adResponse,
        });
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
    }],
  }
});

class Story extends React.Component {
  render() {
    return (
      <Provider
        bidProviders={[prebid]}
        chunkSize={5}
      >
        <Video
          type="video"
          bidHandler={bidHandler}
          playerSize={[[640, 480]]}
        />
      </Provider>
    );
  }
}

storiesOf('Video', module)
  .add('Outstream video', () => (
    <Story />
  ));
