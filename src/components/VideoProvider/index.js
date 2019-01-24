import React from 'react';
import { VideoContext } from '../context';

class VideoProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }

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
    this.loadPlayer().then(() => this.setState({ isReady: true }));
  }

  render() {
    return (
      <VideoContext.Provider
        value={{ isReady: this.state.isReady }}
      >
        {this.props.children}
      </VideoContext.Provider>
    );
  }
}

export default VideoProvider;
