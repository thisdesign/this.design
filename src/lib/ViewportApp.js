import { gsap, InertiaPlugin, PixiPlugin } from 'gsap/all'
gsap.registerPlugin(InertiaPlugin)
gsap.registerPlugin(PixiPlugin)
import emmiter from 'tiny-emitter/instance'

import * as PIXI from 'pixi.js'
import Viewport from './Viewport'
import {
  createCards,
  ITEM_HEIGHT,
  ITEM_RATIO,
  ITEM_WIDTH,
  worldBounds,
} from './ViewportCards'
import CustomMouseMove from './CustomMouseMove'
import Mask from './Mask'

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

  overlay = new PIXI.Container()
  overlay.alpha = 0

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

      const image = PIXI.Sprite.from(header.image1.url)
      image.anchor.set(0.5)

      const config = {
        startScale: ITEM_HEIGHT / header.image1.dimensions.height,
      }

      const AppRatio = app.screen.width / app.screen.height
      const ImageRatio =
        header.image1.dimensions.width / header.image1.dimensions.height
      // const Multiplier =
      //   AppRatio < ITEM_RATIO
      //     ? ITEM_WIDTH / app.screen.width
      //     : ITEM_HEIGHT / app.screen.height

      if (ImageRatio < AppRatio) {
        const scale = app.screen.width / header.image1.dimensions.width
        config.endScale = scale
      } else {
        const scale = app.screen.height / header.image1.dimensions.height
        config.endScale = scale
      }

      overlay.x = center.x + position.x + ITEM_WIDTH / 2
      overlay.y = center.y + position.y + ITEM_HEIGHT / 2

      image.scale.x = image.scale.y = config.startScale

      const mask = Mask.create()
      Mask.animate({
        duration: 1,
        ease: 'expo.inOut',
        width: app.screen.width,
        height: app.screen.height,
        radius: 0,
        delay: 0.3,
      })
      image.mask = mask

      overlay.addChild(image)
      overlay.addChild(mask)

      gsap.to(overlay, {
        duration: 0.3,
        ease: 'expo.inOut',
        alpha: 1,
      })

      gsap.to(overlay, {
        duration: 1,
        ease: 'expo.inOut',
        x: center.x,
        y: center.y,
        delay: 0.3,
      })

      gsap.to(image.scale, {
        duration: 1,
        ease: 'expo.inOut',
        x: config.endScale,
        y: config.endScale,
        delay: 0.3,
      })
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
