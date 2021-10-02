const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPostProcessPlugin = require('./webpack-custom-plugins/manifest-post-process');

module.exports = {
  entry: {
    // Each page's index.ts should be listed here
    'all-pages': './src/pages/all-pages/index.ts',
    company: './src/pages/company/index.ts',
    background: './src/background.ts'
  },
  output: {
    // Will output the js files to dist/scripts
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].js'
  },
  resolve: {
    // Above will work only on ts files
    extensions: ['.ts']
  },
  plugins: [
    // Copies files as is to dist
    new CopyWebpackPlugin({
      patterns: [
        // Copy manifest
        { from: './src/manifest.jsonc' },
        // Copy font awesome fonts
        {
          from: './node_modules/@fortawesome/fontawesome-free/webfonts',
          to: './webfonts'
        },
        // Copy font awesome all css with file rename
        {
          from: './node_modules/@fortawesome/fontawesome-free/css/all.min.css',
          to: 'font-awesome.css',
          toType: 'template'
        }
      ]
    }),
    // Alters manifest json dynamically and strip comments
    new ManifestPostProcessPlugin()
  ],
  module: {
    rules: [
      // Compiles typescript
      { test: /\.ts?$/, loader: 'ts-loader' },
      // Compiles SCSS and SASS and add dynamic style tags to body
      {
        test: /\.(s(a|c)ss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
