import React, { Component } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';

class VideoPlayer extends Component {
  constructor() {
    super();
    this.adTag = 'http://demo.tremorvideo.com/proddev/vast/vast2VPAIDLinear.xml';
  }

  componentDidMount() {
    window.videojs = videojs;
    require('videojs-vast-vpaid/dist/videojs_5.vast.vpaid');
    
    const props = {
      ...this.props,
      adTag: this.adTag,
      adCancelTimeout: 5000,
      adsEnabled: true,
      playAdAlways: true,
    };

    this.player = videojs(this.videoNode, props);
    console.log(this.player);
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div>
        <div data-vjs-player>
          <video
            ref={node => this.videoNode = node}
            className="video-js"
            data-setup='{
              "plugins": {
              "vastClient": {
                "adTag": "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpreonly&cmsid=496&vid=short_onecue&correlator=",
                "adCancelTimeout": 5000,
                "adsEnabled": true
                }
              }
            }'
          />
        </div>
      </div>
    );
  }
}

VideoPlayer.defaultProps = {
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
  ]
};

export default VideoPlayer;