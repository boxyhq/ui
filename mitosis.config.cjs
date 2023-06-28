const getTargetPath = ({ target }) => {
  switch (target) {
    case 'vue3':
      return 'vue';
    // Generate angular artifacts in a temporary folder, then move different entry points to independent folders (by means of scripts)
    // Reference: https://sandroroth.com/blog/angular-library#more-entry-points
    case 'angular':
      return 'angular/projects/boxyhq/angular-ui/tmp';
    case 'svelte':
      return 'svelte/src/tmp';
    default:
      return target;
  }
};

const VUE_OPTIONS = {
  typescript: false,
  api: 'composition',
};

/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: 'src/**',
  dest: '.',
  getTargetPath,
  options: {
    react: { typescript: true },
    angular: {
      standalone: true,
      typescript: true,
      plugins: [
        () => ({
          json: {
            pre: (json) => {
              if (json.name === 'Login') {
                // Replace second argument passed to cssClassAssembler function with literal class name
                // split code that is present in classes with a new line
                const splitStateClasses = json.state.classes.code.split('\n');
                // Map over the splitted array and replace the second argument passed to cssClassAssembler
                const newClasses = splitStateClasses.map((el) => {
                  // replacedValue = el.replace(/(\w+)\(([^,]+),([^)]+)\)/, '$1($2)');
                  return el.replace(/defaultClasses\.(\w+)/, "'$1'");
                });
                const newClassesCode = newClasses.join('\n');
                json.state.classes.code = newClassesCode;

                // Remove extra import defaultClasses
                // filter imports and return only those paths that dont have the path
                // containing './index.module.css'
                const filteredImports = json.imports.filter((imp) => {
                  return imp.path !== './index.module.css';
                });
                json.imports = filteredImports;
              }
            },
          },
          code: {
            pre: (code) => {
              let tweakedCode = code;
              // Add a styleUrls that includes all default styles for the component
              if (tweakedCode.includes('standalone: true')) {
                tweakedCode = tweakedCode.replace(
                  'standalone: true',
                  `standalone: true,\n  styleUrls: ['./index.css']`
                );
              }
              // Add types for the emitted event object
              if (tweakedCode.includes('EventEmitter()')) {
                tweakedCode = tweakedCode.replace(
                  'EventEmitter()',
                  `EventEmitter<{
                  ssoIdentifier: string;
                  cb: (err: { error: { message: string } } | null) => void;
                }>()`
                );
              }
              // Ideally the generated code should use [disabled] instead of [attr.disabled], hence the below transformation is needed.
              if (tweakedCode.includes('[attr.disabled]')) {
                tweakedCode = tweakedCode.replaceAll('[attr.disabled]', '[disabled]');
              }
              return tweakedCode;
            },
          },
        }),
      ],
    },
    vue: { ...VUE_OPTIONS, typescript: true },
    vue2: VUE_OPTIONS,
    svelte: { typescript: true },
  },
  targets: ['react', 'angular', 'vue', 'svelte'],
  exclude: ['src/css.d.ts'],
};
