import { resolve } from 'path';
import { merge } from 'webpack-merge';
import { Configuration as WebpackConfiguration } from 'webpack';
import Dotenv from 'dotenv-webpack'; // https://www.npmjs.com/package/dotenv-webpack
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import baseConfig from './webpack.config.common';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://api:3000',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://graphql:4000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: [resolve(__dirname, '../src')],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new Dotenv({
      path: 'config.development.env',
    }),
  ],
};

export default merge(baseConfig, config);
