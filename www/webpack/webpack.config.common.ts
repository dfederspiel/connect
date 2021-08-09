/* eslint-env node */
import { resolve as _resolve } from 'path';

import HtmlWebPackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import IgnoreNotFoundExportPlugin from './plugins/ignore-not-found-export-plugin';

import * as webpack from 'webpack';

const config: webpack.Configuration = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  stats: {
    env: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              exclude: /node_modules/,
              cacheDirectory: true,
              presets: ['@babel/react', ['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: _resolve(__dirname, '../public', 'index.html'),
      favicon: _resolve(__dirname, '../public', 'favicon.ico'),
      filename: './index.html',
    }),
    new IgnoreNotFoundExportPlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ],
};

export default config;
