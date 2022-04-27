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
  encodedMap,
  decodedMap,
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
          if (seg.length === 1) addSegment(map, i, seg[0]);
          else if (seg.length === 4) addSegment(map, i, seg[0], sources[seg[1]], seg[2], seg[3]);
          else addSegment(map, i, seg[0], sources[seg[1]], seg[2], seg[3], names[seg[4]]);
        }
      }
    })
    .add('gen-mapping:      addMapping', () => {
      const map = new GenMapping();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          if (seg.length === 1) {
            addMapping(map, {
              generated: { line: i + 1, column: seg[0] },
              source: seg.length === 1 ? undefined : sources[seg[1]],
              original: seg.length === 1 ? undefined : { line: seg[2] + 1, column: seg[3] },
              name: seg.length !== 5 ? undefined : names[seg[4]],
            });
          } else if (seg.length === 4) {
            addMapping(map, {
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: undefined,
            });
          } else {
            addMapping(map, {
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: names[seg[4]],
            });
          }
        }
      }
    })
    .add('source-map-js:    addMapping', () => {
      const map = new SourceMapGeneratorJs();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          if (seg.length === 1) {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: seg.length === 1 ? undefined : sources[seg[1]],
              original: seg.length === 1 ? undefined : { line: seg[2] + 1, column: seg[3] },
              name: seg.length !== 5 ? undefined : names[seg[4]],
            });
          } else if (seg.length === 4) {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: undefined,
            });
          } else {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: names[seg[4]],
            });
          }
        }
      }
    })
    .add('source-map-0.6.1: addMapping', () => {
      const map = new SourceMapGenerator061();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          if (seg.length === 1) {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: seg.length === 1 ? undefined : sources[seg[1]],
              original: seg.length === 1 ? undefined : { line: seg[2] + 1, column: seg[3] },
              name: seg.length !== 5 ? undefined : names[seg[4]],
            });
          } else if (seg.length === 4) {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: undefined,
            });
          } else {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: names[seg[4]],
            });
          }
        }
      }
    })
    .add('source-map-0.8.0: addMapping', () => {
      const map = new SourceMapGeneratorWasm();
      for (let i = 0; i < mappings.length; i++) {
        const line = mappings[i];
        for (let j = 0; j < line.length; j++) {
          const seg = line[j];
          if (seg.length === 1) {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: seg.length === 1 ? undefined : sources[seg[1]],
              original: seg.length === 1 ? undefined : { line: seg[2] + 1, column: seg[3] },
              name: seg.length !== 5 ? undefined : names[seg[4]],
            });
          } else if (seg.length === 4) {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: undefined,
            });
          } else {
            map.addMapping({
              generated: { line: i + 1, column: seg[0] },
              source: sources[seg[1]],
              original: { line: seg[2] + 1, column: seg[3] },
              name: names[seg[4]],
            });
          }
        }
      }
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

  const consumer = new SourceMapConsumer(map);
  const smgjs = SourceMapGeneratorJs.fromSourceMap(consumer);
  const smg061 = SourceMapGenerator061.fromSourceMap(consumer);
  const smgWasm = SourceMapGeneratorWasm.fromSourceMap(consumer);
  const genmap = new GenMapping({ file: map.file, sourceRoot: map.sourceRoot });
  for (let i = 0; i < mappings.length; i++) {
    const line = mappings[i];
    for (let j = 0; j < line.length; j++) {
      const seg = line[j];
      if (seg.length === 1) addSegment(genmap, i, seg[0]);
      else if (seg.length === 4) addSegment(genmap, i, seg[0], sources[seg[1]], seg[2], seg[3]);
      else addSegment(genmap, i, seg[0], sources[seg[1]], seg[2], seg[3], names[seg[4]]);
    }
  }

  new Benchmark.Suite()
    .add('gen-mapping:      decoded output', () => {
      decodedMap(genmap);
    })
    .add('gen-mapping:      encoded output', () => {
      encodedMap(genmap);
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
    .on('error', ({ error }) => console.error(error))
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
