import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

class Ad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBorder: true,
    };
    /**
     * Reference the the googletag GPT slot.
     * @type {object}
     */
    this.slot = null;
    /**
     * List of event listener removing functions.
     * @type {Array}
     */
    this.listeners = [];

    this._setState = (props) => {
      if (this.unmounted) return;
      this.setState(props);
    };
  }

  cmdPush = (cb) => () => window.googletag.cmd.push(cb);

  defineSlot = () => {
    window.googletag.cmd.push(() => {
      this.slot = this.props.outOfPageSlot
        ? window.googletag.defineOutOfPageSlot(this.props.adUnitPath, this.props.id)
        : window.googletag.defineSlot(this.props.adUnitPath, this.props.size, this.props.id);
    });
  };

  display = this.cmdPush(() => {
    window.googletag.display(this.props.id);
  });

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

      this.listeners.push(() => mq.removeListener(this.refresh));
    });
  });

  unsetMQListeners = this.cmdPush(() => {
    this.listeners.forEach(fn => fn());
  });

  setMappingSize = this.cmdPush(() => {
    if (!this.props.sizeMapping) return;
    const mapping = this.props.sizeMapping.reduce((acc, x) => acc.addSize(x.viewPort, x.slots), window.googletag.sizeMapping());
    this.slot.defineSizeMapping(mapping.build());
  });

  withAdProps = (props) => ({
    id: this.props.id,
    ref: this.ref,
    ...props,
  });

  slotRenderEnded = this.cmdPush(() => {
    if (typeof this.props.onSlotRenderEnded !== 'function') return;

    window.googletag.pubads().addEventListener('slotRenderEnded', e => {
      if (e.slot === this.slot) this.props.onSlotRenderEnded(this.withAdProps(e));
    });
  });

  impressionViewable = this.cmdPush(() => {
    if (typeof this.props.onImpressionViewable !== 'function') return;
    window.googletag.pubads().addEventListener('impressionViewable', e => {
      if (e.slot === this.slot) this.props.onImpressionViewable(this.withAdProps(e));
    });
  });

  slotVisibilityChanged = this.cmdPush(() => {
    if (typeof this.props.onSlotVisibilityChanged !== 'function') return;
    window.googletag.pubads().addEventListener('slotVisibilityChanged', e => {
      if (e.slot === this.slot) this.props.onSlotVisibilityChanged(this.withAdProps(e));
    });
  });

  slotOnload = this.cmdPush(() => {

    window.googletag.pubads().addEventListener('slotOnload', e => {
      if (typeof this.props.onSlotOnLoad === 'function') {
        if (e.slot === this.slot) this.props.onSlotOnLoad(this.withAdProps(e));
      }
      this._setState({ showBorder: false, });
    });
  });

  componentDidMount() {
    this.defineSlot();
    // event start
    this.slotOnload();
    this.slotRenderEnded();
    this.impressionViewable();
    this.slotVisibilityChanged();
    // events end
    this.setMappingSize();
    this.setMQListeners();
    this.setCollapseEmpty();
    this.addService();
    this.setTargeting();
    this.display()
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.destroyAd();
    this.unsetMQListeners();
  }

  getAdDimensions = (
    size = { width: this.props.size[0], height: this.props.size[1] },
    sizeMap = this.props.sizeMapping,
    wWidth = window.innerWidth,
  ) => {
    return sizeMap
      .sort((a, b) => a.viewPort[0] < b.viewPort[0] ? -1 : 1)
      .reduce((acc, { viewPort: [vWidth], slots: [width, height] }) => {
        return (wWidth >= vWidth) ? { width, height } : acc;
      }, { width: size.width, height: size.height });
  };

  render() {
    const dim = this.getAdDimensions();
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          border: '1px solid black',
          width: dim.width + 'px',
          height: dim.height + 'px',
          display: this.state.showBorder ? 'block' : 'none',
          left: 0,
          right: 0,
          margin: '0 auto',
          position: 'absolute',
        }} />
        <div
          id={this.props.id}
          ref={ref => this.ref = ref}
          className={this.props.className}
          style={{ ...this.props.style, }}
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
  outOfPageSlot: false,
  setCollapseEmpty: false,
  adUnitPath: '/6355419/Travel/Europe/France/Paris',
  onSlotRenderEnded: null,
  onImpressionViewable: null,
  onSlotOnLoad: null,
  onSlotVisibilityChanged: null,
};

Ad.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  targeting: PropTypes.object,
  outOfPageSlot: PropTypes.bool,
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
  // events
  onSlotOnLoad: PropTypes.func,
  onSlotRenderEnded: PropTypes.func,
  onImpressionViewable: PropTypes.func,
  onSlotVisibilityChanged: PropTypes.func,
};

export default Ad;
