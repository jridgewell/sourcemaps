/* eslint-env node */

const { readdirSync, readFileSync } = require('fs');
const { dirname, join, relative } = require('path');
const Benchmark = require('benchmark');
const sourcemapCodec = require('../');
const originalSourcemapCodec = require('sourcemap-codec');
const sourceMap061 = require('source-map');
const sourceMapWasm = require('source-map-wasm');

const dir = relative(process.cwd(), __dirname);

console.log(`node ${process.version}\n`);

async function bench(file) {
  const map = JSON.parse(readFileSync(join(dir, file)));
  const encoded = map.mappings;
  const decoded = sourcemapCodec.decode(encoded);
  const consumer061 = new sourceMap061.SourceMapConsumer(map);
  const consumerWasm = await new sourceMapWasm.SourceMapConsumer(map);

  new Benchmark.Suite()
    .add('decode: @jridgewell/sourcemap-codec', () => {
      sourcemapCodec.decode(encoded);
    })
    .add('decode: sourcemap-codec', () => {
      originalSourcemapCodec.decode(encoded);
    })
    .add('decode: source-map-0.6.1', () => {
      consumer061._parseMappings(encoded, '');
    })
    .add('decode: source-map-0.8.0', () => {
      consumerWasm._parseMappings(encoded, '');
      consumerWasm.destroy();
    })
    // add listeners
    .on('error', ({ error }) => console.error(error))
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({});

  console.log('');

  const generator061 = sourceMap061.SourceMapGenerator.fromSourceMap(consumer061);
  const generatorWasm = sourceMapWasm.SourceMapGenerator.fromSourceMap(
    await new sourceMapWasm.SourceMapConsumer(map),
  );

  new Benchmark.Suite()
    .add('encode: @jridgewell/sourcemap-codec', () => {
      sourcemapCodec.encode(decoded);
    })
    .add('encode: sourcemap-codec', () => {
      originalSourcemapCodec.encode(decoded);
    })
    .add('encode: source-map-0.6.1', () => {
      generator061._serializeMappings();
    })
    .add('encode: source-map-0.8.0', () => {
      generatorWasm._serializeMappings();
    })
    // add listeners
    .on('error', ({ error }) => console.error(error))
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({});
}

(async () => {
  const files = readdirSync(dir);
  let first = true;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.endsWith('.map')) continue;

    if (!first) console.log('\n***\n');
    first = false;

    console.log(file);
    await bench(file);
  }
})();
