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
  '@ampproject/remapping': 'remapping',
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

/** @type {esbuild.Plugin} */
const umd = {
  name: 'umd',
  setup(build) {
    const dependencies = Object.keys(packageJson.dependencies || {}).map((d) => {
      return `"${d}": global.${external[d]}`;
    });

    build.initialOptions.banner = {
      js: `
(function (global, factory, e, m) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require, exports, module) :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(function(spec) {
        return {${dependencies.join(', ')}}[spec];
    }, e = {}, m = { exports: e }), global.${external[packageJson.name]} = m.exports);
})(this, (function (require, exports, module) {
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
