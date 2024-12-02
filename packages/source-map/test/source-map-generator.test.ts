import { type EncodedSourceMap } from '@jridgewell/trace-mapping';
import { SourceMapConsumer, SourceMapGenerator } from '../src/source-map';
import * as fixtures from './fixtures';
import * as utils from './utils';
import assert from 'node:assert/strict';

it('SourceMapGenerator.setSourceContent', function () {
  const gen = new SourceMapGenerator({
    file: 'min.js',
    sourceRoot: '/the/root',
  });
  gen.addMapping({
    generated: { line: 1, column: 1 },
    original: { line: 1, column: 1 },
    source: 'one.js',
  });
  gen.addMapping({
    generated: { line: 2, column: 1 },
    original: { line: 1, column: 1 },
    source: 'two.js',
  });
  gen.setSourceContent('one.js', 'one file content');

  const map = JSON.parse(gen.toString());
  assert.equal(map.sources[0], 'one.js');
  assert.equal(map.sources[1], 'two.js');
  assert.equal(map.sourcesContent[0], 'one file content');
  assert.equal(map.sourcesContent[1], null);
});

describe('SourceMapGenerator.addMapping', () => {
  it('test adding mappings (case 1)', () => {
    const map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
      });
    });
  });

  it('test adding mappings (case 2)', () => {
    const map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        source: 'bar.js',
        original: { line: 1, column: 1 },
      });
    });
  });

  it('test adding mappings (case 3)', () => {
    const map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
    });

    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        source: 'bar.js',
        original: { line: 1, column: 1 },
        name: 'someToken',
      });
    });
  });

  it('test adding mappings (invalid)', () => {
    const map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
    });

    // Not enough info.
    assert.throws(function () {
      map.addMapping({} as any);
    });

    // Original file position, but no source.
    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        original: { line: 1, column: 1 },
      } as any);
    });
  });

  it('test adding mappings with skipValidation', () => {
    const map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
      skipValidation: true,
    } as any);

    // Not enough info, caught by `util.getArgs`
    assert.throws(function () {
      map.addMapping({} as any);
    });

    // Original file position, but no source. Not checked.
    assert.doesNotThrow(function () {
      map.addMapping({
        generated: { line: 1, column: 1 },
        original: { line: 1, column: 1 },
      } as any);
    });
  });

  it('test that the correct mappings are being generated', () => {
    const gen = new SourceMapGenerator({
      file: 'min.js',
      sourceRoot: '/the/root',
    });

    gen.addMapping({
      generated: { line: 1, column: 1 },
      original: { line: 1, column: 1 },
      source: 'one.js',
    });
    gen.addMapping({
      generated: { line: 1, column: 5 },
      original: { line: 1, column: 5 },
      source: 'one.js',
    });
    gen.addMapping({
      generated: { line: 1, column: 9 },
      original: { line: 1, column: 11 },
      source: 'one.js',
    });
    gen.addMapping({
      generated: { line: 1, column: 18 },
      original: { line: 1, column: 21 },
      source: 'one.js',
      name: 'bar',
    });
    gen.addMapping({
      generated: { line: 1, column: 21 },
      original: { line: 2, column: 3 },
      source: 'one.js',
    });
    gen.addMapping({
      generated: { line: 1, column: 28 },
      original: { line: 2, column: 10 },
      source: 'one.js',
      name: 'baz',
    });
    gen.addMapping({
      generated: { line: 1, column: 32 },
      original: { line: 2, column: 14 },
      source: 'one.js',
      name: 'bar',
    });

    gen.addMapping({
      generated: { line: 2, column: 1 },
      original: { line: 1, column: 1 },
      source: 'two.js',
    });
    gen.addMapping({
      generated: { line: 2, column: 5 },
      original: { line: 1, column: 5 },
      source: 'two.js',
    });
    gen.addMapping({
      generated: { line: 2, column: 9 },
      original: { line: 1, column: 11 },
      source: 'two.js',
    });
    gen.addMapping({
      generated: { line: 2, column: 18 },
      original: { line: 1, column: 21 },
      source: 'two.js',
      name: 'n',
    });
    gen.addMapping({
      generated: { line: 2, column: 21 },
      original: { line: 2, column: 3 },
      source: 'two.js',
    });
    gen.addMapping({
      generated: { line: 2, column: 28 },
      original: { line: 2, column: 10 },
      source: 'two.js',
      name: 'n',
    });

    const map = JSON.parse(gen.toString());

    utils.assertEqualMaps(map, fixtures.testMap);
  });

  it('test that adding a mapping with an empty string name does not break generation', () => {
    const map = new SourceMapGenerator({
      file: 'generated-foo.js',
      sourceRoot: '.',
    });

    map.addMapping({
      generated: { line: 1, column: 1 },
      source: 'bar.js',
      original: { line: 1, column: 1 },
      name: '',
    });

    assert.doesNotThrow(function () {
      JSON.parse(map.toString());
    });
  });
});

describe('SourceMapGenerator.fromSourceMap', () => {
  it('test .fromSourceMap with sourcesContent', () => {
    const map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapWithSourcesContent),
    );
    utils.assertEqualMaps(
      map.toJSON() as EncodedSourceMap,
      fixtures.testMapWithSourcesContent_generated,
    );
  });

  it('test .fromSourceMap with single source', () => {
    const map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapSingleSource),
    );
    utils.assertEqualMaps(map.toJSON() as EncodedSourceMap, fixtures.testMapSingleSource);
  });

  it('test .fromSourceMap with empty mappings', () => {
    const map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapEmptyMappings),
    );
    utils.assertEqualMaps(map.toJSON() as EncodedSourceMap, fixtures.testMapEmptyMappings);
  });

  it('test .fromSourceMap with empty mappings and relative sources', () => {
    const map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapEmptyMappingsRelativeSources),
    );
    utils.assertEqualMaps(
      map.toJSON() as EncodedSourceMap,
      fixtures.testMapEmptyMappingsRelativeSources_generated,
    );
  });

  it('test .fromSourceMap with multiple sources where mappings refers only to single source', () => {
    const map = SourceMapGenerator.fromSourceMap(
      new SourceMapConsumer(fixtures.testMapMultiSourcesMappingRefersSingleSourceOnly),
    );
    utils.assertEqualMaps(
      map.toJSON() as EncodedSourceMap,
      fixtures.testMapMultiSourcesMappingRefersSingleSourceOnly,
    );
  });
});
