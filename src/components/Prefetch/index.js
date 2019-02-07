/* eslint-disable no-console */
/* eslint-disable react/no-find-dom-node */
import React from 'react';
import PropTypes from 'prop-types';
import hideHOC from '../../hoc/hide';
import { AdsContext } from '../context';
import connect from '../../hoc/connector';

class Prefetch extends React.Component {
  constructor(props) {
    super(props);
    // Call prefetch right away.
    this.prefetch();
  }

  /**
   * Will call the bidHandler function that generates the adUnit code.
   * @funtion
   * @returns {Function | Null}
   */
  get bidHandler() {
    return this.props.bidHandler({ id: this.props.id });
  }

  /**
   * Will refresh this slot using the refresh function passed by the provider.
   * component.
   * @function   
   * @returns {void}
   */
  prefetch() {
    this.props.prefetch({
      priority: this.props.priority,
      data: {
        id: this.props.id,
        bids: this.bidHandler,
        type: 'prefetch',
      }
    });
  }

  render() {
    return null;
  }
}

Prefetch.defaultProps = {
  id: '',
  priority: 1,
  prefetch: () => { },
  bidHandler: () => { },
};

Prefetch.propTypes = {
  priority: PropTypes.number,
  id: PropTypes.string.isRequired,
  prefetch: PropTypes.func.isRequired,
  bidHandler: PropTypes.func.isRequired,
};

const MaybeHiddenAd = hideHOC(Prefetch);

export const stateToProps = ({ prefetch }) => {
  return {
    prefetch,
  };
};

export {
  Prefetch,
  MaybeHiddenAd,
};

export default connect(AdsContext, stateToProps)(MaybeHiddenAd);
