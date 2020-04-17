/*
 * @Author: 王嘉炀
 * @Date: 2020-04-04 15:09:23
 */
import * as THREE from 'three'

class FrameRender {
  constructor (el, options = {}) {
    this.webglFrame = el
    this.options = this.initOptions(options)
    this.uvs = this.calcuUVS()
    this.renderer = this.initRender()
    this.webglFrame.append(this.renderer.domElement)

    this.camera = this.initCamera()
    this.scene = this.initScene()
    // this.initLight()
    this.initModel()
  }

  initOptions (options) {
    const defaultOptions = {
      splitX: 4,
      splitY: 4,
      startIndex: 2,
      video: null
    }
    return {
      ...defaultOptions,
      ...options
    }
  }

  initRender () {
    console.log(this.webglFrame.clientWidth)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(this.webglFrame.clientWidth, this.webglFrame.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0xeeeeee)
    return renderer
    // renderer.shadowMap.enabled = true
    // 告诉渲染器需要阴影效果
    // document.body.appendChild(renderer.domElement);
  }

  initCamera () {
    const camera = new THREE.PerspectiveCamera(45, this.webglFrame.clientWidth / this.webglFrame.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 10.8)
    return camera
  }

  initScene () {
    const scene = new THREE.Scene()
    return scene
  }

  initModel () {
    // const videoTexture = new THREE.VideoTexture(mvp.playerObj.video)
    const { splitX, splitY, video, startIndex } = this.options
    const stepX = 1 / splitX
    const stepY = 1 / splitY
    const indexX = this.uvs[startIndex][0]
    const indexY = this.uvs[startIndex][1]
    const geometry = new THREE.PlaneGeometry(16, 9)
    console.log(geometry)
    // geometry.faceVertexUvs[0][0]= [new THREE.Vector2(0,0.5), new THREE.Vector2(0,0.25), new THREE.Vector2(0.25,0.5)]
    // geometry.faceVertexUvs[0][1]= [new THREE.Vector2(0,0.25), new THREE.Vector2(0.25,0.25), new THREE.Vector2(0.25,0.5)]
    geometry.faceVertexUvs[0][0] = [new THREE.Vector2(indexX * stepX, (indexY + 1) * stepY), new THREE.Vector2(indexX * stepX, indexY * stepY), new THREE.Vector2((indexX + 1) * stepX, (indexY + 1) * stepY)]
    geometry.faceVertexUvs[0][1] = [new THREE.Vector2(indexX * stepX, indexY * stepY), new THREE.Vector2((indexX + 1) * stepX, indexY * stepY), new THREE.Vector2((indexX + 1) * stepX, (indexY + 1) * stepY)]
    // 通过video对象实例化纹理
    // video.crossOrigin = "Anonymous"
    var texture = new THREE.VideoTexture(video)
    // texture.setCrossOrigin( "Anonymous" );
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    texture.matrixAutoUpdate = false // 设置纹理属性matrixAutoUpdate为false以后，纹理将通过matrix属性设置的矩阵更新纹理显示
    // material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping; //设置为可循环
    texture.minFilter = THREE.LinearFilter
    const material = new THREE.MeshBasicMaterial({ map: texture })
    // material.map.matrix.identity()
    //   .scale( 0.25, 0.25 ) //缩放
    //   .translate( 0.75, 0.75 ) //设置中心点
    this.geometry = geometry
    this.scene.add(new THREE.Mesh(geometry, material))
  }

  // 窗口变动触发的函数
  onWindowResize () {
    this.camera.aspect = this.webglFrame.clientWidth / this.webglFrame.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.webglFrame.clientWidth, this.webglFrame.clientHeight)
  }

  calcuUVS () {
    const { splitX, splitY } = this.options
    const uvs = []
    for (let y = splitY - 1; y >= 0; y--) {
      for (let x = 0; x < splitX; x++) {
        uvs.push([x, y])
      }
    }
    return uvs
  }

  bindTouch () {
    const { webglFrame, geometry, uvs } = this

    const { splitX, splitY, startIndex } = this.options
    const stepX = 1 / splitX
    const stepY = 1 / splitY

    let index = startIndex
    let absf = 1
    let startX = 0
    webglFrame.querySelector('canvas').addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX
    })
    webglFrame.querySelector('canvas').addEventListener('touchend', function (e) {
      startX = 0
    })
    webglFrame.querySelector('canvas').addEventListener('touchmove', function (e) {
      console.log(e.touches[0].clientX)
      // var w = distancex<0?distancex*-1:distancex;
      // var h = distancey<0?distancey*-1:distancey;
      // if (w<h) {e.preventDefault(); }
      var disx = e.touches[0].clientX - startX
      if (Math.abs(disx) < 40) {
        return
      }
      if (disx > 0) { absf = 1 } else if (disx < 0) { absf = -1 }
      startX = e.touches[0].clientX
      index += absf
      if (index > 15) {
        index = 15
        return
      } else if (index < 0) {
        index = 0
        return
      }
      const indexX = uvs[index][0]
      const indexY = uvs[index][1]
      geometry.faceVertexUvs[0][0][0].x = indexX * stepX
      geometry.faceVertexUvs[0][0][0].y = (indexY + 1) * stepY
      geometry.faceVertexUvs[0][0][1].x = indexX * stepX
      geometry.faceVertexUvs[0][0][1].y = indexY * stepY
      geometry.faceVertexUvs[0][0][2].x = (indexX + 1) * stepX
      geometry.faceVertexUvs[0][0][2].y = (indexY + 1) * stepY
      geometry.faceVertexUvs[0][1][0].x = indexX * stepX
      geometry.faceVertexUvs[0][1][0].y = indexY * stepY
      geometry.faceVertexUvs[0][1][1].x = (indexX + 1) * stepX
      geometry.faceVertexUvs[0][1][1].y = indexY * stepY
      geometry.faceVertexUvs[0][1][2].x = (indexX + 1) * stepX
      geometry.faceVertexUvs[0][1][2].y = (indexY + 1) * stepY
      geometry.uvsNeedUpdate = true
    }, false)
  }

  draw () {
    this.camera.updateProjectionMatrix()
    // controls.update();
    this.renderer.render(this.scene, this.camera)

    this.requestAnimationFrame = requestAnimationFrame(() => {
      this.draw()
    })
  }

  render () {
    this.draw()
    this.bindTouch()
    // resize 事件
    window.addEventListener('resize', () => {
      this.onWindowResize()
    })
  }
}

export default FrameRender
