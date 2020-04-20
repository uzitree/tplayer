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
      <div class="typ-control-bar">
        <div class="typ-control-btn typ-play-control"><span class="icon typfont typicon-bofangqi-bofang"></span></div>
        <div class="typ-control-txt typ-remaining-time-display">0:00</div>
        <div class="typ-progress-control">
          <div class="typ-progress-slider">
            <div class="typ-load-progress"></div>
            <div class="typ-mouse-display"></div>
            <div class="typ-play-progress">
              <i class="typ-play-current"></i>
            </div>
          </div>
        </div>
        <div class="typ-control-txt typ-duration-display">--:--</div>
        <div class="typ-control-btn typ-fullscreen-control"><span class="icon typfont typicon-fullscreen"></span></div>
      </div>
    `
    DOM.append(this.player.el, html)
    this.el = this.player.el.querySelector('.typ-control-bar')
    this.cel = {
      typPlayControl: this.el.querySelector('.typ-play-control'),
      typRemainingTimeDisplay: this.el.querySelector('.typ-remaining-time-display'),
      typDurationDisplay: this.el.querySelector('.typ-duration-display'),
      typProgressSlider: this.el.querySelector('.typ-progress-slider'),
      typLoadProgress: this.el.querySelector('.typ-load-progress'),
      typPlayProgress: this.el.querySelector('.typ-play-progress'),
      typPlayCurrent: this.el.querySelector('.typ-play-current'),
      typProgressControl: this.el.querySelector('.typ-progress-control'),
      typFullscreenControl: this.el.querySelector('.typ-fullscreen-control')
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
    this.cel.typPlayControl.addEventListener('click', () => {
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

    this.cel.typFullscreenControl.addEventListener('click', () => {
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
    // const { typPlayControlEL } = this.cel
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

    this.cel.typProgressControl.addEventListener('mousedown', this.handleMouseDown, false)
    this.cel.typProgressControl.addEventListener('touchstart', this.handleMouseDown, false)
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
    this.cel.typRemainingTimeDisplay.innerHTML = time

    // this.updateTextNode_(time)
  }

  // 更新总时间
  updateDurationTimeContent () {
    let time = this.player.duration()
    time = timeFormat(time)
    this.cel.typDurationDisplay.innerHTML = time

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
    this.cel.typLoadProgress.style.width = percent
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
    this.cel.typPlayProgress.style.width = persent * 100 + '%'
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
    // const typProgressControlRect = DOM.getBoundingClientRect(this.cel.typProgressControl)
    this.player.video.pause()
    const typProgressControlPoint = DOM.getPointerPosition(this.cel.typProgressControl, event).x
    this.cel.typPlayProgress.style.width = `${typProgressControlPoint * 100}%`
    this.cel.typProgressControl.addEventListener('mousemove', this.handleMouseMove, false)
    this.cel.typProgressControl.addEventListener('mouseup', this.handleMouseUp, false)
    this.cel.typProgressControl.addEventListener('touchmove', this.handleMouseMove, false)
    this.cel.typProgressControl.addEventListener('touchend', this.handleMouseUp, false)
  }

  handleMouseMove (event) {
    // event.preventDefault()
    // event.stopPropagation()
    // const typProgressControlRect = DOM.getBoundingClientRect(this.cel.typProgressControl)
    const typProgressControlPoint = DOM.getPointerPosition(this.cel.typProgressControl, event).x
    this.cel.typPlayProgress.style.width = `${typProgressControlPoint * 100}%`
    console.log(`${typProgressControlPoint}%`)
  }

  handleMouseUp (event) {
    event.preventDefault()
    event.stopPropagation()
    this.player.video.play()
    const duration = this.player.duration()
    // const typProgressControlRect = DOM.getBoundingClientRect(this.cel.typProgressControl)
    const typProgressControlPoint = DOM.getPointerPosition(this.cel.typProgressControl, event).x
    const currentTime = typProgressControlPoint * duration
    // 设置当前时间播放
    this.player.currentTime(currentTime)
    // this.cel.typProgressControl.removeEventListener('mousedown', this.handleMouseDown, false)
    this.cel.typProgressControl.removeEventListener('mousemove', this.handleMouseMove, false)
    this.cel.typProgressControl.removeEventListener('mouseup', this.handleMouseUp, false)
    this.cel.typProgressControl.removeEventListener('touchmove', this.handleMouseMove, false)
    this.cel.typProgressControl.removeEventListener('touchend', this.handleMouseUp, false)

    // console.log(typProgressControlRect, typProgressControlPoint)
    // typProgressControlRect.width * typProgressControlPoint

    // const totalWidth = this.cel.typProgressControl.clientWidth
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
