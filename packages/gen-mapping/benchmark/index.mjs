/* eslint-env node */

import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import Benchmark from 'benchmark';
import { decode } from '@jridgewell/sourcemap-codec';
import {
  GenMapping,
  addSegment,
  addMapping,
  toEncodedMap,
  toDecodedMap,
  fromMap,
} from '../dist/gen-mapping.mjs';
import { SourceMapGenerator as SourceMapGeneratorJs, SourceMapConsumer } from 'source-map-js';
import { SourceMapGenerator as SourceMapGenerator061 } from 'source-map';
import { SourceMapGenerator as SourceMapGeneratorWasm } from 'source-map-wasm';

const dir = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)));

console.log(`node ${process.version}\n`);

async function bench(file) {
  const map = JSON.parse(readFileSync(join(dir, file)));
  const { sources, names } = map;
  const mappings = decode(map.mappings);

  new Benchmark.Suite()
    .add('gen-mapping:      addSegment', () => {
      const map = new GenMapping();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          let source, sourceLine, sourceColumn, name;
          const genColumn = seg[0];
          if (seg.length !== 1) {
            source = sources[seg[1]];
            sourceLine = seg[2];
            sourceColumn = seg[3];
            if (seg.length === 5) name = names[seg[4]];
          }
          addSegment(map, i, genColumn, source, sourceLine, sourceColumn, name);
        }
      }
    })
    .add('gen-mapping:      addMapping', () => {
      const map = new GenMapping();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          const mapping = {
            generated: { line: i + 1, column: seg[0] },
            source: undefined,
            original: undefined,
            name: undefined,
          };
          if (seg.length !== 1) {
            mapping.source = sources[seg[1]];
            mapping.original = { line: seg[2] + 1, column: seg[3] };
            if (seg.length === 5) mapping.name = names[seg[4]];
          }
          addMapping(map, mapping);
        }
      }
    })
    .add('source-map-js:    addMapping', () => {
      const map = new SourceMapGeneratorJs();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          const mapping = {
            generated: { line: i + 1, column: seg[0] },
            source: undefined,
            original: undefined,
            name: undefined,
          };
          if (seg.length !== 1) {
            mapping.source = sources[seg[1]];
            mapping.original = { line: seg[2] + 1, column: seg[3] };
            if (seg.length === 5) mapping.name = names[seg[4]];
          }
          map.addMapping(mapping);
        }
      }
    })
    .add('source-map-0.6.1: addMapping', () => {
      const map = new SourceMapGenerator061();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          const mapping = {
            generated: { line: i + 1, column: seg[0] },
            source: undefined,
            original: undefined,
            name: undefined,
          };
          if (seg.length !== 1) {
            mapping.source = sources[seg[1]];
            mapping.original = { line: seg[2] + 1, column: seg[3] };
            if (seg.length === 5) mapping.name = names[seg[4]];
          }
          map.addMapping(mapping);
        }
      }
    })
    .add('source-map-0.8.0: addMapping', () => {
      const map = new SourceMapGeneratorWasm();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          const mapping = {
            generated: { line: i + 1, column: seg[0] },
            source: undefined,
            original: undefined,
            name: undefined,
          };
          if (seg.length !== 1) {
            mapping.source = sources[seg[1]];
            mapping.original = { line: seg[2] + 1, column: seg[3] };
            if (seg.length === 5) mapping.name = names[seg[4]];
          }
          map.addMapping(mapping);
        }
      }
    })

    // add listeners
    .on('error', (event) => console.error(event.target.error))
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({});

  console.log('');

  const consumer = new SourceMapConsumer(map);
  const genmap = fromMap(map);
  const smgjs = SourceMapGeneratorJs.fromSourceMap(consumer);
  const smg061 = SourceMapGenerator061.fromSourceMap(consumer);
  const smgWasm = SourceMapGeneratorWasm.fromSourceMap(consumer);

  new Benchmark.Suite()
    .add('gen-mapping:      decoded output', () => {
      toDecodedMap(genmap);
    })
    .add('gen-mapping:      encoded output', () => {
      toEncodedMap(genmap);
    })
    .add('source-map-js:    encoded output', () => {
      smgjs.toJSON();
    })
    .add('source-map-0.6.1: encoded output', () => {
      smg061.toJSON();
    })
    .add('source-map-0.8.0: encoded output', () => {
      smgWasm.toJSON();
    })
    // add listeners
    .on('error', (event) => console.error(event.target.error))
    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({});
}

async function run(files) {
  let first = true;
  for (const file of files) {
    if (!file.endsWith('.map')) continue;

    if (!first) console.log('\n***\n');
    first = false;

    console.log(file);
    await bench(file);
  }
}
run(readdirSync(dir));
