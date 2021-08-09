import { merge } from 'webpack-merge';

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.prod';

export default merge(baseConfig, {
  plugins: [new BundleAnalyzerPlugin()],
});
