var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require('./webpack.config');

config.entry.main.unshift("webpack-dev-server/client?http://127.0.0.1:8888", "webpack/hot/only-dev-server");

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    contentBase:'public',
    hot: true,
    noInfo:true,
    historyApiFallback: true
}).listen(8888,'127.0.0.1',function(){
    console.log('webpack dev listen port 8888...')
})