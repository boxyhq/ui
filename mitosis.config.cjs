/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'src/**',
  dest: '.',
  options: { react: { typescript: true }, vue: { typescript: true } },
  targets: ['react', 'vue'],
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
