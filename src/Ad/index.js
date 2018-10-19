import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Ad extends Component {
  constructor(props) {
    super(props);
    this.slot = null;
  }

  push = (cb) => () => window.googletag.cmd.push(cb);
  createSlot = this.push(() => this.slot = window.googletag.defineSlot(
    this.props.adUnitPath,
    this.props.size,
    this.props.id
  ));
  display = this.push(() => window.googletag.display(this.props.id));
  destroyAd = this.push(() => window.googletag.destroySlots([this.slot]));
  addService = this.push(() => this.slot.addService(window.googletag.pubads()));
  enableService = this.push(() => window.googletag.enableServices());

  componentDidMount() {
    this.createSlot();
    this.addService();
    this.enableService();
    this.display();
  }

  componentWillUnmount() {
    this.destroy();
  }

  render() {
    return (
      <div id={this.props.id}>
        <span onClick={e => {
          e.preventDefault();
          this.destroyAd();
        }}>
          X
        </span>
      </div>
    );
  }
}

Ad.defaultProps = {
  id: 'id',
  adUnitPath: '/6355419/Travel/Europe/France/Paris',
  size: [300, 250]
};

Ad.propTypes = {
  id: PropTypes.string.isRequired,
  adUnitPath: PropTypes.string.isRequired,
  size: PropTypes.array.isRequired,
};

export default Ad;
