
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {   
  devServer: {
    proxy: {
      '/work': {
        target : 'http://172.26.16.213:8080',
        changeOrigin: true
      },
      '/post': {
        target : 'http://172.26.16.213:8080',
        changeOrigin: true
      }
    }
  }
};
