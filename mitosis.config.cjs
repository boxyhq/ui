/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'src/**',
  dest: '.',
  options: {
    react: { typescript: true },
    svelte: {
      typescript: true,
      plugins: [
        () => ({
          code: {
            post: (code) => {
              const updatedCode = [];

              // Split mitosis output code using '\n\n'
              // map through the splitted array and replace every instance of
              // 'node, vars' with 'node: any, vars: any'
              code.split('\n\n').map((el) => {
                const replacedInstance = el.replace('node, vars', 'node: any, vars: any');

                el = replacedInstance;
                updatedCode.push(el);
              });
              code = updatedCode.join('\n\n');

              return code;
            },
          },
        }),
      ],
    },
  },
  targets: ['react', 'svelte'],
  exclude: ['src/css.d.ts'],
};
