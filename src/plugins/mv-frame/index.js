/*
 * @Author: 王嘉炀
 * @Date: 2020-03-29 22:10:38
 */

import * as THREE from 'three'
class MVFrame {
  // constructor () {
  // }

  init (mvp) {
    // 首先，我需要先拿到播放器的流
    const videoTexture = new THREE.VideoTexture(mvp.playerObj.video)
    console.log(videoTexture)
    console.log('MVFrame')
  }
}

export default MVFrame
