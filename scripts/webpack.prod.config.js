const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    // // 删除文件 保留新文件
    // new CleanWebpackPlugin({
    //   dry: false,
    //   verbose: true
    // })
    new CleanWebpackPlugin()
  ]
}
