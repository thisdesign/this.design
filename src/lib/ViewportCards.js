import { GRID_CONFIG } from 'components/Work/Coordinates'
import gsap from 'gsap/all'
import * as PIXI from 'pixi.js'
import emitter from 'tiny-emitter/instance'
import Viewport from './Viewport'

import PlaySvg from './../components/Work/Play.svg'
import { asText } from 'util/helpers'

export const GRID_MARGIN = 30
export const ITEM_WIDTH = 215
export const ITEM_HEIGHT = 450
export const ITEM_RATIO = ITEM_WIDTH / ITEM_HEIGHT

export function worldBounds(cardCount) {
  const coords = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  for (let i = 0; i < cardCount + 1; i++) {
    const point = GRID_CONFIG[i]
    if (point[0] < coords.minX) coords.minX = point[0]
    if (point[0] > coords.maxX) coords.maxX = point[0]
    if (point[1] < coords.minY) coords.minY = point[1]
    if (point[1] > coords.maxY) coords.maxY = point[1]
  }
  const width =
    (Math.abs(coords.minX) + Math.abs(coords.maxX)) *
      (ITEM_WIDTH + GRID_MARGIN) +
    ITEM_WIDTH
  const height =
    (Math.abs(coords.minY) + Math.abs(coords.maxY)) *
      (ITEM_HEIGHT + GRID_MARGIN) +
    ITEM_HEIGHT / 2
  return { width, height }
}

function createVideoCard(video) {
  let texture = PIXI.Texture.from(video.video.url)
  texture.baseTexture.resource.source.loop = true
  texture.baseTexture.resource.source.muted = true

  const button = PIXI.Sprite.from(PlaySvg)
  button.anchor.set(0.5)
  button.position.x = ITEM_WIDTH / 2
  button.position.y = ITEM_HEIGHT / 2

  const scale = ITEM_HEIGHT / 1920
  const translateX = (1080 * scale - ITEM_WIDTH) * 0.5
  let matrix = new PIXI.Matrix()
  matrix.scale(scale, scale)
  matrix.translate(-translateX, 0)

  const item = new PIXI.Container()
  const bgImage = new PIXI.Graphics()
  bgImage.beginTextureFill({
    texture,
    matrix,
  })
  bgImage.drawRoundedRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT, 8)
  bgImage.endFill()

  item.position.x = ITEM_WIDTH * -0.5
  item.position.y = ITEM_HEIGHT * -0.5

  item.addChild(bgImage)
  item.addChild(button)

  item.eventMode = 'static'
  item.cursor = 'pointer'

  item.on('click', function (e) {
    emitter.emit('video:click', video, item.position)
  })

  return item
}

function createCard(caseStudy, cardIndex) {
  const header = caseStudy.data.header?.[0]?.image1
  const thumbnail = caseStudy.data.thumbnail
  const image = header?.url ? header : thumbnail

  const imageUrl = image.url
  const imageDimensions = image.dimensions

  const texture = PIXI.Texture.from(imageUrl)

  const scale = ITEM_HEIGHT / imageDimensions.height
  const translateX = (imageDimensions.width * scale - ITEM_WIDTH) * 0.5
  let matrix = new PIXI.Matrix()
  matrix.scale(scale, scale)
  matrix.translate(-translateX, 0)

  const point = GRID_CONFIG[cardIndex + 1]
  const item = new PIXI.Container()
  item.position.x = (ITEM_WIDTH + GRID_MARGIN) * point[0] - ITEM_WIDTH / 2
  item.position.y = (ITEM_HEIGHT + GRID_MARGIN) * point[1] - ITEM_HEIGHT / 2

  //create bg
  const bgImage = new PIXI.Graphics()
  bgImage.beginTextureFill({
    texture,
    matrix,
  })
  bgImage.drawRoundedRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT, 8)
  bgImage.endFill()
  item.addChild(bgImage)

  // create overlay
  const overlay = new PIXI.Container()
  overlay.alpha = 0

  //create bg
  const bgOverlay = new PIXI.Graphics()
  bgOverlay.beginFill(0x000000)
  bgOverlay.drawRoundedRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT, 8)
  bgOverlay.endFill()
  bgOverlay.alpha = 0.2
  overlay.addChild(bgOverlay)

  // create logo
  const logo = PIXI.Sprite.from(caseStudy.data.svg.url)
  logo.position.y = ITEM_WIDTH / 2 + 80
  logo.position.x = 20
  logo.scale.x = 80 / caseStudy.data.svg.dimensions.width
  logo.scale.y = logo.scale.x
  overlay.addChild(logo)

  // create title
  const tagline = asText(caseStudy.data.header[0].copy)
  const taglineText = new PIXI.Text(tagline, {
    fontFamily: 'calibre-light',
    fontSize: 20,
    fill: 0xffffff,
    align: 'left',
    wordWrap: true,
    wordWrapWidth: ITEM_WIDTH - 40,
  })
  taglineText.x = 20
  taglineText.y = ITEM_HEIGHT - taglineText.height - 80
  overlay.addChild(taglineText)

  // create work text
  const workText = new PIXI.Text('VIEW WORK', {
    fontFamily: 'calibre-light',
    fontSize: 12,
    fill: 0xffffff,
    align: 'left',
  })
  workText.x = 20
  workText.y = ITEM_HEIGHT - 60
  overlay.addChild(workText)

  item.addChild(overlay)

  item.eventMode = 'static'
  item.cursor = 'pointer'

  item.on('mouseover', function (e) {
    gsap.to(overlay, {
      alpha: 1,
      duration: 0.5,
      overwrite: true,
    })
  })
  item.on('mouseout', function (e) {
    gsap.to(overlay, {
      alpha: 0,
      duration: 0.3,
      overwrite: true,
    })
  })
  item.on('click', function (e) {
    const viewport = Viewport.get()
    if (!viewport.disableClick) {
      const position = {
        x: item.position.x - (viewport.center.x - viewport.worldWidth / 2),
        y: item.position.y - (viewport.center.y - viewport.worldHeight / 2),
      }
      emitter.emit('card:click', caseStudy, position)
    }
  })

  return item
}

export function createCards(video, caseStudies) {
  const view = new PIXI.Container()
  for (var i = 0; i < caseStudies.length; i++) {
    const card = createCard(caseStudies[i], i)
    view.addChild(card)
  }
  view.addChild(createVideoCard(video))
  return view
}
