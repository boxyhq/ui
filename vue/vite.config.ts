import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'node:path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    // use vite library mode to build the package
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: {
        sso: resolve(__dirname, 'src/sso/index.ts'),
        shared: resolve(__dirname, 'src/shared/index.ts'),
      },
      name: 'BoxyHQUI',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: function customJsAssetsfilterFunction(outputChunk) {
        // console.log(outputChunk.fileName, outputChunk.name);
        const entryPoints = ['sso', 'shared', 'index'];
        // TODO: at the moment this plugin injects all styles into every file instead of splitting by entry point, also look into styles not being injected into sso.cjs
        return entryPoints.includes(outputChunk.name);
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
