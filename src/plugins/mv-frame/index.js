/*
 * @Author: 王嘉炀
 * @Date: 2020-03-29 22:10:38
 */

import * as Dom from '../../utils/dom'
import '../../assets/css/free-mode.scss'
import FrameRender from './FrameRender'
// http://117.80.86.239:18000/live/badmin-2160p-12000k.m3u8
class MVFrame {
  // constructor () {
  // }

  init (mvp) {
    // 首先我们需要把webgl容器占位好。
    mvp.plugin.mvf = this
    const videoHtml = `
      <div class="typ-free-frame"></div>
    `
    Dom.append(mvp.el, videoHtml)
    this.el = mvp.el.querySelector('.typ-free-frame')
    // 我需要先拿到播放器的流
    const frameRender = new FrameRender(this.el, {
      video: mvp.playerObj.video
    })
    // frameRender.render()

    mvp.playerObj.video.addEventListener('playing', () => {
      // console.log('canplay')
      setTimeout(() => {
        frameRender.render()
      }, 100)
    })

    // const videoTexture = new THREE.VideoTexture(mvp.playerObj.video)
    console.log(frameRender)
    console.log('MVFrame')
  }
}

export default MVFrame
