var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.ts')
    ],
    vendor: ['pixi', 'p2', 'phaser']
  },
  mode: "development",
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: 'bundle.js'
  },
  watch: true,
  optimization :{
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          name: "vendor",
          enforce: true,
          filename: 'vendor.bundle.js'
        }
      }
    } 
  },
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3003,
      server: {
        baseDir: ['./', './build']
      }
    })
  ],
  module: {
    rules: [
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {}}] },
      { test: /\.(woff|otf)$/, use: [{ loader: 'file-loader', options: {}}] },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.ts?$/, use: 'awesome-typescript-loader', exclude: /node_modules/ },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    extensions : ['.ts', '.js', '.json', '.png'],
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
