import React from 'react';
import Article from './Article';
import { Provider } from '../../src';
import { storiesOf } from '@storybook/react';

class Story extends React.Component {
  constructor() {
    super();
    this.state = {
      articleQty: 1
    };
  }

  loadMore = () => {
    window.googletag.cmd.push(() => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        !this.unmounted && this.setState({ articleQty: this.state.articleQty + 1 });
      }
    });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.loadMore);
  }

  componentWillUnmount() {
    this.unmounted = true;
    window.removeEventListener('scroll', this.loadMore);
  }

  render() {
    return (
      <Provider
        refreshDelay={200}
        enableVideoAds={false}
        collapseEmptyDivs={false}
        adUnitPath="travel"
        networkId={6355419}
      >
        {Array(this.state.articleQty).fill('').map((x, i) => {
          return <Article key={i + 1} />;
        })}
      </Provider>
    );
  }
}

storiesOf('InfiniteScroll', module)
  .add('with text', () => (
    <Story />
  ));
