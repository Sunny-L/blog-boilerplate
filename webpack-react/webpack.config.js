var webpack = require('webpack')
var path = require('path')

var devConfig,pubConfig;
var config = {
	env:process.env.NODE_ENV,
}

devConfig = {
	devtool: 'eval',
	//输入文件
	// entry:{
	// 	main:['./public/src/js/main.js']
	// },
	entry:[
		'./public/src/js/main.js'
	],
	//输出文件
	output:{
		path:path.join(__dirname, '/public/build'),
		publicPath:'http://127.0.0.1:8888/public/build',
		filename:'[name].bundle.js',
	},
	//loaders
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loaders: ['react-hot','babel?presets[]=react,presets[]=es2015'],
				exclude: /node_modules/,
				include: path.join(__dirname, '/public/src')
			},{
				test: /\.css?$/,
				loader: 'style!css',
				exclude: /node_modules/,
			}
		]
  	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
}

if(config.env == 'prod'){
	pubConfig = Object.assign({},devConfig)
	
	//正式环境去掉热编译相关模块
	pubConfig.module.loaders[0].loaders = ['babel']
	pubConfig.plugins = [new webpack.NoErrorsPlugin()]
	//引用外部，减少打包时间与大小
	pubConfig.externals = [{
		'react':'React',
		'react-dom':'ReactDOM',
	}]
}

module.exports = config.env == 'prod'?pubConfig:devConfig
