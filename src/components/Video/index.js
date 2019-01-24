import React, { Component } from 'react';
import { VideoContext } from '../context';
import connect from '../../hoc/connector';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerLoaded: props.isReady,
    };
  }

  loadPlayer = () => {
    const { id, ...props } = this.props;

    var options = {
      id,
      adTagUrl: 'http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=',
    };

    this.player = window.videojs(this.videoNode, props);
    this.player.ima(options);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.playerLoaded === false && props.isReady === true) {
      return { playerLoaded: true };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.playerLoaded === false && this.props.isReady === true) {
      this.loadPlayer();
      console.log('player loaded');
    }
  }

  componentDidMount() {
    if (this.state.playerLoaded) {
      this.loadPlayer();      
    }
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
            id={this.props.id}
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

export {
  VideoPlayer,
};

export default connect(VideoContext, ({ isReady }) => ({ isReady }))(VideoPlayer);