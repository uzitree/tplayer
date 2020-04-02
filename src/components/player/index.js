/*
 * @description 播放器主体类,我只负责处理播放器的生命周期
 * @Author: 王嘉炀
 * @Date: 2020-03-29 21:50:17
 */
import * as Dom from '../../utils/dom'
class Player {
  constructor (mvp, el, options, ready) {
    this.mvp = mvp
    this.el = el
    this.video = null
    this.options = this.initOptions(options)
    // 创建完就会得到video对象
    this.createVideoDom()
    // 绑定监听事件
    this.onVideoEvent()
  }
  // {sceneId:"v1", sceneName:"赛车", sceneFilePath:"./video/960p.mp4", sceneType:"Video",initFov:110}

  initOptions (options) {
    const defaultOptions = {
      title: 'AKB48演出',
      src: 'akb-4k-4x1080p.mp4',
      type: 'live'
    }
    return defaultOptions
  }

  createVideoDom () {
    const videoHtml = `
      <div class="mvp-constainer">
        <div class="mvp-video"><video webkit-playsinline="true" playsinline="true" controls="controls" ></video></div>
      </div>
    `
    Dom.append(this.el, videoHtml)
    this.video = this.el.querySelector('video')
    this.video.src = this.options.src
  }

  onVideoEvent () {
    this.video.addEventListener('canplaythrough', function () {
      console.log('canplaythrough')
    })
    this.video.addEventListener('loadedmetadata', function () {
      console.log('loadedmetadata')
    })
    this.video.addEventListener('loadstart', function () {
      console.log('loadstart')
    })
    this.video.addEventListener('durationchange', function () {
      console.log('durationchange')
    })
    this.video.addEventListener('play', function () {
      console.log('play')
    })
    this.video.addEventListener('playing', function () {
      console.log('playing')
    })
    this.video.addEventListener('canplay', function () {
      console.log('canplay')
    })
    this.video.addEventListener('pause', function () {
      console.log('pause')
    })
    this.video.addEventListener('ended', function () {
      console.log('ended')
    })
    this.video.addEventListener('seeking', function () {
      console.log('seeking')
    })

    this.video.addEventListener('seeked', function () {
      console.log('seeked')
    })
    this.video.addEventListener('waiting', function () {
      console.log('waiting')
    })
    this.video.addEventListener('timeupdate', function () {
      console.log('timeupdate')
    })

    this.video.addEventListener('abort', function () {
      console.log('abort')
    })
    this.video.addEventListener('error', function () {
      console.log('error')
    })
  }
}

export default Player
