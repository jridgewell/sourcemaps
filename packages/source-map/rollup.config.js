import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const packageDependencies = JSON.parse(fs.readFileSync('./package.json')).dependencies;

function configure(mode) {
  let output;
  switch(mode) {
    case 'browser':
      output = {
        format: 'umd',
        name: 'sourceMap',
        dir: 'dist',
        entryFileNames: '[name].umd.js',
        sourcemap: true,
        exports: 'named',
        globals: {
          '@jridgewell/gen-mapping': 'genMapping',
          '@jridgewell/trace-mapping': 'traceMapping',
        },
      }
      break;
    case 'esm':
      output = { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true };
      break;
    case 'cjs':
      output = { format: 'commonjs', dir: 'dist', entryFileNames: '[name].cjs', sourcemap: true };
      break;
  }

  return {
    input: 'src/source-map.ts',
    output,
    external: mode == 'browser' ? [] : Object.keys(packageDependencies),
    plugins: [
      typescript({
        tsconfig: './tsconfig.build.json',
        tslib: './throw-when-needed',
      }),
      nodeResolve(),
    ],
    watch: {
      include: 'src/**',
    },
  };
}

export default [configure('browser'), configure('esm'), configure('cjs')];
