/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'src/**',
  dest: '.',
  options: {
    react: { typescript: true },
  },
  targets: ['react', 'svelte'],
  exclude: ['src/css.d.ts'],
};
