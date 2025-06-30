import { readFileSync, writeFileSync } from 'node:fs';
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

/** @type {esbuild.Plugin} */
const umd = {
  name: 'umd',
  setup(build) {
    const dependencies = Object.keys(packageJson.dependencies || {});
    const browserDeps = dependencies.map((d) => `global.${external[d]}`).join(', ');
    const requireDeps = dependencies.map((d) => `require('${d}')`).join(', ');
    const amdDeps = dependencies.map((d) => `'${d}'`).join(', ');
    const locals = dependencies.map((d) => `require_${external[d]}`).join(', ');
    const browserGlobal = external[packageJson.name];

    build.initialOptions.banner = {
      js: `
(function (global, factory, e, m) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, module, ${requireDeps}) :
    typeof define === 'function' && define.amd ? define(['exports', 'module', ${amdDeps}], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(e = {}, m = { exports: e }, ${browserDeps}), global.${browserGlobal} = 'default' in m.exports ? m.exports.default : m.exports);
})(this, (function (exports, module, ${locals}) {
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

  for (const file of build.outputFiles) {
    if (!file.path.endsWith('.umd.js')) {
      writeFileSync(file.path, file.contents);
      continue;
    }

    const contents = file.text.replace(/\brequire\(['"]([^'"]*)['"]\)/g, (_match, spec) => {
      return `require_${external[spec]}`;
    });
    writeFileSync(file.path, contents);
  }

  console.log(`Compiled ${esm ? 'esm' : 'cjs'}`);
}

build(true);
build(false);
