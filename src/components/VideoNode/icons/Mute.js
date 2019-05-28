import React from 'react'

export default function Mute() {
  return (
    <svg
      className="videoNode__muteToggle__icon"
      viewBox="0 0 26 19"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="videoNode__muteToggle__icon__speaker"
        d="M14 5.16129282V18.25c0 .4142136-.3357864.75-.75.75-.1437982 0-.2845652-.0413389-.4055299-.1190915L5 13.8387072H.75c-.41421356 0-.75-.3357865-.75-.75V5.91129282c0-.41421356.33578644-.75.75-.75H5L12.8444701.11909155C12.9654348.04133889 13.1062018 0 13.25 0c.4142136 0 .75.33578644.75.75v4.41129282z"
      />
      <path
        className="videoNode__muteToggle__icon__line videoNode__muteToggle__icon__line--muted"
        d="M18 13l7-7M18 6l7 7"
      />
      <path
        className="videoNode__muteToggle__icon__line videoNode__muteToggle__icon__line--unmuted"
        d="M18.5107505 15C20.5847595 13.9847251 22 11.9529342 22 9.61203513 22 7.08360315 20.3489227 4.91578937 18 4"
      />
    </svg>
  )
}
