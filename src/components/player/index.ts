/*
 * @description 播放器主体类,我只负责处理播放器的生命周期
 * @Author: 王嘉炀
 * @Date: 2020-04-03 11:50:17
 */
<<<<<<< HEAD:src/components/player/index.ts
import * as Dom from '../../utils/dom'
import MVPlayer from '../../MVPlayer'
interface Options{
  src: string;
}
class Player {

  public video!: HTMLVideoElement

  constructor (public mvp: MVPlayer, public el: HTMLElement, public options: Options) {

=======
import * as DOM from '@/utils/dom'
import ControlBar from './control-bar'
class Player {
  constructor (mvp, el, options = {}, ready) {
    this.mvp = mvp
    this.parentEl = el

    // 初始化以下属性
    this.initProp()
>>>>>>> dev:src/components/player/index.js
    this.options = this.initOptions(options)
    this.resetCache_()
    console.log(this.options)
    // 创建完就会得到video对象
    this.createVideoDom()
    // 绑定监听事件
    this.onVideoEvent()
    this.useConponent(new ControlBar())
  }

  initProp () {
    this.video = null
    this.isReady_ = false
    this.changingSrc_ = false
  }

  initOptions (options: Options): Options {
    const defaultOptions = {
      // 是否静音
      muted: false,
      // 是否使用原生控制条
      controls: false,
      // 是否自动播放
      autoplay: false,
      // 预加载
      preload: 'auto',
      // 是否循环播放
      loop: false,
      // 播放流地址
      src: '',
      // 事件
      on: {}
    }
    return {
      ...defaultOptions,
      ...options
    }
  }

  /**
   * Resets the internal cache object.
   *
   * Using this function outside the player constructor or reset method may
   * have unintended side-effects.
   *
   * @private
   */
  resetCache_ () {
    this.cache_ = {

      // Right now, the currentTime is not _really_ cached because it is always
      // retrieved from the tech (see: currentTime). However, for completeness,
      // we set it to zero here to ensure that if we do start actually caching
      // it, we reset it along with everything else.
      currentTime: 0,
      initTime: 0,
      // inactivityTimeout: this.options_.inactivityTimeout,
      duration: NaN,
      lastVolume: 1,
      // lastPlaybackRate: this.defaultPlaybackRate(),
      media: null,
      src: '',
      source: {},
      sources: [],
      volume: 1
    }
<<<<<<< HEAD:src/components/player/index.ts
    console.log(options)
    return defaultOptions
  }  
=======
  }
>>>>>>> dev:src/components/player/index.js

  createVideoDom (): void {
    const videoHtml = `
      <div class="typ-constainer">
        <div class="typ-video"><video webkit-playsinline="true" playsinline="true" controls="controls" ></video></div>
        <div class="typ-loading-spinner"></div>
        <div class="typ-poster"></div>
        <div class="typ-platbtn"></div>
      </div>
    `
<<<<<<< HEAD:src/components/player/index.ts
    Dom.append(this.el, videoHtml)
    this.video = this.el.querySelector('video') as HTMLVideoElement
    this.video.src = this.options.src
  }

  onVideoEvent (): void {
    this.video.addEventListener('canplaythrough', function () {
=======
    DOM.append(this.parentEl, videoHtml)
    this.el = this.parentEl.querySelector('.typ-constainer')
    this.video = this.el.querySelector('video')
    if (this.options.src) {
      this.video.src = this.options.src
    }
    this.el.querySelector('.typ-platbtn').addEventListener('click', () => {
      console.log('开始播放')
      this.video.play()
    })
    // this.
  }

  // 触发了开始
  // handleStarted () {
  //   DOM.addClass(this.el, 'typ-has-started')
  // }

  onVideoEvent () {
    this.video.addEventListener('canplaythrough', () => {
>>>>>>> dev:src/components/player/index.js
      console.log('canplaythrough')
    })
    this.video.addEventListener('loadedmetadata', () => {
      console.log('loadedmetadata')
      this.triggerReady()
    })
    this.video.addEventListener('loadstart', () => {
      console.log('loadstart')
    })
    this.video.addEventListener('durationchange', () => {
      console.log('durationchange')
      // console.log(this.video.duration)
      this.duration(this.video.duration)
      // duration
      // this.duration(duration)
    })
    this.video.addEventListener('play', () => {
      console.log('play')
      // 触发第一次
      this.hasStarted(true)

      DOM.removeClass(this.el, 'typ-pause')
      DOM.addClass(this.el, 'typ-playing')
    })
    this.video.addEventListener('playing', () => {
      console.log('playing')
    })
    this.video.addEventListener('canplay', () => {
      console.log('canplay')
    })
    this.video.addEventListener('pause', () => {
      console.log('pause')
      DOM.removeClass(this.el, 'typ-playing')
      DOM.addClass(this.el, 'typ-pause')
    })
    this.video.addEventListener('ended', () => {
      console.log('ended')
    })
    this.video.addEventListener('seeking', () => {
      console.log('seeking')
    })

    this.video.addEventListener('seeked', () => {
      console.log('seeked')
    })
    this.video.addEventListener('waiting', () => {
      console.log('waiting')
    })
    this.video.addEventListener('timeupdate', () => {
      console.log('timeupdate')
    })

    this.video.addEventListener('abort', () => {
      console.log('abort')
    })
    this.video.addEventListener('error', () => {
      console.log('error')
    })
  }

  // 点击播放进度条的时候触发，松手的时候恢复。
  scrubbing (isScrubbing) {
    if (typeof isScrubbing === 'undefined') {
      return this.scrubbing_
    }
    this.scrubbing_ = !!isScrubbing

    if (isScrubbing) {
      DOM.addClass(this.el, 'typ-scrubbing')
    } else {
      DOM.addClass(this.el, 'typ-scrubbing')
    }
  }

  currentTime (seconds) {
    if (typeof seconds !== 'undefined') {
      if (seconds < 0) {
        seconds = 0
      }
      // isReady_ 是否reday
      // changingSrc_ 是否正在切换src播放地址
      // 处于这2个情况的话，先把seconds记录下来，等待第一次播放的时候触发把currentTime赋值这个时间
      if (!this.isReady_ || this.changingSrc_) {
        this.cache_.initTime = seconds
        // this.off('canplay', this.applyInitTime_)
        // this.one('canplay', this.applyInitTime_)
        this.video.addEventListener('canplay', () => {
          this.currentTime(this.cache_.initTime)
        }, { once: true })
        return
      }
      // 设置播放器时间
      // this.techCall_('setCurrentTime', seconds)
      this.player.currentTime = seconds
      this.cache_.initTime = 0
      return
    }

    // cache last currentTime and return. default to 0 seconds
    //
    // Caching the currentTime is meant to prevent a massive amount of reads on the tech's
    // currentTime when scrubbing, but may not provide much performance benefit afterall.
    // Should be tested. Also something has to read the actual current time or the cache will
    // never get updated.
    // this.cache_.currentTime = (this.techGet_('currentTime') || 0)
    this.cache_.currentTime = this.video.currentTime || 0
    return this.cache_.currentTime
  }

  duration (seconds) {
    if (seconds === undefined) {
      // return NaN if the duration is not known
      return this.cache_.duration !== undefined ? this.cache_.duration : NaN
    }

    seconds = parseFloat(seconds)

    // Standardize on Infinity for signaling video is live
    if (seconds < 0) {
      seconds = Infinity
    }

    if (seconds !== this.cache_.duration) {
      // Cache the last set value for optimized scrubbing (esp. Flash)
      this.cache_.duration = seconds

      if (seconds === Infinity) {
        DOM.addClass(this.el, 'typ-live')
      } else {
        DOM.addClass(this.el, 'typ-live')
      }
      if (!isNaN(seconds)) {
        // Do not fire durationchange unless the duration value is known.
        // 除非知道持续时间值，否则不要触发durationchange。
        // @see [Spec]{@link https://www.w3.org/TR/2011/WD-html5-20110113/video.html#media-element-load-algorithm}
        /**
         * @event Player#durationchange
         * @type {EventTarget~Event}
         */
        // this.trigger('durationchange')
      }
    }
  }

  remainingTime () {
    return this.duration() - this.currentTime()
  }

  hasStarted (request) {
    if (request === undefined) {
      // act as getter, if we have no request to change
      return this.hasStarted_
    }

    if (request === this.hasStarted_) {
      return
    }
    this.hasStarted_ = request
    if (this.hasStarted_) {
      DOM.addClass(this.el, 'typ-has-started')
      // 触发第一次play
      // this.trigger('firstplay')
    } else {
      DOM.removeClass(this.el, 'typ-has-started')
    }
  }

  triggerReady () {
    console.log('triggerReady')
    this.isReady_ = true
  }

  useConponent (cmp) {
    if (cmp && cmp.init) {
      cmp.init(this)
    }
  }

  /**
   * Get object for cached values.
   *
   * @return {Object}
   *         get the current object cache
   */
  getCache () {
    return this.cache_
  }
}

export default Player
