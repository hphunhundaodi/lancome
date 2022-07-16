const fs = require('fs');

if (process.argv[2] !== 'lint') {
  require('./jifenn-interaction-core/mock')
}

module.exports = {
  css: { extract: false },
  devServer: {
    proxy: {
      'api|activity-api|newenbrands|merchant|sms': {
        // target: 'https://test-s1.enbrands.com/',
        target: 'http://localhost:8989/',
        // target: 'https://test-s2.enbrands.com/',
        // target: 'https://test-s1.zkyai.com/'
        // onProxyReq(proxyReq, req, res){
        //   proxyReq.setHeader('Cookie', fs.readFileSync('./cookies').toString());
        // }
      }
    }
  },
  configureWebpack: {
    externals: {
      vue: 'window.Vue',
      vuex: 'window.Vuex',
      echarts: 'window.echarts',
      'element-ui': 'window.ELEMENT'
    }
  }
}
