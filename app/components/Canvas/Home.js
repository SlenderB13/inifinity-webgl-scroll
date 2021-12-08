import { Transform } from 'ogl'

import Media from './Media'

import { map } from 'lodash'

import GSAP from 'gsap'

export default class {
  constructor ({ gl, scene, sizes }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0
    }

    this.group = new Transform()
    this.group.setParent(this.scene)

    this.mediaElements = document.querySelectorAll('.home__gallery__media__image')
    this.galleryElement = document.querySelector('.home__gallery')

    this.createGallery()
  }

  createGallery () {
    this.medias = map(this.mediaElements, (element, index) => {
      return new Media({
        element,
        index,
        scene: this.group,
        gl: this.gl,
        sizes: this.sizes
      })
    })
  }

  /*
  * Events
  */

  onWheel ({ pixelY }) {
    this.scroll.target += pixelY
  }

  onResize (event) {
    map(this.medias, media => media.onResize(event))

    this.galleryBounds = this.galleryElement.getBoundingClientRect()
  }

  /*
  * Update
  */
  update () {
    if (!this.galleryBounds) return

    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'left'
    } else if (this.scroll.current < this.scroll.last) {
      this.direction = 'right'
    }

    this.scroll.last = this.scroll.current

    this.galleryHeight = this.galleryBounds.height / window.innerHeight * this.sizes.height
    this.galleryWidth = this.galleryBounds.width / window.innerWidth * this.sizes.width

    map(this.medias, (media, index) => {
      const rightY = media.mesh.position.x + media.mesh.scale.x / 2
      const leftY = media.mesh.position.x - media.mesh.scale.x / 2

      if (this.direction === 'left' && rightY < -this.sizes.height) {
        media.extra.x += this.galleryWidth
      } else if (this.direction === 'right' && leftY > this.sizes.height) {
        media.extra.x -= this.galleryWidth
      }

      media.update(this.scroll, this.speed)
    })
  }
}
