import React from 'react';
import { Provider, Ad } from '../../src';
import { storiesOf } from '@storybook/react';

class Story extends React.Component {
  constructor() {
    super();
    this.state = {
      qty: 0,
      amount: 1,
    };
  }

  render() {
    return (
      <Provider
        refreshDelay={1000}
        adUnitPath="travel"
        networkId={6355419}
      >
        <div>
          <label>Load More</label>
          <input
            type="number"
            value={this.state.amount}
            onChange={e => this.setState({ amount: e.target.value })}
          />
          <button onClick={() => this.setState({ qty: Number(this.state.qty) + Number(this.state.amount) })}>
            More Ads
          </button>
        </div>

        <div>
          {Array(this.state.qty).fill('').map((x, i) => {
            return (
              <Ad
                key={i}
                lazy={true}
                size={[728, 90]}
                targeting={{ test: 'infinitescroll' }}
                sizeMap={[
                  { viewPort: [850, 200], slots: [728, 90] },
                  { viewPort: [0, 0], slots: [] },
                ]}
              />
            );
          })}
        </div>
      </Provider>
    );
  }
}

storiesOf('Event', module)
  .add('Click event', () => (
    <Story />
  ));
