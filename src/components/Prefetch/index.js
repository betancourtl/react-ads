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
    console.log('prefetch running');
    this.prefetch();
  }

  /**
   * Will call the bidHandler function that generates the adUnit code.
   * @funtion
   * @returns {Function | Null}
   */
  get bidHandler() {
    return this.props.bidHandler({ id: this.props.id, sizes: this.props.sizes });
  }

  /**
   * Will refresh this slot using the refresh function passed by the provider.
   * component.
   * @function   
   * @returns {void}
   */
  prefetch() {
    console.log('prefetch called');
    this.props.refresh({
      priority: this.props.priority,
      data: {
        id: this.props.id,
        bids: this.bidHandler,
        type: 'prefetch',
      }
    });
  }

  componentDidMount() {
    console.log('component mounted');
  }

  render() {
    return <div>Hello</div>;
  }
}

Prefetch.defaultProps = {
  id: '',
  priority: 1,
  refresh: () => { },
  bidHandler: () => { },
};

Prefetch.propTypes = {
  priority: PropTypes.number,
  id: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  bidHandler: PropTypes.func.isRequired,
};

export const stateToProps = ({ refresh }) => {
  return {
    refresh,
  };
};

export {
  Prefetch,
};

export default connect(AdsContext, stateToProps)(Prefetch);
