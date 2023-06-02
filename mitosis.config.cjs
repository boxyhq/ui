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

              code.split('\n\n').map((el) => {
                // console.log('----');
                const x = el.replace('node, vars', 'node: any, vars: any');
                // console.log('New new element: ', x);
                // console.log('Old element: ', el);
                el = x;
                updatedCode.push(el);
                // console.log('----');
              });
              code = updatedCode.join('\n\n');
              console.log(updatedCode.join('\n\n'));
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
