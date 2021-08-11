import { resolve } from 'path';
import { merge } from 'webpack-merge';
import {
  Configuration as WebpackConfiguration,
  HotModuleReplacementPlugin,
} from 'webpack';
import Dotenv from 'dotenv-webpack'; // https://www.npmjs.com/package/dotenv-webpack
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import baseConfig from './webpack.config.common';

const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient');
const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop');

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    transportMode: 'ws',
    injectClient: false,
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
    app: [webpackDevClientEntry, resolve(__dirname, '../src')],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    plugins: [new ModuleScopePlugin(resolve(__dirname), [reactRefreshOverlayEntry])],
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        entry: webpackDevClientEntry,
        // The expected exports are slightly different from what the overlay exports,
        // so an interop is included here to enable feedback on module-level errors.
        module: reactRefreshOverlayEntry,
        // Since we ship a custom dev client and overlay integration,
        // the bundled socket handling logic can be eliminated.
        sockIntegration: false,
      },
    }),
    new HotModuleReplacementPlugin(),
    new Dotenv({
      path: 'config.development.env',
    }),
  ],
};

export default merge(baseConfig, config);
