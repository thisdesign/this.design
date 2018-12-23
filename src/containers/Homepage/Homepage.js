import React, { Component } from 'react';
import Loading from 'components/Loading/Loading';
import isMobile from 'util/isMobile';
import LayoutContext from 'containers/Layout/LayoutContext';
import PropTypes from 'prop-types';
import './Homepage.scss';

class Homepage extends Component {
  static contextType = LayoutContext;

  constructor(props) {
    super(props);
    this.video = React.createRef();
  }

  state = {
    videoLoaded: null,
  }

  componentDidMount() {
    if (this.video && this.video.current) {
      this.hideVideoLoad();
    }
  }

  hideVideoLoad = () => {
    this.setState({ videoLoaded: false }, () => {
      this.showVideoOnLoad();
    });
  }

  showVideoOnLoad = () => {
    this.video.current.onloadeddata = () => {
      this.setState({ videoLoaded: true });
    };
  }

  render() {
    const { siteInfo } = this.context;
    const urls = siteInfo.data[isMobile() ? 'video_group_mobile' : 'video_group'].map(vid => vid.link.url);
    const randomUrl = urls[Math.floor(Math.random() * urls.length)];
    const videoLoaded = this.state.videoLoaded !== false;

    const classes = [
      'homepage',
      this.props.openingFromHome ? '-isAnimating' : '',
    ].join(' ');

    return (
      <div className={classes}>
        {!videoLoaded && <Loading />}
        <div className="homepage__inner">
          <video autoPlay loop muted playsInline className="homepage__inner__video" ref={this.video}>
            <source src={randomUrl} type="video/mp4" />
          </video>
        </div>
      </div>
    );
  }
}

Homepage.defaultProps = {
  data: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
};

export default Homepage;
