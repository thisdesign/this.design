import { gsap, InertiaPlugin, PixiPlugin } from 'gsap/all'
gsap.registerPlugin(InertiaPlugin)
gsap.registerPlugin(PixiPlugin)

import * as PIXI from 'pixi.js'
import Viewport from './Viewport'
import { createCards, worldBounds } from './ViewportCards'
import CustomMouseMove from './CustomMouseMove'

let app

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

export function create(caseStudies) {
  const bounds = worldBounds(caseStudies.length)

  const viewport = Viewport.create(
    app.renderer,
    bounds.width,
    bounds.height,
    true
  )

  app.stage.addChild(viewport)

  const cards = createCards(caseStudies)
  cards.position.x = bounds.width * 0.5
  cards.position.y = bounds.height * 0.5

  viewport.addChild(cards)

  // move to the right spot
  viewport.moveCenter(cards.position.x, cards.position.y)
  // viewport.fit(true)

  CustomMouseMove.enable()

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
  const vp = Viewport.get()
  if (vp.dirty) {
    //update animations
    app.renderer.render(vp)
    vp.dirty = false
  }
  requestAnimationFrame(() => update())
}

export default {
  init,
  create,
  get,
  start,
}
