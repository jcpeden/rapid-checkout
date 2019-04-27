const withSass = require('@zeit/next-sass');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = withSass({
  cssModules: false,
	webpack: config => {
		const env = { API_KEY: JSON.stringify(process.env.SHOPIFY_API_KEY) };

    config.plugins.push(new webpack.DefinePlugin(env));
    config.module.rules.push(
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    );
    config.plugins.push(new VueLoaderPlugin());
    return config;
  }
});
