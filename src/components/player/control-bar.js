import * as DOM from '@/utils/dom'
import '@/assets/css/control-bar.scss'
import { timeFormat, clamp } from '@/utils/util'
// import * as Fn from '../../utils/fn.js'

// get the percent width of a time compared to the total end
const percentify = (time, end) => clamp((time / end) * 100, 0, 100).toFixed(2) + '%'

class ControlBar {
  constructor () {
    console.log('ControlBar -- constructor')
    // Fn.UPDATE_REFRESH_INTERVAL
    // this.updatePlayProgress = Fn.throttle(Fn.bind(this, this.updatePlayProgress), Fn.UPDATE_REFRESH_INTERVAL)
  }

  init (player) {
    this.player = player
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
      typProgressControl: this.el.querySelector('.typ-progress-control')
    }
  }

  addEventListener () {
    this.cel.typPlayControl.addEventListener('click', () => {
      if (this.player.video.paused) {
        this.player.video.play()
      } else {
        this.player.video.pause()
      }
    })
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
      console.log(1212)
      this.updateLoadProgress()
    })

    this.cel.typPlayCurrent.addEventListener('mousedown', this.handleMouseDown.bind(this), false)

    this.cel.typProgressControl.addEventListener('mouseup', this.handleMouseUp.bind(this), false)
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
    console.log('updateProgress')
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
    // const seekBarRect = DOM.getBoundingClientRect(this.cel.typPlayCurrent)
    // const seekBarPoint = DOM.getPointerPosition(this.cel.typPlayCurrent, event)

    // console.log(seekBarRect, seekBarPoint)
  }

  handleMouseMove () {

  }

  handleMouseUp (event) {
    const duration = this.player.duration()
    // const typProgressControlRect = DOM.getBoundingClientRect(this.cel.typProgressControl)
    const typProgressControlPoint = DOM.getPointerPosition(this.cel.typProgressControl, event).x
    const currentTime = typProgressControlPoint * duration
    // 设置当前时间播放
    this.player.currentTime(currentTime)

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
}
export default ControlBar
