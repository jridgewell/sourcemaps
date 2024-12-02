import { readFileSync } from 'node:fs';
import { SourceMapConsumer, type RawSourceMap } from 'source-map';
import remapping from '../../../src/remapping';
import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function read(filename: string): string {
  return readFileSync(`${__dirname}/files/${filename}`, 'utf8');
}

describe('transpile then minify', () => {
  it('minify a transpiled source map', () => {
    const map = read('helloworld.min.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    const consumer = new SourceMapConsumer(remapped as unknown as RawSourceMap);
    const alert = consumer.originalPositionFor({
      column: 47,
      line: 16,
    });
    assert.deepEqual(alert, {
      column: 20,
      line: 19,
      name: 'alert',
      source: 'helloworld.mjs',
    });
  });

  it('inherits sourcesContent of original source', () => {
    const map = read('helloworld.min.js.map');
    const remapped = remapping(map, (file) => {
      return file.endsWith('.mjs') ? null : read(`${file}.map`);
    });

    assert.deepEqual(remapped.sourcesContent, [read('helloworld.mjs')]);
  });
});
