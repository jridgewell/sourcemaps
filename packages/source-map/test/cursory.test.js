const { SourceMapConsumer, SourceMapGenerator } = require('..');
const assert = require('assert');

it('SourceMapGenerator', () => {
  const smg = new SourceMapGenerator({
    file: 'output.js',
    sourceRoot: 'https://example.com/',
  });

  smg.addMapping({
    generated: { line: 1, column: 0 },
    source: 'input.js',
    original: { line: 1, column: 0 },
    name: 'foo',
  });
  smg.setSourceContent('input.js', 'foobar');

  assert.deepEqual(smg.toJSON(), {
    version: 3,
    file: 'output.js',
    sourceRoot: 'https://example.com/',
    names: ['foo'],
    sources: ['input.js'],
    sourcesContent: ['foobar'],
    mappings: 'AAAAA',
  });

  assert.deepEqual(smg.toDecodedMap(), {
    version: 3,
    file: 'output.js',
    sourceRoot: 'https://example.com/',
    names: ['foo'],
    sources: ['input.js'],
    sourcesContent: ['foobar'],
    mappings: [[[0, 0, 0, 0, 0]]],
  });
});

it('SourceMapConsumer', () => {
  const smc = new SourceMapConsumer({
    version: 3,
    names: ['foo'],
    sources: ['input.js'],
    mappings: 'AAAAA',
  });

  assert.deepEqual(smc.originalPositionFor({ line: 1, column: 0 }), {
    source: 'input.js',
    line: 1,
    column: 0,
    name: 'foo',
  });
});
