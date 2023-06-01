const { defineConfig } = require('@vue/cli-service');
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@boxyhq/vue2-ui/sso': path.resolve(__dirname, 'dist/sso'),
      },
    },
  },
});
