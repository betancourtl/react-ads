import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { initializeGoogleTags } from '../utils';

class Provider extends Component {
  constructor() {
    super();
    initializeGoogleTags();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

Provider.defaultProps = {
  enableSingleRequest: true,
};

Provider.propTypes = {
  enableSingleRequest: PropTypes.bool,
};

export default Provider;
