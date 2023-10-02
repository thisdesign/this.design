import { gsap, InertiaPlugin, PixiPlugin } from 'gsap/all'
gsap.registerPlugin(InertiaPlugin)
gsap.registerPlugin(PixiPlugin)

import * as PIXI from 'pixi.js'
import Viewport from './Viewport'
import {
  createCards,
  ITEM_HEIGHT,
  ITEM_RATIO,
  ITEM_WIDTH,
  worldBounds,
} from './ViewportCards'
import emmiter from 'tiny-emitter/instance'
import CustomMouseMove from './CustomMouseMove'
import Overlay from './Overlay'

let app
let overlay

export function init() {
  app = new PIXI.Application({
    backgroundAlpha: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio,
    antialias: true,
  })
  app.view.style.width = '100vw'
  app.view.style.height = '100vh'
  return app
}

export function preload() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export function create(caseStudies, homepage) {
  const bounds = worldBounds(caseStudies.length)

  const viewport = Viewport.create(
    app.renderer,
    bounds.width,
    bounds.height,
    true
  )

  const center = {
    x: app.screen.width / 2,
    y: app.screen.height / 2,
  }

  app.stage.addChild(viewport)

  overlay = Overlay.create()
  app.stage.addChild(overlay)

  const cards = createCards(
    {
      image: homepage.image,
      video: homepage.video_reel_loop,
    },
    caseStudies
  )
  cards.position.x = bounds.width * 0.5
  cards.position.y = bounds.height * 0.5

  viewport.addChild(cards)

  // move to the right spot
  viewport.moveCenter(cards.position.x, cards.position.y)
  // viewport.fit(true)

  CustomMouseMove.enable()

  emmiter.on('card:click', function (caseStudy, position) {
    const header = caseStudy.data.header[0]
    if (header.image1?.url) {
      CustomMouseMove.disable()

      const config = {}
      config.image = header.image1?.url
      config.startX = center.x + position.x + ITEM_WIDTH / 2
      config.startY = center.y + position.y + ITEM_HEIGHT / 2
      config.startScale = ITEM_HEIGHT / header.image1.dimensions.height

      const AppRatio = app.screen.width / app.screen.height
      const ImageRatio =
        header.image1.dimensions.width / header.image1.dimensions.height

      if (ImageRatio < AppRatio) {
        config.endScale = app.screen.width / header.image1.dimensions.width
      } else {
        config.endScale = app.screen.height / header.image1.dimensions.height
      }

      Overlay.resize(app.screen.width, app.screen.height)
      Overlay.setConfig(config)
      Overlay.show()
      // Overlay.show()
    } else {
      // $el.style.backgroundColor = header.preload_background_color || '#ffffff'
    }
  })

  window.onresize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)
    viewport.resize(window.innerWidth, window.innerHeight)
  }
}

export function get() {
  return app
}

export function start() {
  update()
}

function update() {
  // const vp = Viewport.get()
  // if (vp.dirty) {
  //   //update animations
  //   app.renderer.render(vp)
  //   app.renderer.render(overlay)
  //   vp.dirty = false
  // }
  requestAnimationFrame(() => update())
}

export default {
  init,
  create,
  preload,
  get,
  start,
}
