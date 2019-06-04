import React from 'react'
import PropTypes from 'prop-types'
import useCutoff from './hooks/useCutoff'
import Wrapper from './Wrapper'
import Styled from './Styled'
import getRatioPaddingPercent from './util/getRatioPaddingPercent'

function Iframe({ src, ratio, cutoff }) {
  const { ref, visible } = useCutoff(cutoff)
  const ratioPaddingPercent = getRatioPaddingPercent(ratio)

  return (
    <Styled.Wrapper ref={ref}>
      {visible ? (
        <Styled.RatioEnforcer ratio={ratioPaddingPercent || 16 / 9}>
          <Styled.Iframe src={src} title="iframe" />
        </Styled.RatioEnforcer>
      ) : (
        'asdf'
      )}
    </Styled.Wrapper>
  )
}

Iframe.defaultProps = {
  ratio: null,
  cutoff: null,
}

Iframe.propTypes = {
  src: PropTypes.string.isRequired,
  ratio: PropTypes.string,
  cutoff: PropTypes.number,
}

Iframe.Wrapper = Wrapper

export default Iframe
