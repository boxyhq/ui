/** @type {import('@builder.io/mitosis').MitosisConfig} */

const VUE_OPTIONS = {
  typescript: false,
  api: 'composition',
};

module.exports = {
  files: 'src/**',
  dest: '.',
  options: {
    react: { typescript: false },
    vue: VUE_OPTIONS,
    vue2: VUE_OPTIONS,
    svelte: { typescript: false },
  },
  targets: ['react', 'vue', 'vue2', 'svelte'],
  getTargetPath: ({ target }) => {
    switch (target) {
      case 'vue3':
        return 'vue';

      default:
        return target;
    }
  },
  exclude: ['src/css.d.ts'],
};
