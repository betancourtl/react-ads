/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubSub from '../../lib/Pubsub';
import { AdsContext } from '../context';
import bidManager from '../../utils/bidManager';
import timedPromise from '../../utils/timedPromise';
import {
  refresh,
  destroySlots,
  setTargeting,
  setCentering,
  enableServices,
  enableVideoAds,
  createGPTScript,
  setAdIframeTitle,
  collapseEmptyDivs,
  disableInitialLoad,
  enableSingleRequest,
  enableAsyncRendering,
} from '../../utils/googletag';

const STARTED = 'STARTED';
const SUCCESS = 'SUCCESS';
const FAIL = 'FAIL';

class Provider extends Component {
  constructor(props) {
    super(props);
    const { gpt } = props;
    if (!props.enableAds) return;
    this.pubsub = props.pubsub;
    this.slotCount = {};
    this.initGPT();
    this.bidManager = bidManager({
      refresh: gpt.refresh,
      chunkSize: props.chunkSize,
      bidTimeout: props.bidTimeout,
      bidProviders: props.bidProviders,
      refreshDelay: props.refreshDelay,
      onBiddersReady: fn => this.pubsub.on('bidders-ready', fn),
    });
    this.initBidders();

    // video
    this.videoStatus = '';
    this.videoQue = [];
  }

  /**
   * Initializes GPT.
   * @function
   * @returns {void}
   */
  initGPT = () => {
    const { props } = this;
    const { gpt } = props;
    gpt.createGPTScript();
    gpt.setCentering(props.setCentering);
    gpt.setAdIframeTitle(props.adIframeTitle);
    gpt.enableVideoAds(props.enableVideoAds);
    gpt.collapseEmptyDivs(props.collapseEmptyDivs);
    gpt.enableAsyncRendering(true);
    gpt.enableSingleRequest(true);
    gpt.disableInitialLoad(true);
    gpt.setTargeting(props.targeting);
    gpt.enableServices();
    gpt.destroySlots();
  }

  /**
   * It calls the bidProvider's init fns and when the bidders are ready it lets 
   * the bidManager know that it can start bidding.
   * @function
   * @returns {void}
   */
  initBidders = () => {
    if (!this.props.bidProviders.length) this.pubsub.emit('bidders-ready', true);
    else {
      timedPromise(
        this.props.bidProviders.map(bidder => bidder._init()),
        this.props.initTimeout
      )
        .catch(err => console.log('Error initializing bidders', err))
        .finally(() => this.pubsub.emit('bidders-ready', true));
    }
  }

  loadVideoScripts = (scripts, postFix = 'postfix') => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(reject, 4000);
      let remaining = scripts.length;

      const onLoad = () => {
        remaining = remaining - 1;
        if (remaining <= 0) {
          clearTimeout(timeout);
          resolve();
        }
      };

      const fragment = document.createDocumentFragment();

      scripts.forEach((src, index) => {
        const id = `instream-js-${index + postFix}`;
        const exists = document.getElementById(id);

        if (exists) {
          console.log('Already loaded');
          return onLoad();
        }
        const el = document.createElement('script');
        el.src = src;
        el.id = id;
        el.async = true;
        el.defer = true;
        el.onload = onLoad;
        el.onerror = onLoad;
        fragment.appendChild(el);
      });

