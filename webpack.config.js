/*global module */

var webpack = require('webpack');
var path = require('path');


var GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('dev'),
  __DEV__: true
};

var publicPath = path.join(__dirname, "public");

var plugins = [
  new webpack.optimize.CommonsChunkPlugin('vendor.js'),
  // Webpack 1.0
  new webpack.optimize.OccurenceOrderPlugin(),
  // Webpack 2.0 fixed this mispelling
  // new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin(GLOBALS)
];

module.exports = {
  devtool: 'source-map',
  entry: [
    "webpack-hot-middleware/client",
    "./src/app.js"
  ],

  output: {
    path: publicPath,
    publicPath: '',
    filename: "index.js"
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(path.join(__dirname, 'src')),
    alias: {
      'libdgk': path.resolve(__dirname, 'lib'),
      'dgk': path.resolve(__dirname, 'src')
    }
  },

  plugins: plugins,

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
};
