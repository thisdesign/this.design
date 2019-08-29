import React, { createContext } from 'react'
import { useData } from 'structure/DataProvider'
import CaseStudyHero from './CaseStudyHero'
// import PropTypes from 'prop-types'

export const CaseStudyCtx = createContext()

const CaseStudy = ({ uid }) => {
  const { allCaseStudies } = useData()
  const csData = allCaseStudies.filter(item => item.uid === uid)[0]

  return (
    <CaseStudyCtx.Provider value={csData}>
      <CaseStudyHero />
      <div>CONTENT HERE!!!!!!!!!!!!</div>
    </CaseStudyCtx.Provider>
  )
}
// CaseStudy.propTypes = {}

export default CaseStudy
