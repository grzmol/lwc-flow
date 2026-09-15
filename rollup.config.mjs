/**
 * Demo bundle for GitHub Pages.
 *
 * The components under `force-app/main/default/lwc` import nothing from
 * `lightning/*` or `@salesforce/*`, so the same source that deploys to an org
 * compiles straight for the browser: no shim layer, no second copy.
 *
 * Two resolution details are forced by the Salesforce layout:
 *
 * - Namespace `c` has no namespace directory on disk - the platform implies it
 *   - which `@lwc/module-resolver`'s `dir` record cannot express (it wants
 *   `<dir>/<namespace>/<name>`). Every bundle is therefore registered as an
 *   alias record.
 * - `lwc` must resolve to the engine matching the compiler that compiles the
 *   components. The plugin's default (`{ npm: '@lwc/engine-dom' }`) resolves
 *   from the repo root, where `sfdx-lwc-jest` hoists an older engine, so it is
 *   replaced with the copy owned by the `lwc` package.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import lwc from '@lwc/rollup-plugin';

const require = createRequire(import.meta.url);
const root = path.dirname(fileURLToPath(import.meta.url));

const COMPONENT_DIR = path.join(root, 'force-app/main/default/lwc');
const DEMO_MODULES_DIR = path.join(root, 'demo/modules');
const OUT_DIR = path.join(root, 'dist/demo');
const STATIC_FILES = ['index.html', 'demo.css', '.nojekyll'];

/** `c/flow` -> `force-app/main/default/lwc/flow/flow.js`, for every bundle. */
function namespaceAliases(dir, namespace) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: `${namespace}/${entry.name}`,
      path: path.join(dir, entry.name, `${entry.name}.js`),
    }))
    .filter((record) => fs.existsSync(record.path));
}

const engineDom = createRequire(require.resolve('lwc')).resolve('@lwc/engine-dom');

/*
 * The engine ships one dist that branches on `process.env.NODE_ENV`, which does
 * not exist in a browser: left alone the bundle throws on its first line. Fixing
 * the constant also lets Rollup drop the development-only branches.
 */
const defineNodeEnv = {
  name: 'define-node-env',
  transform(code) {
    if (!code.includes('process.env.NODE_ENV')) {
      return null;
    }

    return { code: code.replace(/process\.env\.NODE_ENV/g, JSON.stringify('production')), map: null };
  },
};

/** Copy the page shell beside the bundle; nothing here needs transforming. */
const copyStatic = {
  name: 'copy-demo-static',
  writeBundle() {
    for (const file of STATIC_FILES) {
      const from = path.join(root, 'demo', file);

      if (fs.existsSync(from)) {
        fs.copyFileSync(from, path.join(OUT_DIR, file));
      } else {
        fs.writeFileSync(path.join(OUT_DIR, file), '');
      }
    }
  },
};

export default {
  input: path.join(root, 'demo/main.js'),
  output: {
    file: path.join(OUT_DIR, 'demo.js'),
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    lwc({
      rootDir: DEMO_MODULES_DIR,
      modules: namespaceAliases(COMPONENT_DIR, 'c'),
      defaultModules: [{ name: 'lwc', path: engineDom }],
      /*
       * `c/flowNodeWrapper` instantiates the node type with `lwc:is`, which is
       * why its bundle declares the `lightning__dynamicComponent` capability.
       */
      enableDynamicComponents: true,
      // The engine is already compiled; running the component compiler over it
      // would be both pointless and slow.
      exclude: ['**/node_modules/**'],
    }),
    defineNodeEnv,
    copyStatic,
  ],
};
