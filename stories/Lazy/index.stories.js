import React from 'react';
import { Provider, Ad } from '../../src';
import { storiesOf } from '@storybook/react';

class Story extends React.Component {
  render() {
    return (
      <Provider
        adUnitPath="travel"
        networkId={6355419}
      >
        <div style={{ height: '250vh' }} /> 
        <Ad
          lazy={true}
          lazyOffset={1}
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMap={[
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] }
          ]}
        />
      </Provider>
    );
  }
}

storiesOf('Lazy', module)
  .add('with text', () => (
    <Story />
  ));
