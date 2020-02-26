/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (_env, _options) => ({
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:8080"
    },
    watchOptions: {
      ignored: /node_modules/
    }
  },
  devtool: "source-map",
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "./build"),
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./index.html"
    })
  ]
});
