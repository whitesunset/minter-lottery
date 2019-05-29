module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  productionSourceMap: false,
  css: {
    extract: true
  },
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  }
};
