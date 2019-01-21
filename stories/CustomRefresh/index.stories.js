import React from 'react';
import { Provider, Ad, withAdRefresh } from '../../src';
import { storiesOf } from '@storybook/react';

class Story extends React.Component {
  constructor() {
    super();
    this.state = {
      qty: 1,
      amount: 1
    };
  }

  render() {
    return (
      <Provider
        refreshDelay={100}
        adUnitPath="travel"
        networkId={6355419}
      >
        <p>
          Create an ad and then click on the refresh ad button.
        </p>

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

        <br />

        <Button />

        <div>
          {Array(this.state.qty).fill('').map((x, i) => {
            return (
              <Ad
                key={i}
                lazy={true}
                size={[728, 90]}
                type="leaderboard"
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


class UnwrappedComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 'leaderboard_1',
    };
  }

  render() {
    return (
      <div>

        <div>
          <label>
            Refresh ad
          </label>
          <input
            type="text"
            value={this.state.value}
            onChange={e => this.setState({ value: e.target.value })}
          />
          <button onClick={() => this.props.refreshAdById(this.state.value)}>
            Refresh
          </button>
        </div>

        <br />

        <div>
          <label>
            Refresh All Ads
          </label>
          <button onClick={() => {
            const adIds = [...document.querySelectorAll('[data-react-ad]')].map(x => x.id);
            this.props.refreshAdById(adIds);
          }}>
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

const Button = withAdRefresh(UnwrappedComponent);

storiesOf('withAdRefresh hoc', module)
  .add('CustomRefresh ', () => <Story />);
