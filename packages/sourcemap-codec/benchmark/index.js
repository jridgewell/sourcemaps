/* eslint-env node */

const { readdirSync, readFileSync } = require('fs');
const { dirname, join, relative } = require('path');
const Benchmark = require('benchmark');
const latest = require('../');
const sourcemapCodec = require('sourcemap-codec');

const dir = relative(process.cwd(), __dirname);

function bench(file) {
  const map = JSON.parse(readFileSync(join(dir, file)));
  const encoded = map.mappings;
  const decoded = latest.decode(encoded);

  new Benchmark.Suite()
    .add('decode (latest)         ', () => {
      latest.decode(encoded);
    })
    .add('decode (sourcemap-codec)', () => {
      sourcemapCodec.decode(encoded);
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

  new Benchmark.Suite()
    .add('encode (latest)         ', () => {
      latest.encode(decoded);
    })
    .add('encode (sourcemap-codec)', () => {
      sourcemapCodec.encode(decoded);
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

const files = readdirSync(dir);
let first = true;
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  if (!file.endsWith('.map')) continue;

  if (!first) console.log('\n***\n');
  first = false;

  console.log(file);
  bench(file);
}
