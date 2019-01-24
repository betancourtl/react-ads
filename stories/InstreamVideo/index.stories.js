import React from 'react';
import { Video } from '../../src';
import { storiesOf } from '@storybook/react';
import VideoProvider from '../../src/components/VideoProvider';

class Story extends React.Component {
  render() {
    return (
      <VideoProvider>
        <Video id="video_1" />
        <Video id="video_2" />
      </VideoProvider>
    );
  }
}

storiesOf('Instream Video', module)
  .add('Instream', () => (
    <Story />
  ));
