import styled, { css } from 'styled-components/macro'

const View = styled.div`
  left: 0;
  top: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  position: fixed;
  max-height: 100%;
  height: 100%;
  transition: transform 600ms cubic-bezier(0, 0, 0.2, 1);
  will-change: transform;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  z-index: ${props => (props.aside ? 10 : 20)};
  background-color: ${props =>
    (props.viewName === 'about' && 'black') ||
    (props.viewName === 'work' && 'white')};

  transform: translate3d(
    ${({ activeView, viewName }) => {
      if (activeView === 'about' && viewName === 'about') return '0'
      if (activeView === 'about' && viewName === 'work') return '-100%'
      if (activeView === 'about' && viewName === 'root') return '-100%'

      if (activeView === 'work' && viewName === 'about') return '100%'
      if (activeView === 'work' && viewName === 'work') return '0'
      if (activeView === 'work' && viewName === 'root') return '100%'

      if (activeView === 'root' && viewName === 'about') return '100%'
      if (activeView === 'root' && viewName === 'work') return '-100%'
      if (activeView === 'root' && viewName === 'root') return '0'
      return null
    }},
    0,
    0
  );

  ${props =>
    !props.isActive &&
    css`
      pointer-events: none;
      overflow: hidden;
    `}

  .view__child {
    opacity: ${props => (props.isActive ? 1 : 0)};
    transition: opacity 600ms cubic-bezier(0, 0, 0.2, 1);
    will-change: opacity;
  }
`

export default { View }
