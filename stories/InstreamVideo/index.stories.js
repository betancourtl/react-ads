import React from 'react';
import { Video } from '../../src';
import prebid from '../utils';
import { storiesOf } from '@storybook/react';
import Provider from '../../src/components/Provider';

class Story extends React.Component {
  render() {
    const bidHandler = ({ id, playerSize }) => ({
      prebid: {
        code: id,
        mediaTypes: {
          video: {
            context: 'instream',
            playerSize: playerSize,
          },
        },
        bids: []
      }
    });

    return (
      <Provider
        bidProviders={[prebid]}        
      >
        <Video
          id="video_1"
          bidHandler={bidHandler}
          playerSize={[640, 480]}
        />
      </Provider>
    );
  }
}

storiesOf('Instream Video', module)
  .add('Instream', () => (
    <Story />
  ));
