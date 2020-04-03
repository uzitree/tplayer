// import { version } from '../package.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../package.json');

import EventMiddleware from '@tulies/event-middleware'

import Player from './components/player'
// import MVFrame from './plugins/mv-frame'


class MVPlayer {
  public eventMiddleware: EventMiddleware
  public playerObj: Player

  static VERSION = version
  /**
   * 构造函数
   */
  constructor (id: string, options: object = {}, ready?: (res: MVPlayer) => void) {
    const el = document.getElementById(id) as HTMLElement

    this.eventMiddleware = EventMiddleware.instance()
    EventMiddleware.on('hahah', function (res) {
      console.log(res)
    })
    // 播放器实例化 => player.js
    this.playerObj = new Player(this, el, options)
   

    // 组装插件
    // this.usePlugin(new MVFrame())
    if(ready) ready({})
    return this
  }

  init (): void {
    console.log('init')
    
  }

  usePlugin (plugin: Plugin): void {
    plugin.init(this)
  }

  static instance (id, options, ready) {
    return new MVPlayer(id, options, ready)
  }
}



export default MVPlayer