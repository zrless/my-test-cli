/**
 * 使用dll技术,对某些库(第三方库:jquery , react ,vue...)进行单独打包
 * 当你运行webpack时,默认查找webpack.config.js配置文件
 * 需求:需要运行webpack.dll.js文件
 * webpack -- config webpack.dll.js
 */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    jquery: ["jQuery"],  //要打包的库
  },
  output: {
    path: path.join(__dirname, "dll"), //必须是绝对路径
    filename: "[name].js", //打包文件名
    library: "[name]_[hash]", //打包的库里面暴露出去的内容名字
  },
  plugins: [
    //打包生成一个manifest.json文件,提供jquery的映射
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "dll/manifest.json"),
    }), //映射库的暴露的内容名称
  ],
  mode: "development",
};