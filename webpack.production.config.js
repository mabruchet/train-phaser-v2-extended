var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.ts')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']

  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: './',
    filename: 'js/whispy-player.js'
  },
  mode: 'production',
  devtool: 'source-map',
  optimization :{
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          name: "vendor",
          enforce: true,
          filename: 'js/vendor.whispy-player.js'
        }
      }
    },
    minimize: true
  },
  plugins: [
    definePlugin,
    new CleanWebpackPlugin(['build']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({
      filename: 'index.html', // path.resolve(__dirname, 'build', 'index.html'),
      template: './src/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    })
  ],
  module: {
    rules: [
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'url-loader', options: {
        fallback: 'file-loader'
      }}] },
      { test: /\.(woff|otf)$/, use: [{ loader: 'url-loader', options: { fallback: 'file-loader'}}] },
      { test: /\.css$/, use: [ {loader:'style-loader'}, {loader:'css-loader', options: { minimize: true }}]},
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
    extensions : ['.ts', '.js', '.json', '.png', '.css', '.woff', '.otf'],
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
