/*
 * @Author: 王嘉炀
 * @Date: 2020-03-29 21:52:17
 */
import { version } from '../package.json'
import EventMiddleware from '@tulies/event-middleware'

import Player from './components/player'
import MVFrame from './plugins/mv-frame'

import './assets/css/index.scss'

class MVPlayer {
  /**
   * 构造函数
   */
  constructor (id, options = {}, ready = null) {
    const el = document.getElementById(id)

    this.eventMiddleware = EventMiddleware.instance()
    // 播放器实例化 => player.js
    this.playerObj = new Player(this, el, options, ready)
    EventMiddleware.on('hahah', function (res) {
      console.log(res)
    })

    // 组装插件
    this.usePlugin(new MVFrame())
    return this
  }

  init () {
    console.log('init')
  }

  usePlugin (plugin) {
    plugin.init(this)
  }

  static instance (id, options, ready) {
    return new MVPlayer(id, options, ready)
  }
}

// 版本号
MVPlayer.VERSION = version

export default MVPlayer
