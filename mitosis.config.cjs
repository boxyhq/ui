/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'src/**',
  dest: '.',
  options: { react: { typescript: true } },
  targets: ['react'],
  exclude: ['src/css.d.ts'],
};
