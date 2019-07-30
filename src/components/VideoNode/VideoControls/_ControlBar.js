import React from 'react'
import MuteControl from '../MuteControl/MuteControl'
import { VideoContext } from '../VideoNode'
import Duration from './_Duration'

const ControlBar = () => {
  const Item = ({ id, children, onClick }) => (
    <div
      className={`videoNode__controls__control videoNode__controls__control--${id}`}
      onClick={onClick}
    >
      {children}
    </div>
  )

  const DurationIndicator = ({ playedSeconds, duration }) => (
    <Item id="duration">
      <span>
        <Duration seconds={playedSeconds} />
      </span>
      <span className="-spacer" />
      <span>
        <Duration seconds={duration} />
      </span>
    </Item>
  )

  const MuteToggle = () => (
    <Item id="muteToggle">
      <MuteControl />
    </Item>
  )

  const FullScreen = ({ onClickFullScreen }) => (
    <Item id="fullscreen" onClick={onClickFullScreen}>
      <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#FFF" strokeWidth="1.5" fill="none">
          <path d="M1 8V1h7M13 6v7H6" />
        </g>
      </svg>
    </Item>
  )

  return (
    <div className="videoNode__controls__controlInner">
      <VideoContext.Consumer>
        {({ onClickFullScreen, playedSeconds, duration }) => (
          <>
            <DurationIndicator
              playedSeconds={playedSeconds}
              duration={duration}
            />
            <MuteToggle />
            <FullScreen onClickFullScreen={onClickFullScreen} />
          </>
        )}
      </VideoContext.Consumer>
    </div>
  )
}

export default ControlBar
