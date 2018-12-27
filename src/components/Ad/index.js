import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AdsContext } from '../context';
import connect from '../connector';
import inViewport from '../../utils/inViewport';

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

    /** 
     * Will return true when the ad gets defined.
     * @type {Boolean} 
     */ 
    this.displayed = false;

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

  refresh = this.cmdPush(() => {
    window.googletag.pubads().refresh([this.slot]);
  });

  destroyAd = this.cmdPush(() => window.googletag.destroySlots([this.slot]));

  addService = this.cmdPush(() => this.slot.addService(window.googletag.pubads()));

  setCollapseEmpty = this.cmdPush(() => {
    if (!this.props.setCollapseEmpty) return;
    this.slot.setCollapseEmptyDiv(true, true)
  });

  setTargeting = this.cmdPush(() => Object.entries(this.props.targeting)
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
    });
  });

  onDefine = () => {
    // event start
    this.defineSlot();
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
    
    return this.slot;
  }

  onDisplay = () => this.setState({ displayed: true }, this.refreshWhenVisible);

  refreshWhenVisible = () => {
    if (this.state.displayed) {
      const isVisible = inViewport(ReactDOM.findDOMNode(this));
      if (isVisible) {
        this.props.provider.refresh(this.slot);
        window.removeEventListener('scroll', this.refreshWhenVisible);
      }      
    }
  };

  componentDidMount() {
    const message = {
      type: this.props.lazy ? 'LAZY' : 'INITIAL',
      level: this.props.priority || 1,
      data: {
        onDefine: this.onDefine,
        onDisplay: this.onDisplay,
        id: this.props.id,
      }
    }
    
    this.props.provider.define(message);
    if (this.props.lazy) window.addEventListener('scroll', this.refreshWhenVisible);
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.destroyAd();
    this.unsetMQListeners();
  }

  render() {
    return (
        <div
          id={this.props.id}
          ref={ref => this.ref = ref}
          className={this.props.className}
          style={{ ...this.props.style, }}
        />
    );
  }
}

Ad.defaultProps = {
  id: 'id',
  style: {},
  lazy: false,
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
  lazy: PropTypes.bool,
};

export default connect(AdsContext, Ad);
