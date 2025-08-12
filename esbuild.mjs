import { readFileSync } from 'node:fs';
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

const externalSpec = /^[^./]/;

/** @type {esbuild.Plugin} */
const externalize = {
  name: 'externalize',
  setup(build) {
    build.onResolve({ filter: externalSpec }, ({ path }) => {
      if (!external[path]) {
        throw new Error(`unregistered external module "${path}"`);
      }
      return { path, external: true };
    });
  },
};

/** @type {esbuild.Plugin} */
const umd = {
  name: 'umd',
  setup(build) {
    const dependencies = Object.keys(packageJson.dependencies || {});
    const browserDeps = dependencies.map((d) => `global.${external[d]}`);
    const requireDeps = dependencies.map((d) => `require('${d}')`);
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
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(module${requireDeps.join(', ')});
    module.exports = def(module);
  } else if (typeof define === 'function' && define.amd) {
    define(['module'${amdDeps.join(', ')}], function(mod) {
      factory.apply(this, arguments);
      mod.exports = def(mod);
    });
  } else {
    const mod = { exports: {} };
    factory(mod${browserDeps.join(', ')});
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    global.${browserGlobal} = def(mod);
  }
  function def(m) { return 'default' in m.exports ? m.exports.default : m.exports; }
})(this, (function (module${locals.join(', ')}) {
      `.trim(),
    };
    build.initialOptions.footer = {
      js: '}));',
    };

    build.onResolve({ filter: externalSpec }, ({ path }) => {
      if (!external[path]) {
        throw new Error(`unregistered external module "${path}"`);
      }
      return { path, namespace: 'umd' };
    });

    build.onLoad({ filter: /.*/, namespace: 'umd' }, ({ path }) => {
      return {
        contents: `module.exports = require_${external[path]}`,
      };
    });
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
    plugins: esm ? [externalize] : [umd],
    outExtension: esm ? { '.js': '.mjs' } : { '.js': '.umd.js' },
    target: tsconfig.compilerOptions.target,
  });

  if (build.errors.length > 0) {
    for (const message of build.errors) {
      console.error(message);
    }
    process.exit(1);
  }

  console.log(`Compiled ${esm ? 'esm' : 'cjs'}`);
}

build(true);
build(false);
