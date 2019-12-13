const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (_env, _options) => ({
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  entry: {
    index: "./js/index.js"
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "./build"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        exclude: [/node_modules/],
        use: [
          "style-loader", "css-loader", "sass-loader"
        ]
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
