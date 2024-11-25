import * as esbuild from 'esbuild';
import { umdWrapper } from 'esbuild-plugin-umd-wrapper';

const files = process.argv.slice(2);
const umd = process.env.UMD;
if (files.length === 0) {
  throw new Error('must pass filename of entrypoints');
}
if (!umd) {
  throw new Error('must pass UMD=… env');
}

async function build(esm) {
  const build = await esbuild.build({
    entryPoints: files.map((f) => `src/${f}`),
    outdir: 'dist',
    bundle: true,
    sourcemap: 'linked',
    sourcesContent: false,
    format: esm ? 'esm' : 'umd',
    plugins: esm ? [] : [umdWrapper({ libraryName: umd })],
    outExtension: esm ? { '.js': '.mjs' } : { '.js': '.umd.js' },
  });
  console.log(`Compiled ${esm ? 'esm' : 'umd'}`, build);
}

build(true);
build(false);
