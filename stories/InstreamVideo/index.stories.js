import React from 'react';
import { Video } from '../../src';
import { storiesOf } from '@storybook/react';

class Story extends React.Component {
  render() {
    return (
      <Video />
    );
  }
}

storiesOf('Instream Video', module)
  .add('Instream', () => (
    <Story />
  ));
