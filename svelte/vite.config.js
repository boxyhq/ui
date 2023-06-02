import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // use vite library mode to build the package
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: resolve(__dirname, 'src/sso/index.ts'),
      name: 'BoxyHQUI',
      // the proper extensions will be added
      fileName: '@boxyhq/svelte-ui',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['svelte'],
      output: {
        globals: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          svelte: 'Svelte',
        },
      },
    },
  },
  plugins: [sveltekit()],
});
