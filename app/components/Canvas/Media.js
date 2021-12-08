import { Plane, Program, Mesh, Texture } from 'ogl'

import vertex from '../../shaders/vertex.glsl'
import fragment from '../../shaders/fragment.glsl'

import gsap from 'gsap'

export default class {
  constructor ({ element, index, scene, gl, sizes }) {
    this.gl = gl
    this.scene = scene
    this.element = element
    this.index = index
    this.sizes = sizes
    this.extra = {
      x: 0,
      y: 0
    }

    this.tl = gsap.timeline()
    this.createPlanes()
    this.createTexture()
    this.createProgram()
    this.createMesh()
    this.createBounds()
    this.onResize()
  }

  createPlanes () {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
  }

  createTexture () {
    this.texture = new Texture(this.gl)

    this.img = new window.Image()
    this.img.crossOrigin = 'anonymous'
    this.img.src = this.element.getAttribute('src')
    this.img.onload = () => (this.texture.image = this.img)
  }

  createProgram () {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: this.texture },
        uViewportSizes: { value: [this.sizes.width, this.sizes.height] },
        uOffset: { value: { x: 0, y: 0 } }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, { geometry: this.planeGeometry, program: this.program })
    this.mesh.setParent(this.scene)

    /* this.mesh.position.x += this.index * this.mesh.scale.x */
  }

  createBounds () {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()
  }

  updateScale () {
    this.mesh.scale.x = this.sizes.width * this.bounds.width / window.innerWidth
    this.mesh.scale.y = this.sizes.height * this.bounds.height / window.innerHeight
  }

  updateX (x = 0) {
    this.mesh.position.x = -(this.sizes.width / 2) + (this.mesh.scale.x / 2) + ((this.bounds.left - x) / window.innerWidth) * this.sizes.width + this.extra.x
  }

  updateY (y = 0) {
    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - ((this.bounds.top - y) / window.innerHeight) * this.sizes.height + this.extra.y
  }

  update (scroll, speed) {
    this.updateScale()

    this.updateX(scroll.current)
    /*     this.updateY(scroll.x) */

    this.program.uniforms.uOffset.value = (scroll.current - scroll.target) * 0.8
  }

  onResize (sizes) {
    this.createBounds(sizes)
  }
}
// TODO: ADD THE ONWHEEL FUNCTION HERE AND TEST. IF NOT WORKING, DELETE EVERYTHING AND TRY AGAIN.

// TODO: Implement own scroll method and onWheel funcition on this page.
