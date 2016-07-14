/*global require, __dirname */

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
var webpackConfig = require('../webpack.config.js');
var compiler = webpack(webpackConfig);

var devServer = require('webpack-dev-middleware');
var hotServer = require('webpack-hot-middleware');

var express = require('express');
var app = express();

app.use(devServer(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true },
  inline: true,
  hot: true
}));

app.use(hotServer(compiler, {
  log: console.log
}));

// Display the index.html file
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(3002, function () {
  console.log('Example app listening on port 3000!');
});
