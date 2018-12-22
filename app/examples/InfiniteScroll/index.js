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
        enableLazyLoad={{
          fetchMarginPercent: 1,  // Fetch slots within 5 viewports.
          renderMarginPercent: 2,  // Render slots within 2 viewports.
          mobileScaling: 1.0  // Double the above values on mobile.
        }}
        enableVideoAds={false}
        collapseEmptyDivs={false}
        disableInitialLoad={false}
        enableSingleRequest={true}
      >
        {Array(this.state.articleQty).fill('').map((x, i) => {
          return <Article key={i + 1} id={'id-' + (i + 1)} />;
        })}
      </Provider>
    );
  }
}

export default Page;