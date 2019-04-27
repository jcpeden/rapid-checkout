const WriteFilePlugin = require( 'write-file-webpack-plugin');
const HashedModuleIdsPlugin = require( 'webpack/lib/HashedModuleIdsPlugin');
const OptimizeJsPlugin = require( 'optimize-js-plugin');
const TerserPlugin = require( 'terser-webpack-plugin');
const VueLoaderPlugin = require( 'vue-loader/lib/plugin');
const EnvironmentPlugin = require( 'webpack/lib/EnvironmentPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist');
const yenv = require('yenv');

Object.assign(process.env, yenv('env.yaml', {env: 'production'}));

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./app/main.js'],
  output: {
    filename: '[name].js',
    path: buildPath
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        options: {
          presets: [
            '@babel/preset-env',
            '@vue/app'
          ]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        // Load all images as base64 encoding if they are smaller than 8192 bytes
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // On development we want to see where the file is coming from, hence we preserve the [path]
              name: '[name].[ext]?hash=[hash:20]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
					{
						loader: 'style-loader',
            options: {
              sourceMap: false
            }
					},
          {
            // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap: false
            }
          },
          {
            // compiles Sass to CSS
            loader: "sass-loader",
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          }
          // Please note we are not running postcss here
        ]
      },
    ]
  },
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new OptimizeCSSAssetsPlugin({})
		],
	},
	plugins: [
		new WriteFilePlugin(),
		new VueLoaderPlugin(),
		new HashedModuleIdsPlugin(),
		new OptimizeJsPlugin({
			sourceMap: false
		}),
		new EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'BASE_URL']),
    // new MiniCssExtractPlugin({
      // filename: "[name].css",
      // chunkFilename: "[id].css"
    // })
	]
};
