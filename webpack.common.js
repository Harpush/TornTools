const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    company: './src/pages/company/index.ts',
    background: './src/background.ts'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].js'
  },

  resolve: {
    extensions: ['.ts']
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './src/manifest.json' }]
    })
  ],

  module: {
    rules: [{ test: /\.ts?$/, loader: 'ts-loader' }]
  }
};
