import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

// TODO [] - Remove the event listeners for each individual ad.

class Ad extends Component {
  constructor(props) {
    super(props);
    /**
     * Reference the the googletag GPT slot.
     * @type {object}
     */
    this.slot = null;
  }

  cmdPush = (cb) => () => window.googletag.cmd.push(cb);

  createSlot = this.cmdPush(() => this.slot = window.googletag.defineSlot(
    this.props.adUnitPath,
    this.props.size,
    this.props.id
  ));

  display = this.cmdPush(() => window.googletag.display(this.props.id));

  refresh = this.cmdPush(() => {
    window.googletag.pubads().refresh([this.slot]);
  });

  destroyAd = this.cmdPush(() => window.googletag.destroySlots([this.slot]));

  addService = this.cmdPush(() => this.slot.addService(window.googletag.pubads()));

  setCollapseEmpty = this.cmdPush(() => {
    if (!this.props.setCollapseEmpty) return;
    this.slot.setCollapseEmptyDiv(true, true)
  });

  setTargeting = this.cmdPush(() => R.toPairs(this.props.targeting)
    .map(([k, v]) => this.slot.setTargeting(k, v)));

  setMQListeners = this.cmdPush(() => {
    if (!this.props.sizeMapping) return;
    this.props.sizeMapping.forEach(({ viewPort: [width] }) => {
      const mq = window.matchMedia(`(max-width: ${width}px)`);
      mq.addListener(this.refresh);
    });
  });

  setMappingSize = this.cmdPush(() => {
    if (!this.props.sizeMapping) return;
    const mapping = this.props.sizeMapping.reduce((acc, x) => acc.addSize(x.viewPort, x.slots), window.googletag.sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  });

  componentDidMount() {
    this.createSlot();
    this.setMappingSize();
    this.setMQListeners();
    this.setCollapseEmpty();
    this.addService();
    this.setTargeting();
    this.display()
  }

  componentWillUnmount() {
    this.destroyAd();
    // this.removeMQ();
  }

  render() {
    return (
      <div style={{ overflow: 'hidden' }}>
        <div
          id={this.props.id}
          className={this.props.className}
          style={this.props.style}
        >
        </div>
      </div>
    );
  }
}

Ad.defaultProps = {
  id: 'id',
  style: {},
  targeting: {},
  className: null,
  size: [300, 250],
  setCollapseEmpty: false,
  adUnitPath: '/6355419/Travel/Europe/France/Paris',
};

Ad.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  targeting: PropTypes.object,
  id: PropTypes.string.isRequired,
  setCollapseEmpty: PropTypes.bool,
  adUnitPath: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
  ]),
  sizeMapping: PropTypes.arrayOf(
    PropTypes.shape({
      viewPort: PropTypes.arrayOf(PropTypes.number),
      slots: PropTypes.arrayOf(PropTypes.number)
    })
  ),
};

export default Ad;
