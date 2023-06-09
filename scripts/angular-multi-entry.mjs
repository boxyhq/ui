/** 1. Move each entrypoint folder under angular/projects/boxyhq/angular-ui/tmp/src into
angular/projects/boxyhq/angular-ui

ex:- tmp/src/sso/* -> ./sso/src
 */
import cpy from 'cpy';
import { rimraf } from 'rimraf';

const BASE = `angular/projects/boxyhq/angular-ui`;
const TMP = `${BASE}/tmp/src`;
const ENTRYPOINTS = ['sso'];

// Rename all .module.css files

for (const ep of ENTRYPOINTS) {
  await cpy(`${TMP}/${ep}/**/*.module.css`, `${TMP}/${ep}`, {
    rename: (basename) => basename.replace('.module', ''),
  });
  await rimraf(`${TMP}/${ep}/**/*.module.css`, { glob: true });
}

for (const ep of ENTRYPOINTS) {
  await cpy(`${TMP}/${ep}/**`, `${BASE}/${ep}/src`);
}

await rimraf(`${BASE}/tmp`);
