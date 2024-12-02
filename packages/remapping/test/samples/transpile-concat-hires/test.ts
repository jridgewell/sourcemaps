import { readFileSync } from 'node:fs';
import { SourceMapConsumer, type RawSourceMap } from 'source-map';
import remapping from '../../../src/remapping';
import { assertMatchObject } from '../../unit/util';
import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('transpile then concatenate', () => {
  it('concated sections point to source files', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);
    // the foo in bundle.js
    for (let j = 10; j <= 12; j++) {
      const foo = consumer.originalPositionFor({
        column: j,
        line: 17,
      });
      assertMatchObject(foo, {
        column: 18,
        line: 17,
        source: 'main.mjs',
      });
    }

    // the bar in bundle.js
    for (let j = 10; j <= 12; j++) {
      const bar = consumer.originalPositionFor({
        column: j,
        line: 36,
      });
      assertMatchObject(bar, {
        column: 18,
        line: 17,
        source: 'placeholder.mjs',
      });
    }

    //the baz in bundle.js
    for (let j = 10; j <= 12; j++) {
      const baz = consumer.originalPositionFor({
        column: j,
        line: 43,
      });
      assertMatchObject(baz, {
        column: 18,
        line: 21,
        source: 'main.mjs',
      });
    }
  });

  it('inherits sourcesContent of original sources', () => {
    const map = read('bundle.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    assert.deepEqual(remapped.sourcesContent, [read('main.mjs'), read('placeholder.mjs')]);
  });
});
