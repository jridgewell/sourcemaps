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
    file: 'output.js',
    sourceRoot: 'https://example.com/',
    names: ['foo'],
    sources: ['input.js'],
    sourcesContent: ['foobar'],
    mappings: 'AAAAA',
  });

  assert.equal(smc.file, 'output.js');
  assert.deepEqual(smc.names, ['foo']);
  assert.equal(smc.sourceRoot, 'https://example.com/');
  assert.deepEqual(smc.sources, ['https://example.com/input.js']);
  assert.deepEqual(smc.sourcesContent, ['foobar']);

  assert.deepEqual(smc.originalPositionFor({ line: 1, column: 0 }), {
    source: 'https://example.com/input.js',
    line: 1,
    column: 0,
    name: 'foo',
  });
});
