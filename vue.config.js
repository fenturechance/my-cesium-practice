const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = './node_modules/cesium/Source'
module.exports = {
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, '../Build/Cesium/Workers'),
        to: 'Workers'
      }]),
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, 'Assets'),
        to: 'Assets'
      }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ]
  }
}