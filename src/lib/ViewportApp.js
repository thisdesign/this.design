import * as PIXI from 'pixi.js'
import Viewport from './Viewport'
import { createCards, worldBounds } from './ViewportCards'

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

  const line = viewport.addChild(new PIXI.Graphics())
  line
    .lineStyle(10, 0xff0000)
    .drawRect(0, 0, viewport.worldWidth, viewport.worldHeight)

  // move to the right spot
  viewport.moveCenter(viewport.worldWidth / 2, viewport.worldHeight / 2)
  // viewport.fit(true)

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
