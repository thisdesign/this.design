import 'styles/reset.css';
import 'styles/fonts.css';
import 'styles/typography.css';
import 'styles/layout.css';

import React from 'react';
import PreviewRouter from 'containers/PrismicApp/PreviewRouter/PreviewRouter';
import Loading from 'components/Loading/Loading';
import Homepage from 'containers/Homepage/Homepage';
import Nav from 'components/Nav/Nav';
import Work from 'components/Work/Work';
import View from 'components/View/View';
import CaseStudy from 'containers/CaseStudy/CaseStudy';
import About from 'containers/About/About';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.VIEW_CHANGE_DURATION = 600;
  }

  state = {
    caseStudyList: null,
    siteInfo: null,
    notFound: false,
    currentCaseStudy: null,
    isAnimatingToCs: false,
    scrolledPastCsCover: null,
  };

  componentDidMount() {
    this.setCaseStudy();
  }

  componentDidUpdate(prevProps) {
    const hasLoadedCtx = prevProps.prismicCtx !== this.props.prismicCtx;
    const isNewUid = (this.props.uid !== prevProps.uid) && this.props.uid !== undefined;

    if (hasLoadedCtx) {
      this.loadData();
      this.props.prismicCtx.toolbar();
    }
    if (isNewUid) { this.setCaseStudy(); }
  }

  setCaseStudy = () => {
    this.setState({ currentCaseStudy: this.props.uid });
  }

  setNotFound = () => {
    this.setState({ notFound: true });
  }

  openCaseStudy = () => {
    this.setState({
      isAnimatingToCs: true,
      scrolledPastCsCover: false,
    }, () => {
      setTimeout(() => {
        this.setState({ isAnimatingToCs: false });
      }, this.VIEW_CHANGE_DURATION);
    });
  }

  loadData = () => {
    this.loadCaseStudyList(this.props);
    this.loadSiteInfo(this.props);
  }

  loadCaseStudyList = (props = this.props) => {
    const fetchLinks = ['casestudy.title', 'casestudy.thumbnail', 'casestudy.svg'];

    props.prismicCtx.api.getByUID('context', 'home', { fetchLinks }).then((doc) => {
      if (doc) {
        this.setState({ caseStudyList: doc.data.case_study_list });
      } else {
        this.setState({ notFound: true });
      }
    });
  }

  loadSiteInfo = (props) => {
    props.prismicCtx.api.getSingle('site').then((doc) => {
      if (doc) {
        this.setState({ siteInfo: doc });
      } else {
        this.setState({
          notFound: !doc,
        });
      }
    });
  }

  updateCsScrollPos = (scrolledPastCsCover) => {
    this.setState({ scrolledPastCsCover });
  }

  render() {
    const {
      caseStudyList,
      siteInfo,
      currentCaseStudy,
      isAnimatingToCs,
      scrolledPastCsCover,
      notFound,
    } = this.state;
    const {
      openCaseStudy,
      updateCsScrollPos,
      setNotFound,
    } = this;

    const { view } = this.props;

    if (caseStudyList && siteInfo) {
      return (
        <React.Fragment>
          <Nav
            view={view}
            scrolledPastCsCover={scrolledPastCsCover}
            currentCaseStudy={currentCaseStudy}
          />
          <main className={`views -view-is-${view}`}>
            <View aside viewName="work" view={view}>
              <Work caseStudyList={caseStudyList} openCaseStudy={openCaseStudy} />
            </View>
            <View viewName="root" view={view}>
              {
                (!notFound && currentCaseStudy) ? (
                  <CaseStudy
                    prismicCtx={this.props.prismicCtx}
                    route={currentCaseStudy}
                    isAnimatingToCs={isAnimatingToCs}
                    updateCsScrollPos={updateCsScrollPos}
                    setNotFound={setNotFound}
                  />
                ) :
                  <Homepage data={siteInfo} notFound={notFound} />
              }
            </View>
            <View aside viewName="about" view={view} >
              <About prismicCtx={this.props.prismicCtx} />
            </View>
          </main>
        </React.Fragment>
      );
    }
    return (
      <PreviewRouter prismicCtx={this.props.prismicCtx}>
        <Loading />
      </PreviewRouter>);
  }
}

export default App;
