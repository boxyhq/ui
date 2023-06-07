const { defineConfig } = require('@vue/cli-service');
const path = require('path');
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@boxyhq/vue2-ui/sso': path.resolve(__dirname, 'dist/sso'),
      },
    },
  },
  outputDir: 'docs-build',
});
