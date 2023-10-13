const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // The entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // The output directory for bundled files
    filename: '[name].[contenthash].js'
  },
  mode: 'development',
  plugins: [
    new CompressionPlugin(),
    new webpack.DefinePlugin({
      __DEVTOOLS__: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
       {
        test: /\.svg$/,
        use: ['svg-url-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/react-pro-sidebar/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            // Rename variables and functions
            // with meaningless names
            keep_fnames: false,
            keep_classnames: false,
            reserved: ['$super', '$', 'exports', 'require'],
          },
          compress: {
            booleans_as_integers: true,
            drop_console: true,
            drop_debugger: true,
            ecma: 5,
            keep_fargs: false,
            passes: 2,
          },
        },
      }),
    ],
  },
};