import React from 'react';
import Article from './Article';
import { Provider } from '../../../src';

class Page extends React.Component {
  constructor() {
    super();
    this.state = {
      articleQty: 1
    }
  }

  loadMore = e => {
    window.googletag.cmd.push(() => {
      window.googletag.pubads().enableSingleRequest(false);
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
        enableSingleRequest
        enableLazyLoad={{
          fetchMarginPercent: 100,  // Fetch slots within 5 viewports.
          renderMarginPercent: 50,  // Render slots within 2 viewports.
          mobileScaling: 1.5  // Double the above values on mobile.
        }}
      >
        {Array(this.state.articleQty).fill('').map((x, i) => {
          return <Article key={i + 1} id={'id-' + (i + 1)} />;
        })}
      </Provider>
    );
  }
}

export default Page;