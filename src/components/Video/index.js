import React, { Component } from 'react';

class VideoPlayer extends Component {

  loadScripts = (scripts, postFix = 'postfix') => {
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

        if (exists) return onLoad();

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

  loadCss = () => {
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

  loadPlayer = () => {
    return this.loadScripts(['//googleads.github.io/videojs-ima/node_modules/video.js/dist/video.min.js'], '-1')
      .then(() => this.loadScripts([
        '//imasdk.googleapis.com/js/sdkloader/ima3.js',
        '//googleads.github.io/videojs-ima/node_modules/videojs-contrib-ads/dist/videojs.ads.min.js',
        '//googleads.github.io/videojs-ima/dist/videojs.ima.js'
      ]), '-2').then(() => {
        return this.loadCss();
      });
  }

  componentDidMount() {
    var options = {
      id: 'content-video',
      adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=',
    };

    this.loadPlayer()
      .then(() => {
        this.player = window.videojs(this.videoNode, this.props);
        this.player.ima(options);
      });
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
            id="content-video"
            ref={node => this.videoNode = node}
            className="video-js"
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