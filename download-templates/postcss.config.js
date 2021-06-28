const autoprefixer = require("autoprefixer");
module.exports = {
  sourceMap: true,
  plugins: [autoprefixer, require("postcss-preset-env")],
};
