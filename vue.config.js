module.exports = {
  publicPath: '/reading-order/',
  productionSourceMap: false,
  pwa: {
    name: 'Cosmere Reading Order',
    themeColor: '#3A69CF',
    msTileColor: '#3A69CF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'white',
    manifestOptions: {
      background_color: '#FFFFFF',
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
};
