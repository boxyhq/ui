import { defineConfig } from 'vitepress';
import * as path from 'path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'boxyhq-ui',
  description: 'UI components for Vue.js',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/sso' },
    ],

    sidebar: [
      {
        text: 'Components',
        items: [{ text: 'SSO Login', link: '/components/sso' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/boxyhq/ui' }],
  },
  vite: {
    resolve: {
      alias: {
        '@boxyhq/vue-ui/sso': path.join(__dirname, '../../dist/sso'),
      },
    },
  },
});
