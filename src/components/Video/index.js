import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AdsContext } from '../context';
import connect from '../../hoc/connector';
import inViewport from '../../utils/inViewport';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.unmounted = false;
    this.refreshWhenVisible = this.refreshWhenVisible.bind(this);
  }

  /**
* Returns true if the slot is visible on the page. This is used for refreshing
* lazy loaded ads.
* @funtion
* @returns {Boolean}
*/
  get isVisible() {
    return inViewport(this.videoNode, this.props.lazyOffset);
  }

  // Make the prebid API call.
  loadPlayer = adTagUrl => {
    if (this.unmounted) return;
    var options = {
      ...this.props.imaProps,
      id: this.props.id,
      adTagUrl: this.props.imaProps.adTagUrl || null,
    };

    this.player = window.videojs(this.videoNode, this.props.videoProps);
    this.player.ima(options);
  }

  refresh = () => {
    const pbjs = window.pbjs || {};
    pbjs.que = pbjs.que || [];
    pbjs.que.push(() => {
      const videoAdUnit = this.props.bidHandler(this.props.id, this.props.playerSize).prebid;
      pbjs.addAdUnits(videoAdUnit);

      window.pbjs.requestBids({
        bidsBackHandler: bids => {
          var adTagUrl = pbjs.adServers.dfp.buildVideoUrl({
            adUnit: videoAdUnit,
            params: {
              ...this.props.params,
            }
          });
          this.loadPlayer(adTagUrl);
        }
      });
    });
  };

  /**
* Event listener for lazy loaded ads that triggers the refresh function when
* the ad becomes visible.
* @function   
* @returns {void}
*/
  refreshWhenVisible() {
    if (this.props.lazy && this.isVisible) {
      this.props.loadVideoPlayer(this.refresh);
      window.removeEventListener('scroll', this.refreshWhenVisible);
    }
  }

  componentDidMount() {
    if (!this.props.lazy) this.props.loadVideoPlayer(this.refresh);
    else {
      this.refreshWhenVisible();
      window.addEventListener('scroll', this.refreshWhenVisible);
    }
  }

  // destroy player on unmount
  componentWillUnmount() {
    this.unmounted = true;
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div data-vjs-player>
        <video
          id={this.props.id}
          ref={node => this.videoNode = node}
          className="video-js"
        />
      </div>
    );
  }
}

VideoPlayer.defaultProps = {
  id: '',
  params: {},
  loadVideoPlayer: Promise.reject,
  imaProps: {
    adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=',
  },
  videoProps: {
    autoplay: true,
    controls: true,
    sources: [
      {
        src: 'http://techslides.com/demos/sample-videos/small.webm',
        type: 'video/webm'
      },
      {
        src: 'http://techslides.com/demos/sample-videos/small.ogv',
        type: 'video/ogv'
      },
      {
        src: 'http://techslides.com/demos/sample-videos/small.mp4',
        type: 'video/mp4'
      },
      {
        src: 'http://techslides.com/demos/sample-videos/small.3gp',
        type: 'video/3gp'
      },
    ],
  },
};

VideoPlayer.propTypes = {
  id: PropTypes.string,
  lazy: PropTypes.bool,
  lazyOffset: PropTypes.number,
  // https://support.google.com/admanager/answer/1068325?hl=en
  params: PropTypes.shape({
    // required
    env: PropTypes.string,
    gdfp_req: PropTypes.number,
    unviewed_position_start: PropTypes.number,
    // required variable
    output: PropTypes.oneOf(['vast', 'xml_vast3', 'vmap', 'xml_vmap1', 'xml_vast4']),
    iu: PropTypes.string,
    sz: PropTypes.string,
    description_url: PropTypes.string,
    url: PropTypes.string,
    correlator: PropTypes.number,
    // optional
    ad_rule: PropTypes.number,
    ciu_szs: PropTypes.string,
    cmsid: PropTypes.number,
    vid: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    // http://prebid.org/dev-docs/publisher-api-reference.html#pbjsadserversdfpbuildvideourloptions 
    cust_params: PropTypes.object,
    hl: PropTypes.string,
    msid: PropTypes.string,
    an: PropTypes.string,
    nofb: PropTypes.string,
    pp: PropTypes.string,
    ppid: PropTypes.number,
    rdid: PropTypes.string,
    idtype: PropTypes.string,
    is_lat: PropTypes.string,
    tfcd: PropTypes.string,
    npa: PropTypes.string,
    // ima props these are included by IMA by default do not use them.
    pod: PropTypes.number,
    ppos: PropTypes.number,
    vpos: PropTypes.oneOf(['preroll', 'midroll', 'postroll']),
    mridx: PropTypes.string,
    lip: PropTypes.boolean,
    min_ad_duration: PropTypes.number,
    max_ad_duration: PropTypes.number,
    pmnd: PropTypes.number,
    pmxd: PropTypes.number,
    pmad: PropTypes.number,
    // These parameters are specific to optimized pods, which are available to 
    // publishers with an advanced video package. They also should not be used 
    // for VMAP (when ad_rule=1). 
    vpmute: PropTypes.string,
    vpa: PropTypes.string,
    scor: PropTypes.number,
    vad_type: PropTypes.oneOf(['linear', 'nonlinear']),
    excl_cat: PropTypes.string,
  }),
  bidHandler: PropTypes.func,
  imaProps: PropTypes.shape({
    adTagUrl: PropTypes.string,
  }),
  videoProps: PropTypes.shape({
    autoplay: PropTypes.bool,
    controls: PropTypes.bool,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }),
  loadVideoPlayer: PropTypes.func.isRequired,
  playerSize: PropTypes.arrayOf(PropTypes.number),
};

export {
  VideoPlayer,
};

export default connect(AdsContext, ({ loadVideoPlayer }) => ({ loadVideoPlayer }))(VideoPlayer);
