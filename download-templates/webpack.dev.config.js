const baseConfig = require("./webpack.base.config.js");
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge").smart;
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const devConfig = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"], //根据环境做css兼容处理 也可以在postcss.config.js中添加
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },

  output: {
    path: path.join(__dirname, "dist"), //输出资源的公共目录,必须是绝对路径
    filename: "[name][hash].js", //打包文件名(指定名称+目录)
    publicPath: "/",        //所有资源引入公共路径前缀
    chunkFilename: "[name]_chunk.js",   //非入口chunk名称
    library: "[name]", //整个库对外暴露的变量名
    /**
     * libraryTarget为window   变量名添加到browser  
     * libraryTarget为global   变量名添加到node
     */
    // libraryTarget: "commonjs"

  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    //告诉webpacj哪些库不参与打包,同时使用时的名称也得变
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dll/manifest.json"),
    }),
    //将某个文件打包输出,并在html中自动引用改资源
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, "dll/jquery.js"),
    }),
  ],
  devServer: {
    hot: true,
    port: 3000,
    open: true
  }
};

module.exports = merge(baseConfig, devConfig);
