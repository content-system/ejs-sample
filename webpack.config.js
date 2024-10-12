const webpack = require("webpack"),
  path = require("path"),
  BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
  target: "node",
  entry: "./server.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }), new BundleAnalyzerPlugin()],
}
