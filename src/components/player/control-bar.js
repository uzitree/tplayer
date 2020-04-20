import * as DOM from '@/utils/dom'
import '@/assets/css/control-bar.scss'
import { timeFormat, clamp } from '@/utils/util'
import * as Fn from '@/utils/fn.js'
import FullscreenApi from '@/utils/fullscreen-api'

// get the percent width of a time compared to the total end
const percentify = (time, end) => clamp((time / end) * 100, 0, 100).toFixed(2) + '%'

class ControlBar {
  constructor () {
    console.log('ControlBar -- constructor')
    // Fn.UPDATE_REFRESH_INTERVAL
    // this.updatePlayProgress = Fn.throttle(Fn.bind(this, this.updatePlayProgress), Fn.UPDATE_REFRESH_INTERVAL)
    this.handleMouseDown = Fn.bind(this, this.handleMouseDown)
    this.handleMouseMove = Fn.throttle(Fn.bind(this, this.handleMouseMove), Fn.UPDATE_REFRESH_INTERVAL)
    this.handleMouseUp = Fn.bind(this, this.handleMouseUp)
  }

  init (player) {
    this.player = player
    this.$root = player.$root
    this.createDomHtml()
    this.addEventListener()
    this.onEventListener()
  }

  createDomHtml () {
    const html = `
      <div class="tp-control-bar">
        <div class="tp-control-btn tp-play-control"><span class="icon tpfont tpicon-bofangqi-bofang"></span></div>
        <div class="tp-control-txt tp-remaining-time-display">0:00</div>
        <div class="tp-progress-control">
          <div class="tp-progress-slider">
            <div class="tp-load-progress"></div>
            <div class="tp-mouse-display"></div>
            <div class="tp-play-progress">
              <i class="tp-play-current"></i>
            </div>
          </div>
        </div>
        <div class="tp-control-txt tp-duration-display">--:--</div>
        <div class="tp-control-btn tp-fullscreen-control"><span class="icon tpfont tpicon-fullscreen"></span></div>
      </div>
    `
    DOM.append(this.player.el, html)
    this.el = this.player.el.querySelector('.tp-control-bar')
    this.cel = {
      tpPlayControl: this.el.querySelector('.tp-play-control'),
      tpRemainingTimeDisplay: this.el.querySelector('.tp-remaining-time-display'),
      tpDurationDisplay: this.el.querySelector('.tp-duration-display'),
      tpProgressSlider: this.el.querySelector('.tp-progress-slider'),
      tpLoadProgress: this.el.querySelector('.tp-load-progress'),
      tpPlayProgress: this.el.querySelector('.tp-play-progress'),
      tpPlayCurrent: this.el.querySelector('.tp-play-current'),
      tpProgressControl: this.el.querySelector('.tp-progress-control'),
      tpFullscreenControl: this.el.querySelector('.tp-fullscreen-control')
    }
  }

