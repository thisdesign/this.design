import { GRID_CONFIG } from 'components/Work/Coordinates'
import * as PIXI from 'pixi.js'

const GRID_MARGIN = 30
const ITEM_WIDTH = 215
const ITEM_HEIGHT = 450

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

function createCard(caseStudy, cardIndex) {
  const image = caseStudy.data.thumbnail.url
  const imageDimensions = caseStudy.data.thumbnail.dimensions

  const texture = PIXI.Texture.from(image)

  const point = GRID_CONFIG[cardIndex]
  const item = new PIXI.Container()
  item.position.x = (ITEM_WIDTH + GRID_MARGIN) * point[0] - ITEM_WIDTH / 2
  item.position.y = (ITEM_HEIGHT + GRID_MARGIN) * point[1] - ITEM_HEIGHT / 2
  const scale = imageDimensions.height / ITEM_HEIGHT
  let matrix = new PIXI.Matrix()
  matrix.scale(scale, scale)
  matrix.translate(-((imageDimensions.width * scale) / 2), 0)

  //create bg
  const bg = new PIXI.Graphics()
  bg.beginTextureFill({
    texture,
    matrix,
  })
  bg.drawRoundedRect(0, 0, ITEM_WIDTH, ITEM_HEIGHT, 20)
  bg.endFill()
  item.addChild(bg)

  return item
}

export function createCards(caseStudies) {
  const view = new PIXI.Container()
  for (var i = 0; i < caseStudies.length; i++) {
    const card = createCard(caseStudies[i], i)
    view.addChild(card)
  }
  return view
}
