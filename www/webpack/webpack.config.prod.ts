import { resolve } from 'path';

import { merge } from 'webpack-merge';

import { Configuration } from 'webpack';
import Dotenv from 'dotenv-webpack'; // https://www.npmjs.com/package/dotenv-webpack
import TerserJSPlugin from 'terser-webpack-plugin';
import baseConfig from './webpack.config.common';

const config: Configuration = {
  mode: 'production',
  entry: {
    production: resolve(__dirname, '../src'),
  },
  output: {
    path: resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  optimization: {
    minimizer: [new TerserJSPlugin({})],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new Dotenv({
      path: 'config.production.env',
    }),
  ],
};

export default merge(baseConfig, config);
