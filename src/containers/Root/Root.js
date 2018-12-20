import React from 'react';
import Homepage from 'containers/Homepage/Homepage';
import { withRouter } from 'react-router-dom';
import Loading from 'components/Loading/Loading';
import CaseStudyQueue from 'containers/CaseStudyQueue/CaseStudyQueue';
import PropTypes from 'prop-types';


const CaseStudiesWithLag = ({ projectLaunchStatus }) => (
  <React.Fragment>
    {projectLaunchStatus !== 'ready' && <Loading />}
    {projectLaunchStatus !== 'transitioning' && <CaseStudyQueue />}
  </React.Fragment>
);

const NextButton = ({ handleOpen }) => {
  const style = { background: 'red', position: 'fixed', zIndex: 500 };
  return (
    <div style={style} onClick={handleOpen}> NEXT </div>
  );
};


class Root extends React.Component {
  handleOpen = () => {
    setTimeout(() => {
      this.props.history.push('/work/lora');
    }, 600);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.isHome &&
          <React.Fragment>
            <NextButton handleOpen={this.handleOpen} />
            <Homepage />
          </React.Fragment>}
        <CaseStudiesWithLag projectLaunchStatus={this.props.projectLaunchStatus} />;
      </React.Fragment>
    );
  }
}


Root.propTypes = {
  isHome: PropTypes.bool.isRequired,
  projectLaunchStatus: PropTypes.string.isRequired,
};
export default withRouter(Root);
