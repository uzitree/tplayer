import * as DOM from '@/utils/dom'
import '@/assets/css/control-bar.scss'
import { timeFormat } from '@/utils/util'
class ControlBar {
  constructor () {
    console.log('ControlBar -- constructor')
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
        <div class="typ-control-txt typ-remaining-time-display">--:--</div>
        <div class="typ-progress-control">
          <div class="typ-progress-slider">
            <div class="typ-load-progress"></div>
            <div class="typ-mouse-display"></div>
            <div class="typ-play-progress"></div>
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
      typDurationDisplay: this.el.querySelector('.typ-duration-display')
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
      this.updateCurrentTimeContent()
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
}
export default ControlBar
