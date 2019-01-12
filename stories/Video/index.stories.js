import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider, Video } from '../../src';
import prebid from '../../src/utils/Bidder/prebid';

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

class Page extends React.Component {
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
    <Page />
  ));
