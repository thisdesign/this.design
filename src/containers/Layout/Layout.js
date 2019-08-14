import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components/macro'
import Nav from 'components/Nav/Nav'
import Work from 'components/Work/Work'
import Head from 'components/Head'
import View from 'components/View/View'
import About from 'containers/About/About'
import Root from 'containers/Root/Root'
import CursorDotProvider from 'components/CursorDot/CursorDotProvider'
import theme from 'styles/theme'
import GlobalStyle from 'styles/GlobalStyle'
import useWindowSize from 'hooks/useWindowSize'
import useRouterData from './useRouterData'
import useNavInvert from './useNavInvert'
import useProjectLaunch from './useProjectLaunch'

export const LayoutContext = React.createContext()

function Layout({ view, pathUid }) {
  const csState = useRouterData({ pathUid })

  const { revertNav, invertNav, navInverted } = useNavInvert()
  const { launchProject, projectLaunchStatus } = useProjectLaunch({
    currentUid: csState.currentUid,
  })

  document.documentElement.style.setProperty(
    '--windowHeight',
    `${useWindowSize().height}px`
  )

  return (
    <CursorDotProvider>
      <ThemeProvider theme={theme}>
        <LayoutContext.Provider
          value={{
            ...{ view },
            ...{ csState: { ...csState } },
            launchProject,
            navInverted,
            invertNav,
            revertNav,
          }}
        >
          <GlobalStyle />
          <AppMeta />
          <Nav />
          <main className={`views -view-is-${view}`}>
            <View aside viewName="work" view={view}>
              <Work />
            </View>
            <View viewName="root" view={view}>
              <Root {...{ projectLaunchStatus }} />
            </View>
            <View aside viewName="about" view={view}>
              <About />
            </View>
          </main>
        </LayoutContext.Provider>
      </ThemeProvider>
    </CursorDotProvider>
  )
}

function AppMeta() {
  const { view } = useContext(LayoutContext)
  if (view === 'about') {
    return <Head title="About" path="/about" />
  }
  if (view === 'about') {
    return <Head title="About" path="/work" />
  }
  return <Head path="/" />
}

Layout.defaultProps = {
  pathUid: null,
}

Layout.propTypes = {
  view: PropTypes.string.isRequired,
  pathUid: PropTypes.string,
}

export default Layout
