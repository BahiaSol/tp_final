const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig ({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api-restdb': {
        target: 'https://laboratorio3-f36a.restdb.io/rest',
        changeOrigin: true,
        pathRewrite: { '^/api-restdb': '' }
      },
      '/api': {
        target: 'https://cryptoya.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})