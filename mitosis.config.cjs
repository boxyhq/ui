/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'src/**',
  dest: '.',
  options: {
    react: { typescript: true },
    vue: { typescript: true, api: 'composition' },
    vue2: {
      typescript: false,
      api: 'composition',
    },
  },
  targets: ['react', 'vue', 'vue2'],
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
