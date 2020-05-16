module.exports = {
  css: {
    extract: false,
    loaderOptions: {
      scss: {
        prependData: `@import "~@/style/style.scss";`,
      },
    },
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()

    svgRule
      .test(/\.svg$/)
      .use('svg-url-loader') // npm install --save-dev svg-url-loader
      .loader('svg-url-loader')
  },
}
