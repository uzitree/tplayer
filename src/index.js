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
    const parentEl = document.getElementById(id)
    this.parentEl = parentEl
    this.eventMiddleware = EventMiddleware.instance()
    // 播放器实例化 => player.js
    this.playerObj = new Player(this, parentEl, options, ready)
    this.el = this.playerObj.el
    // EventMiddleware.on('hahah', function (res) {
    //   console.log(res)
    // })

    // console.log(this.calcuUVS())

    // 组装插件
    this.plugin = {}
    this.usePlugin(new MVFrame())
    return this
  }

  //   var vs = [
  //     [0, 3], [1, 3], [2, 3], [3, 3],
  //     [0, 2], [1, 2], [2, 2], [3, 2],
  //     [0, 1], [1, 1], [2, 1], [3, 1],
  //     [0, 0], [1, 0], [2, 0], [3, 0]
  //   ]
  // calcuUVS () {
  //   // const { splitX, splitY } = {4,4}
  //   const splitX = 4
  //   const splitY = 4
  //   const vs = []
  //   for (let y = splitY - 1; y >= 0; y--) {
  //     for (let x = 0; x < splitX; x++) {
  //       vs.push([x, y])
  //     }
  //   }
  //   return vs
  // }

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
