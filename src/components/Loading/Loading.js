import React from 'react'
import './Loading.scss'

export default function Loading({ hasBg = true }) {
  return (
    <div className={`loader ${hasBg ? 'has-background' : 'no-background'}`}>
      <img
        className={`loader__icon ${hasBg ? 'no-background' : 'has-background'}`}
        src="https://prismic-io.s3.amazonaws.com/thisstaging%2F802faa64-bf5a-4db5-9d56-47f802a0980c_thisloader.gif"
        alt="loading"
      />
    </div>
  )
}
