import { Camera, Renderer, Transform } from 'ogl'

import Home from './Home'

export default class {
  constructor ({ url }) {
    this.url = url

    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2)
    })

    this.gl = this.renderer.gl
    this.gl.clearColor(0.165, 0.165, 0.141, 1)

    document.body.appendChild(this.gl.canvas)

    this.createCamera()
    this.createScene()
    this.onResize()
    this.createHome()
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()
  }

  createHome () {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  /**
   * Change.
   */
  onChange (url) {

  }

  /**
   * Resize.
   */
  onResize () {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.sizes = {
      height,
      width
    }

    if (this.home) {
      this.home.onResize({
        sizes: this.sizes
      })
    }

    const values = {
      screen: this.screen,
      viewport: this.sizes
    }
  }

  onWheel (event) {
    if (this.home) {
      this.home.onWheel(event)
    }
  }

  /**
   * Update.
   */

  update () {
    if (this.home) {
      this.home.update()
    }

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }
}
