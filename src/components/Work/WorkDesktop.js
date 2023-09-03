import React, { useContext, useEffect, useRef } from 'react'
import ViewportApp from 'lib/ViewportApp'

import * as PIXI from 'pixi.js'
import { ApiDataCtx } from 'containers/App/App'
import { GRID_CONFIG } from './Coordinates'

export default function WorkDesktop({}) {
  const { contextCaseStudies } = useContext(ApiDataCtx)

  // ViewportApp.create(contextCaseStudies)

  // contextCaseStudies.forEach((caseStudy, i) => {
  //   const point = GRID_CONFIG[i]

  //   const item = new PIXI.Container()
  //   item.position.x = (ITEM_WIDTH + GRID_MARGIN) * point[0]
  //   item.position.y = (ITEM_HEIGHT + GRID_MARGIN) * point[1]

  //   //create bg
  //   const bg = new PIXI.Graphics()
  //   bg.beginFill(0xffffff)
  //   bg.drawRoundedRect(
  //     -ITEM_WIDTH * 0.5,
  //     -ITEM_HEIGHT * 0.5,
  //     ITEM_WIDTH,
  //     ITEM_HEIGHT,
  //     20
  //   )
  //   bg.endFill()
  //   item.addChild(bg)

  //   //add to stage
  //   app.stage.addChild(item)
  // })

  const el = useRef()
  useEffect(() => {
    const app = ViewportApp.init()
    el.current.appendChild(app.view)
    ViewportApp.create(contextCaseStudies)
    ViewportApp.start()
  }, [el])

  return <div ref={(r) => (el.current = r)}></div>
}
