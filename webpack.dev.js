const WriteFilePlugin = require('write-file-webpack-plugin');
const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const buildPath = path.resolve(__dirname, 'dist');

const yenv = require('yenv');

Object.assign(process.env, yenv('env.yaml', {env: 'development'}));

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./app/main.js'],
  output: {
    filename: '[name].js',
    publicPath: 'http://localhost:3000/',
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
              name: '[path][name].[ext]?hash=[hash:20]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            // creates style nodes from JS strings
            loader: "style-loader",
            options: {
              sourceMap: true
            }
          },
          {
            // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap: true
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
  plugins: [
    new CleanWebpackPlugin(buildPath),
    new WriteFilePlugin(),
    new VueLoaderPlugin(),
		new EnvironmentPlugin(['NODE_ENV', 'DEBUG', 'BASE_URL'])
  ]
};
