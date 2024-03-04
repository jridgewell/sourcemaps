const { SourceMapConsumer, SourceMapGenerator } = require('../src/source-map');
const fixtures = require('./fixtures');
const utils = require('./utils')
const assert = require('assert');

it('SourceMapGenerator.setSourceContent', function () {
  var map = new SourceMapGenerator({
    file: 'min.js',
    sourceRoot: '/the/root'
  });
  map.addMapping({
    generated: { line: 1, column: 1 },
    original: { line: 1, column: 1 },
    source: 'one.js'
  });
  map.addMapping({
    generated: { line: 2, column: 1 },
    original: { line: 1, column: 1 },
    source: 'two.js'
  });
  map.setSourceContent('one.js', 'one file content');

  map = JSON.parse(map.toString());
  assert.equal(map.sources[0], 'one.js');
  assert.equal(map.sources[1], 'two.js');
  assert.equal(map.sourcesContent[0], 'one file content');
  assert.equal(map.sourcesContent[1], null);
});

describe('SourceMapGenerator.addMapping', () => {
  it('test adding mappings (case 1)', () => {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 }
      });
    });
  });

  it('test adding mappings (case 2)', () => {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        source: 'bar.js',
        original: { line: 1, column: 1 }
      });
    });
  });

  it('test adding mappings (case 3)', () => {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        source: 'bar.js',
        original: { line: 1, column: 1 },
        name: 'someToken'
      });
    });
  });

  it('test adding mappings (invalid)', () => {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    // Not enough info.
    assert.throws(function () {
      map.addMapping({});
    });

    // Original file position, but no source.
    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        original: { line: 1, column: 1 }
      });
    });

  });

  it('test adding mappings with skipValidation', () => {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
      skipValidation: true
    });

    // Not enough info, caught by `util.getArgs`
    assert.throws(function () {
      map.addMapping({});
    });

    // Original file position, but no source. Not checked.
    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        original: { line: 1, column: 1 }
      });
    });
  });

  it('test that the correct mappings are being generated', () => {
    var map = new SourceMapGenerator({
      file: 'min.js',
      sourceRoot: '/the/root'
    });

    map.addMapping({
      generated: { line: 1, column: 1 },
      original: { line: 1, column: 1 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 5 },
      original: { line: 1, column: 5 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 9 },
      original: { line: 1, column: 11 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 18 },
      original: { line: 1, column: 21 },
      source: 'one.js',
      name: 'bar'
    });
    map.addMapping({
      generated: { line: 1, column: 21 },
      original: { line: 2, column: 3 },
      source: 'one.js'
    });
    map.addMapping({
      generated: { line: 1, column: 28 },
      original: { line: 2, column: 10 },
      source: 'one.js',
      name: 'baz'
    });
    map.addMapping({
      generated: { line: 1, column: 32 },
      original: { line: 2, column: 14 },
      source: 'one.js',
      name: 'bar'
    });

    map.addMapping({
      generated: { line: 2, column: 1 },
      original: { line: 1, column: 1 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 5 },
      original: { line: 1, column: 5 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 9 },
      original: { line: 1, column: 11 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 18 },
      original: { line: 1, column: 21 },
      source: 'two.js',
      name: 'n'
    });
    map.addMapping({
      generated: { line: 2, column: 21 },
      original: { line: 2, column: 3 },
      source: 'two.js'
    });
    map.addMapping({
      generated: { line: 2, column: 28 },
      original: { line: 2, column: 10 },
      source: 'two.js',
      name: 'n'
    });

    map = JSON.parse(map.toString());

    utils.assertEqualMaps(assert, map, fixtures.testMap);
  });

  it('test that adding a mapping with an empty string name does not break generation', () => {
    var map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.'
    });

    map.addMapping({
      generated: { line: 1, column: 1 },
      source: 'bar.js',
      original: { line: 1, column: 1 },
      name: ''
    });

    assert.doesNotThrow(function () {
      JSON.parse(map.toString());
    });
  });
})

describe('SourceMapGenerator.fromSourceMap', () => {
  it('test .fromSourceMap with sourcesContent', () => {
    var map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapWithSourcesContent));
      utils.assertEqualMaps(assert, map.toJSON(), fixtures.testMapWithSourcesContent_generated);
  });

  it('test .fromSourceMap with single source', () => {
    var map = SourceMapGenerator.fromSourceMap(
        new SourceMapConsumer(fixtures.testMapSingleSource));
        utils.assertEqualMaps(assert, map.toJSON(), fixtures.testMapSingleSource);
  });

  it('test .fromSourceMap with empty mappings', () => {
    var map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapEmptyMappings));
      utils.assertEqualMaps(assert, map.toJSON(), fixtures.testMapEmptyMappings);
  });

  it('test .fromSourceMap with empty mappings and relative sources', () => {
    var map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapEmptyMappingsRelativeSources));
      utils.assertEqualMaps(assert, map.toJSON(), fixtures.testMapEmptyMappingsRelativeSources_generated);
  });

  it('test .fromSourceMap with multiple sources where mappings refers only to single source', () => {
      var map = SourceMapGenerator.fromSourceMap(
          new SourceMapConsumer(fixtures.testMapMultiSourcesMappingRefersSingleSourceOnly));
      utils.assertEqualMaps(assert, map.toJSON(), fixtures.testMapMultiSourcesMappingRefersSingleSourceOnly);
  });
})
