import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hideHOC from '../../hoc/hide';
import { AdsContext } from '../context';
import connect from '../../hoc/connector';

/**
 * This is still a prototype and is not meant to be used yet.
 */
class Video extends Component {
  constructor(props) {
    super();
    this.id = props.id || props.generateId(props.type);
  }

  /**
 * Will call the bidder function.
 * @funtion
 * @returns {Function | Null}
 */
  get bidHandler() {
    return this.props.bidHandler
      ? this.props.bidHandler({
        id: this.id,
        sizes: this.props.playerSize,
      })
      : null;
  }

  componentDidMount() {
    var pbjs = window.pbjs || {};
    pbjs.queue = pbjs.queue || [];
    const adUnits = [this.bidHandler.prebid];
    pbjs.que.push(() => {
      pbjs.addAdUnits(adUnits);
      pbjs.requestBids({
        timeout: 5000,
        bidsBackHandler: (bids) => {
          var highestCpmBids = pbjs.getHighestCpmBids(this.id);
          pbjs.renderAd(document, highestCpmBids[0].adId);
        }
      });
    });
  }

  render() {
    return (
      <div id={this.id}>
        Hello World
      </div>
    );
  }
}

Video.defaultProps = {
  id: '',
  lazy: false,
  priority: 2,
  type: 'video',
  lazyOffset: 800,
  bidHandler: () => { },
  generateId: () => { },
  playerSize: [640, 480],
};

Video.propTypes = {
  lazy: PropTypes.bool,
  type: PropTypes.string,
  priority: PropTypes.number,
  lazyOffset: PropTypes.number,
  id: PropTypes.string.isRequired,
  bidHandler: PropTypes.func.isRequired,
  generateId: PropTypes.func.isRequired,
  playerSize: PropTypes.array.isRequired,
};

export const MaybeHiddenAd = hideHOC(Video);

const stateToProps = ({ generateId, lazyOffset, refresh, enableAds }) => {
  return {
    refresh,
    enableAds,
    generateId,
    lazyOffset,
  };
};

export default connect(AdsContext, stateToProps)(MaybeHiddenAd);
