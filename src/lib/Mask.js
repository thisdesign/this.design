import { Graphics } from 'pixi.js'
import { ITEM_HEIGHT, ITEM_WIDTH } from './ViewportCards'
import gsap from 'gsap'

let mask

let config = {
  width: ITEM_WIDTH,
  height: ITEM_HEIGHT,
  radius: 8,
}

export function create() {
  mask = new Graphics()
  draw()
  return mask
}

function draw() {
  mask.clear()
  mask.beginFill(0x00ff00)
  mask.drawRoundedRect(
    -config.width / 2,
    -config.height / 2,
    config.width,
    config.height,
    config.radius
  )
  mask.endFill()
}

export function get() {
  return mask
}

export function animate(options) {
  gsap.to(config, {
    ...options,
    onUpdate: draw,
  })
}

export default {
  create,
  get,
  animate,
}
