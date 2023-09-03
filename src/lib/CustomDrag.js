import { gsap, InertiaPlugin, VelocityTracker, PixiPlugin } from 'gsap/all'
gsap.registerPlugin(InertiaPlugin)

let xTo, yTo

export function createDrag(viewport) {
  xTo = gsap.quickTo(viewport.position, 'x', { duration: 0.6, ease: 'power3' })
  yTo = gsap.quickTo(viewport.position, 'y', { duration: 0.6, ease: 'power3' })

  viewport = viewport
  viewport
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove)

  VelocityTracker.track(viewport.position, 'x,y')
}

function onDragStart(event) {
  if (this.tween) {
    this.tween.kill()
  }

  this.data = event.data
  this.lastPosition = this.data.getLocalPosition(this.parent)
}

function onDragMove(event) {
  if (this.lastPosition) {
    var newPosition = this.data.getLocalPosition(this.parent)

    this.position.x += newPosition.x - this.lastPosition.x
    this.position.y += newPosition.y - this.lastPosition.y

    this.lastPosition = newPosition
  }
}
function onDragEnd(event) {
  this.data = null
  this.lastPosition = null

  const vX = VelocityTracker.getByTarget(this.position).get('x') * 0.5
  const vY = VelocityTracker.getByTarget(this.position).get('y') * 0.5

  this.tween = gsap.to(this.position, {
    inertia: {
      duration: { min: 3, max: 4 },
      x: {
        resistance: 500,
        velocity: vX,
        min: this.screenWidth - this.width,
        max: 0,
      },
      y: {
        velocity: vY,
        resistance: 500,
        min: this.screenHeight - this.height,
        max: 0,
      },
    },
    onComplete: () => {
      this.tween = null
    },
  })
}

export default {
  createDrag,
}