      document.head.appendChild(fragment);
    });
  }

  loadVideoCss = () => {
    return new Promise((resolve, reject) => {

      const timeout = setTimeout(reject, 4000);
      const stylesheets = [
        '//googleads.github.io/videojs-ima/node_modules/video.js/dist/video-js.min.css',
        '//googleads.github.io/videojs-ima/node_modules/videojs-contrib-ads/dist/videojs.ads.css',
        '//googleads.github.io/videojs-ima/dist/videojs.ima.css'
      ];

      let remaining = stylesheets.length;

      const onLoad = () => {
        remaining = remaining - 1;

        if (remaining <= 0) {
          clearTimeout(timeout);
          resolve();
        }
      };

      const fragment = document.createDocumentFragment();

      stylesheets.forEach((href, index) => {
        const id = `instream-css-${index}`;
        const exists = document.getElementById(id);

        if (exists) return onLoad();

        const el = document.createElement('link');
        el.href = href;
        el.id = id;
        el.rel = 'stylesheet';
        el.onload = onLoad;
        el.onerror = onLoad;
        fragment.appendChild(el);
      });

      document.head.appendChild(fragment);
    });
  }

  loadVideoPlayer = cb => {
    if (this.videoStatus === FAIL) return;
    if (this.videoStatus === STARTED) return this.videoQue.push(cb);
    if (this.videoStatus === SUCCESS) return cb();
    if (this.videoStatus === '') {
      this.videoQue.push(cb);
      this.videoStatus = STARTED;
    }

    return this.loadVideoScripts(['//googleads.github.io/videojs-ima/node_modules/video.js/dist/video.min.js'], '-1')
      .then(() => this.loadVideoScripts([
        '//imasdk.googleapis.com/js/sdkloader/ima3.js',
        '//googleads.github.io/videojs-ima/node_modules/videojs-contrib-ads/dist/videojs.ads.min.js',
        '//googleads.github.io/videojs-ima/dist/videojs.ima.js'
      ]), '-2')
      .then(() => this.loadVideoCss())
      .then(() => {
        this.videoStatus = SUCCESS;
        this.videoQue.forEach(fn => fn());
      })
      .catch(() => {
        this.videoStatus = FAIL;
        this.videoQue.forEach(fn => fn());
      });
  }

  /**
   * Will generate the id for the adSlot.
   * @param {String} type
   * @returns {String}
   */
  generateId = (type = 'ad') => {
    this.slotCount[type];
    if (isNaN(this.slotCount[type])) this.slotCount[type] = 1;
    else this.slotCount[type] = this.slotCount[type] + 1;
    return `${type}${this.props.divider}${this.slotCount[type]}`;
  };

  componentWillUnmount() {
    if (!this.props.enableAds) return;
    this.pubsub.clear();
  }

  /**
   * Will fire the custom refresh-ad event, when fired.   
   * @param {String|String[]} ids - An Array of ids'
   * @function
   * @returns {void}
   */
  refreshAdById = ids => {
    [].concat(ids).forEach(id => {
      window.dispatchEvent(new CustomEvent('refresh-ad', { detail: { id } }));
    });
  }

  render() {
    return (
      <AdsContext.Provider value={{
        generateId: this.generateId,
        enableAds: this.props.enableAds,
        networkId: this.props.networkId,
        refresh: this.bidManager.refresh,
        adUnitPath: this.props.adUnitPath,
        bidHandler: this.props.bidHandler,
        lazyOffset: this.props.lazyOffset,
        refreshAdById: this.refreshAdById,
        loadVideoPlayer: this.loadVideoPlayer,
      }}
      >
        {this.props.children}
      </AdsContext.Provider>
    );
  }
}

Provider.defaultProps = {
  divider: '_',
  networkId: 0,
  chunkSize: 5,
  targeting: {},
  enableAds: true,
  lazyOffset: 800,
  bidProviders: [],
  bidTimeout: 1000,
  initTimeout: 350,
  refreshDelay: 200,
  adIframeTitle: '',
  setCentering: true,
  pubsub: new PubSub(),
  bidHandler: undefined,
  enableVideoAds: false,
  collapseEmptyDivs: false,
  // GPT
  gpt: {
    refresh,
    setCentering,
    setTargeting,
    destroySlots,
    enableServices,
    enableVideoAds,
    createGPTScript,
    setAdIframeTitle,
    collapseEmptyDivs,
    disableInitialLoad,
    enableSingleRequest,
    enableAsyncRendering,
  }
};

Provider.propTypes = {
  divider: PropTypes.string,
  enableAds: PropTypes.bool,
  bidHandler: PropTypes.func,
  targeting: PropTypes.object,
  chunkSize: PropTypes.number,
  adUnitPath: PropTypes.string,
  bidTimeout: PropTypes.number,
  lazyOffset: PropTypes.number,
  setCentering: PropTypes.bool,
  bidProviders: PropTypes.array,
  initTimeout: PropTypes.number,
  refreshDelay: PropTypes.number,
  enableVideoAds: PropTypes.bool,
  adIframeTitle: PropTypes.string,
  collapseEmptyDivs: PropTypes.bool,
  pubsub: PropTypes.instanceOf(PubSub),
  networkId: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  gpt: PropTypes.shape({
    refresh: PropTypes.func.isRequired,
    destroySlots: PropTypes.func.isRequired,
    setCentering: PropTypes.func.isRequired,
    setTargeting: PropTypes.func.isRequired,
    enableServices: PropTypes.func.isRequired,
    createGPTScript: PropTypes.func.isRequired,
    setAdIframeTitle: PropTypes.func.isRequired,
    collapseEmptyDivs: PropTypes.func.isRequired,
    disableInitialLoad: PropTypes.func.isRequired,
    enableSingleRequest: PropTypes.func.isRequired,
    enableAsyncRendering: PropTypes.func.isRequired,
  })
};

export default Provider;
