import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = process.cwd();
const files = process.argv.slice(2);
if (files.length === 0) {
  throw new Error('must pass filename of entrypoints');
}

const [tsconfig, packageJson] = [
  readFileSync(`${__dirname}/tsconfig.json`, 'utf8'),
  readFileSync(`${packagePath}/package.json`, 'utf8'),
].map(JSON.parse);

const external = {
  '@jridgewell/gen-mapping': 'genMapping',
  '@jridgewell/remapping': 'remapping',
  '@jridgewell/source-map': 'sourceMap',
  '@jridgewell/sourcemap-codec': 'sourcemapCodec',
  '@jridgewell/trace-mapping': 'traceMapping',
  '@jridgewell/resolve-uri': 'resolveURI',
};

/** @type {esbuild.Plugin} */
const externalize = {
  name: 'externalize',
  setup(build) {
    build.onResolve({ filter: /^[^./]/ }, ({ path }) => {
      if (!external[path]) {
        throw new Error(`unregistered external module "${path}"`);
      }
      return { path, external: true };
    });
  },
};

// Babel still supports Node v6, which doesn't have getOwnPropertyDescriptors.
const getOwnPropertyDescriptorsPolyfill = `if (!Object.getOwnPropertyDescriptors) Object.getOwnPropertyDescriptors = function(value) {
  return Reflect.ownKeys(value).reduce(function (acc, key) {
    Object.defineProperty(acc, key, Object.getOwnPropertyDescriptor(value, key))
    return acc;
  }, {});
}`;

/** @type {esbuild.Plugin} */
const umd = {
  name: 'umd',
  setup(build) {
    const dependencies = Object.keys(packageJson.dependencies || {});
    const browserDeps = dependencies.map((d) => `global.${external[d]}`);
    const requireDeps = dependencies.map((d) => `require_keep('${d}')`);
    const amdDeps = dependencies.map((d) => `'${d}'`);
    const locals = dependencies.map((d) => `require_${external[d]}`);
    const browserGlobal = external[packageJson.name];

    // Babel still supports Node v6, which doesn't support trailing commas, so we prepend an empty
    // item to have it insert a comma after the last item in the static syntax list.
    browserDeps.unshift('');
    requireDeps.unshift('');
    amdDeps.unshift('');
    locals.unshift('');

    build.initialOptions.banner = {
      js: `
(function (global, factory, e, m) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, module${requireDeps}) :
    typeof define === 'function' && define.amd ? define(['exports', 'module'${amdDeps}], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(e = {}, m = { exports: e }${browserDeps}), global.${browserGlobal} = 'default' in m.exports ? m.exports.default : m.exports);
})(this, (function (exports, module${locals}) {
"use strict";
${getOwnPropertyDescriptorsPolyfill}
      `.trim(),
    };
    build.initialOptions.footer = {
      js: '}));',
    };
  },
};

async function build(esm) {
  const build = await esbuild.build({
    entryPoints: files.map((f) => `src/${f}`),
    outdir: 'dist',
    bundle: true,
    sourcemap: 'linked',
    sourcesContent: false,
    format: esm ? 'esm' : 'cjs',
    plugins: esm ? [externalize] : [externalize, umd],
    outExtension: esm ? { '.js': '.mjs' } : { '.js': '.umd.js' },
    target: tsconfig.compilerOptions.target,
    write: false,
  });

  if (build.errors.length > 0) {
    for (const message of build.errors) {
      console.error(message);
    }
    process.exit(1);
  }
  mkdirSync('dist', { recursive: true });

  for (const file of build.outputFiles) {
    if (!file.path.endsWith('.umd.js')) {
      writeFileSync(file.path, file.contents);
      continue;
    }

    const contents = file.text.replace(
      /\brequire(_keep)?\(['"]([^'"]*)['"]\)/g,
      (_match, keep, spec) => {
        return keep ? `require('${spec}')` : `require_${external[spec]}`;
      },
    );
    writeFileSync(file.path, contents);
  }

  console.log(`Compiled ${esm ? 'esm' : 'cjs'}`);
}

build(true);
build(false);
