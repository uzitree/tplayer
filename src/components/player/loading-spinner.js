import * as DOM from '@/utils/dom'
import '@/assets/css/loading-spinner.scss'
// import { timeFormat, clamp } from '@/utils/util'
// import * as Fn from '@/utils/fn.js'
// import FullscreenApi from '@/utils/fullscreen-api'

class LoadingSpinner {
  constructor () {
    console.log('LoadingSpinner -- constructor')
  }

  init (player) {
    this.player = player
    this.$root = player.$root
    this.createDomHtml()
    // this.addEventListener()
    this.onEventListener()
  }

  createDomHtml () {
    const html = '<div class="tp-loading-spinner"><span class="loading-icon"></span></div>'
    DOM.append(this.player.el, html)
    this.el = this.player.el.querySelector('.tp-loading-spinner')
    this.cel = {}
  }

  onEventListener () {
    this.player.video.addEventListener('play', () => {
      this.showLoading()
    })
    this.player.video.addEventListener('waiting', () => {
      this.showLoading()
    })
    this.player.video.addEventListener('playing', () => {
      this.hideLoading()
    })
  }

  showLoading () {
    this.el.style.display = ''
  }

  hideLoading () {
    this.el.style.display = 'none'
  }
}
export default LoadingSpinner
