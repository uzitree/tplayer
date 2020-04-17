<<<<<<< HEAD
module.exports = {
  // devtool: 'cheap-module-eval-source-map'
  devtool: 'source-map',

=======
const path = require('path')
module.exports = {
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'MVPlayer',
    filename: 'MVPlayer.js',
    path: path.join(__dirname, '../example/lib')
    // publicPath: 'http://127.0.0.1:8000/public/'
  },
  devtool: 'cheap-module-eval-source-map'
>>>>>>> dev
}
