import React, { useContext, useEffect, useRef } from 'react'
import ViewportApp from 'lib/ViewportApp'
import { ApiDataCtx } from 'containers/App/App'
import emmiter from 'tiny-emitter/instance'

export default function WorkDesktop({ setShowModal }) {
  emmiter.on('video:click', function (video, position) {
    setShowModal(true)
  })

  const { contextCaseStudies, home } = useContext(ApiDataCtx)
  const el = useRef()
  useEffect(() => {
    const app = ViewportApp.init()
    el.current.appendChild(app.view)
    ViewportApp.create(contextCaseStudies, home)
    ViewportApp.start()
  }, [el])

  return (
    <div>
      <div ref={(r) => (el.current = r)}></div>
    </div>
  )
}