  addEventListener () {
    this.el.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.player.reportUserActivity()
    }, false)
    this.el.addEventListener('mousemove', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.player.reportUserActivity()
    }, false)
    this.el.addEventListener('touchmove', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.player.reportUserActivity()
    }, false)
    this.cel.tpPlayControl.addEventListener('click', () => {
      if (this.player.video.paused) {
        this.player.video.play()
      } else {
        this.player.video.pause()
      }
    }, false)

    // 得到需要全屏的el对象
    this.fullEl = this.player.video

    // 如果支持全屏API的话
    if (FullscreenApi.requestFullscreen) {
      this.fullEl.addEventListener(FullscreenApi.fullscreenchange, () => {
      // this.handleFullscreenChange()
        const el = this.fullEl
        let isFs = document[FullscreenApi.fullscreenElement] === el
        if (!isFs && el.matches) {
          isFs = el.matches(':' + FullscreenApi.fullscreen)
        } else if (!isFs && el.msMatchesSelector) {
          isFs = el.msMatchesSelector(':' + FullscreenApi.fullscreen)
        }
        this.player.isFullscreen(isFs)
      })
    }

    this.cel.tpFullscreenControl.addEventListener('click', () => {
      if (FullscreenApi.requestFullscreen) {
        this.handleFullscreenChange()
      } else {
        // this.fullEl.enterFullScreen()
        if (this.fullEl.webkitEnterFullscreen || this.fullEl.enterFullScreen) {
          this.fullEl.webkitEnterFullscreen && this.fullEl.webkitEnterFullscreen()
          this.fullEl.enterFullScreen && this.fullEl.enterFullScreen()
        } else {
          // 不支持全屏的回调
          console.log('不支持全屏的回调')
        }

        // 没有全屏事件的时候
        // if (this.fullEl.requestFullscreen) {
        //   this.fullEl.requestFullscreen()
        // } else if (this.fullEl.mozRequestFullScreen) {
        //   this.fullEl.mozRequestFullScreen()
        // } else if (this.fullEl.msRequestFullscreen) {
        //   this.fullEl.msRequestFullscreen()
        // } else if (this.fullEl.webkitRequestFullscreen) {
        //   this.fullEl.webkitRequestFullScreen()
        // } else {
        //   console.log('不支持全屏相关事件')
        // }
      }
    }, false)
  }

  onEventListener () {
    // const { tpPlayControlEL } = this.cel
    // 更新当前时间
    this.player.video.addEventListener('ended', () => {
      this.updateCurrentTimeContent()
    })
    this.player.video.addEventListener('timeupdate', () => {
      // 更新当前时间
      this.updateCurrentTimeContent()
      // 更新播放进度
      this.updatePlayProgress()
      // this.updateLoadProgress()
    })

    // 更新总时间
    this.player.video.addEventListener('durationchange', () => {
      this.updateDurationTimeContent()
    })
    this.player.video.addEventListener('loadstart', () => {
      this.updateDurationTimeContent()
    })
    this.player.video.addEventListener('loadedmetadata', () => {
      this.updateDurationTimeContent()
    })
    this.player.video.addEventListener('progress', () => {
      this.updateLoadProgress()
    })

    this.cel.tpProgressControl.addEventListener('mousedown', this.handleMouseDown, false)
    this.cel.tpProgressControl.addEventListener('touchstart', this.handleMouseDown, false)
  }

  // 更新当前时间
  updateCurrentTimeContent () {
    let time

    if (this.player.ended) {
      time = this.player.duration()
    } else {
      time = (this.player.scrubbing()) ? this.player.getCache().currentTime : this.player.currentTime()
    }

    time = timeFormat(time)
    this.cel.tpRemainingTimeDisplay.innerHTML = time

    // this.updateTextNode_(time)
  }

  // 更新总时间
  updateDurationTimeContent () {
    let time = this.player.duration()
    time = timeFormat(time)
    this.cel.tpDurationDisplay.innerHTML = time

    // this.updateTextNode_(time)
  }

  // 更新加载进度
  updateLoadProgress () {
    // console.log('updateProgress')
    // const buffered = this.player.buffered()
    const bufferedEnd = this.player.bufferedEnd()
    // const duration = (liveTracker && liveTracker.isLive()) ? liveTracker.seekableEnd() : this.player_.duration()
    const duration = this.player.duration()
    // console.log(buffered)
    // 这个是加载进度
    const percent = percentify(bufferedEnd, duration)
    this.cel.tpLoadProgress.style.width = percent
    // console.log(percent)
  }

  // 更新播放进度
  updatePlayProgress () {
    // window.requestAnimationFrame(() => {
    const currentTime = (this.player.scrubbing())
      ? this.player.getCache().currentTime
      : this.player.currentTime()
    const duration = this.player.duration()
    var persent = currentTime / duration

    // console.log('updatePlayProgress', currentTime, persent)
    this.cel.tpPlayProgress.style.width = persent * 100 + '%'
    // })
    // timeTooltip.updateTime(seekBarRect, seekBarPoint, time)
  }

  /**
   * Creates an instance of this class.
   *
   * @param {EventTarget~Event} event
   *        The `Player` that this class should be attached to.
   *
   * @listens touchstart
   * @listens mousedown
   */
  handleMouseDown (event) {
    event.preventDefault()
    event.stopPropagation()
    // const tpProgressControlRect = DOM.getBoundingClientRect(this.cel.tpProgressControl)
    this.player.video.pause()
    const tpProgressControlPoint = DOM.getPointerPosition(this.cel.tpProgressControl, event).x
    this.cel.tpPlayProgress.style.width = `${tpProgressControlPoint * 100}%`
    this.cel.tpProgressControl.addEventListener('mousemove', this.handleMouseMove, false)
    this.cel.tpProgressControl.addEventListener('mouseup', this.handleMouseUp, false)
    this.cel.tpProgressControl.addEventListener('touchmove', this.handleMouseMove, false)
    this.cel.tpProgressControl.addEventListener('touchend', this.handleMouseUp, false)
  }

  handleMouseMove (event) {
    // event.preventDefault()
    // event.stopPropagation()
    // const tpProgressControlRect = DOM.getBoundingClientRect(this.cel.tpProgressControl)
    const tpProgressControlPoint = DOM.getPointerPosition(this.cel.tpProgressControl, event).x
    this.cel.tpPlayProgress.style.width = `${tpProgressControlPoint * 100}%`
    console.log(`${tpProgressControlPoint}%`)
  }

  handleMouseUp (event) {
    event.preventDefault()
    event.stopPropagation()
    this.player.video.play()
    const duration = this.player.duration()
    // const tpProgressControlRect = DOM.getBoundingClientRect(this.cel.tpProgressControl)
    const tpProgressControlPoint = DOM.getPointerPosition(this.cel.tpProgressControl, event).x
    const currentTime = tpProgressControlPoint * duration
    // 设置当前时间播放
    this.player.currentTime(currentTime)
    // this.cel.tpProgressControl.removeEventListener('mousedown', this.handleMouseDown, false)
    this.cel.tpProgressControl.removeEventListener('mousemove', this.handleMouseMove, false)
    this.cel.tpProgressControl.removeEventListener('mouseup', this.handleMouseUp, false)
    this.cel.tpProgressControl.removeEventListener('touchmove', this.handleMouseMove, false)
    this.cel.tpProgressControl.removeEventListener('touchend', this.handleMouseUp, false)

    // console.log(tpProgressControlRect, tpProgressControlPoint)
    // tpProgressControlRect.width * tpProgressControlPoint

    // const totalWidth = this.cel.tpProgressControl.clientWidth
    // let moveWidth = event.offsetX
    // if (moveWidth < 0) moveWidth = 0
    // if (moveWidth > totalWidth) moveWidth = totalWidth
    // var currtime = moveWidth / totalWidth * duration
    // console.log(totalWidth, moveWidth, currtime)
    // 是否支持提前播放
    // if (this.params.canfast === false) {
    //   if (currtime > video[0].currentTime) return false
    // }
    // this.player.currentTime(currtime)
  }

  handleFullscreenChange () {
    if (!this.player.isFullscreen()) {
      DOM.requestFullscreen(this.fullEl).then(() => {
        this.player.isFullscreen(true)
      }).catch(() => {
        this.player.isFullscreen(false)
      })
    } else {
      DOM.exitFullScreen(this.fullEl).then(() => {
        this.player.isFullscreen(false)
      }).catch(() => {
        this.player.isFullscreen(false)
      })
    }
  }
}
export default ControlBar
