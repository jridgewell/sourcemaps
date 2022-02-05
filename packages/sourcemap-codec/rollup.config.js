import typescript from '@rollup/plugin-typescript';

function configure(esm) {
  return {
    input: 'src/sourcemap-codec.ts',
    output: esm
      ? {
          format: 'es',
          dir: 'dist',
          entryFileNames: '[name].mjs',
          sourcemap: true,
          exports: 'named',
        }
      : {
          format: 'umd',
          name: 'sourcemapCodec',
          dir: 'dist',
          entryFileNames: '[name].umd.js',
          sourcemap: true,
          exports: 'named',
        },
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
    watch: {
      include: 'src/**',
    },
  };
}

export default [configure(false), configure(true)];
