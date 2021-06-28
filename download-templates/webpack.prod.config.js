const baseConfig = require("./webpack.base.config");
const path = require("path");
const merge = require("webpack-merge").smart;
const TerserWebpackPlugin = require("terser-webpack-plugin");
//抽离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const prodConfig = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: [
          "style-loader", 
          //使用style-loader css样式会被打包到html的style标签里
          // MiniCssExtractPlugin.loader,  
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    //抽离css到css文件夹
    // new MiniCssExtractPlugin({
    //   filename: "css/main.[contentHash:8].css", //[contentHash:8]  8位的内容hash
    // }),
  ],
  //优化
  optimization: {
    //配置生产环境的压缩方案
    minimizer: [
      //压缩js
      new TerserWebpackPlugin({
        //加快打包速度
        cache: true,
        terserOptions: {
          compress: {
            unused: true,
            drop_debugger: true,
            drop_console: true,
            dead_code: true,
          },
        },
        //sourceMap: true   //如果生产环境要生成sourceMap需要在TerserWebpackPlugin里添加配置
      }),
      //压缩css
      new OptimizeCssAssetsWebpackPlugin(),
    ],
    //代码分割
    splitChunks: {
      chunks: "all",
      minSize: 30000, // 模块的最小体积
      minChunks: 1, // 模块的最小被引用次数
      maxAsyncRequests: 5, // 按需加载的最大并行请求数
      maxInitialRequests: 3, // 一个入口最大并行请求数
      automaticNameDelimiter: "~", // 文件名的连接符
      name: true,
      cacheGroups: {
        // 缓存组
        vendors: {
          name: "vendor",
          priority: 1,
          test: /[\\/]node_modules[\\/]/,
          minSize: 0,
          minChunks: 1,
        },
        common: {
          name: "common",
          priority: 0,
          minSize: 0,
          minChunks: 2,
        },
      },
    },
  },
  output: {
    path: path.join(__dirname, "dist"), //必须是绝对路径
    filename: "[name].[contentHash:8].js", //打包文件名
  },
};

module.exports = merge(baseConfig, prodConfig);
