import cpy from 'cpy';
import { rimraf } from 'rimraf';

const BASE = `svelte/src`;
const TMP = `${BASE}/tmp/src`;

// Move source code from mitosis build (inside svelte/src/tmp)
// into corresponding svelte src/lib folder
await cpy(`${TMP}/**`, `${BASE}/lib`);
// Delete tmp folder
await rimraf(`${BASE}/tmp`);
