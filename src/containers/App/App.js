import 'styles/reset.scss'
import 'styles/fonts.scss'
import 'styles/typography.scss'
import 'styles/layout.scss'

import React from 'react'
import PropTypes from 'prop-types'
import Layout from 'containers/Layout/Layout'

import getContextValue from './getContextValue'
import useSiteData from './useSiteData'
import './App.scss'

function App({ prismicCtx, uid, view }) {
  const { siteInfo, caseStudies, notFound, loaded, currentCs } = useSiteData({
    prismicCtx,
    uid,
  })

  if (loaded) {
    const appContext = getContextValue({ caseStudies, currentCs })
    return (
      <Layout
        notFound={notFound}
        {...appContext}
        {...{ siteInfo, view, prismicCtx }}
      />
    )
  }
  return null
}

App.defaultProps = {
  uid: null,
}

App.propTypes = {
  uid: PropTypes.string,
  view: PropTypes.string.isRequired,
  prismicCtx: PropTypes.object, //eslint-disable-line
}

export default React.memo(App)
