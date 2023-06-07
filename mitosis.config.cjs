const getTargetPath = ({ target }) => {
  switch (target) {
    case 'vue3':
      return 'vue';
    // Tweak the folder structure for the angular generated component
    // so that the generated output is included in the rootDirectory of the angular library
    case 'angular':
      return 'angular/projects/boxyhq/angular-ui/lib';
    default:
      return target;
  }
};

/** @type {import('@builder.io/mitosis').MitosisConfig} */

const VUE_OPTIONS = {
  typescript: false,
  api: 'composition',
};

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
                // Split code for disableButton logic and replace
                // value of state isProcessing with null
                const splitDisableButton = json.state.disableButton.code.split('\n');
                const elementToBeReplaced = splitDisableButton[1].replace('state.isProcessing', 'null');

                splitDisableButton[1] = elementToBeReplaced;

                const newDisableButtonLogic = splitDisableButton.join('\n');
                json.state.disableButton.code = newDisableButtonLogic;

                // Remove second argument from the cssClassAssembler function
                // split code that is present in classes with a new line
                const splitStateClasses = json.state.classes.code.split('\n');
                let replacedArray = [];

                // Map over the splitted array and remove the second argument from the cssClassAssembler
                // push this in a new array named replacedArray
                splitStateClasses.map((el, i) => {
                  replacedValue = el.replace(/(\w+)\(([^,]+),([^)]+)\)/, '$1($2)');
                  replacedArray.push(replacedValue);
                });
                const newClassesCode = replacedArray.join('\n');
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
            post: (code) => {
              // Add a styleUrls that links all default styles for the component
              // split code with a ',\n' character
              const splitAngularCode = code.split(',\n');
              let updatedAngularCode = [];

              // Map through the splitted array and replace any instances of
              // 'standalone: true' with `standalone: true,\n  styleUrls: ['../../../login.component.css']`
              splitAngularCode.map((el) => {
                const replacedCodeSnippet = el.replace(
                  'standalone: true',
                  `standalone: true,\n  styleUrls: ['../../../login.component.css']`
                );
                el = replacedCodeSnippet;
                updatedAngularCode.push(el);
              });
              const updatedCode = updatedAngularCode.join(',\n');
              // Reassign code with the value of updatedCode
              code = updatedCode;

              // Map types for the Output event emitter onSubmit
              // Loop through the splitted array and replace any instances of
              // 'EventEmitter()' with the appropriate types with reference to the types.ts file
              let newCode = [];
              code.split('\n').map((el) => {
                const replacedCodeSnippet = el.replace(
                  'EventEmitter()',
                  `EventEmitter<{
    ssoIdentifier: string;
    cb: (err: { error: { message: string } } | null) => void;
  }>()`
                );
                el = replacedCodeSnippet;
                newCode.push(el);
              });

              // Reassign code with the value of newCode
              code = newCode.join('\n');

              return code;
            },
          },
        }),
      ],
    },
    vue: VUE_OPTIONS,
    vue2: VUE_OPTIONS,
  },
  options: {
    react: { typescript: false },
  },
  targets: ['react', 'angular', 'vue', 'vue2'],
  exclude: ['src/css.d.ts'],
};
