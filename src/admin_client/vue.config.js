module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'development') {
      config.plugin('html').tap(args => {
        args[0].fbConfig = `
          <script>
            window.__FIREBASE_CONFIG__ = {fbConfig|js|s};
          </script>
        `;
        args[0].template = './src/assets/index.html';
        return args;
      });
    }
  },
  outputDir: '../../dist/src/admin_client',
  baseUrl: process.env.NODE_ENV === 'development' ? '/' : '/admin/',
  assetsDir: 'public'
};
