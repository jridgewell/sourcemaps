import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

function configure(esm) {
  return {
    input: 'src/source-map.ts',
    output: esm
      ? { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true }
      : {
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
        },
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

export default [configure(false), configure(true)];
