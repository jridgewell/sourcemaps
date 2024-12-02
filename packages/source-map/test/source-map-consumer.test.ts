import { SourceMapConsumer, SourceMapGenerator } from '../src/source-map';
import * as fixtures from './fixtures';
import assert from 'node:assert/strict';

describe('SourceMapConsumer.sourceContentFor', () => {
  it('test that we can get the original sources for the sources', () => {
    const map = new SourceMapConsumer(fixtures.testMapWithSourcesContent);
    const sources = map.sources;

    assert.equal(
      map.sourceContentFor(sources[0]!),
      ' ONE.foo = function (bar) {\n   return baz(bar);\n };',
    );
    assert.equal(
      map.sourceContentFor(sources[1]!),
      ' TWO.inc = function (n) {\n   return n + 1;\n };',
    );
    assert.equal(
      map.sourceContentFor('one.js'),
      ' ONE.foo = function (bar) {\n   return baz(bar);\n };',
    );
    assert.equal(
      map.sourceContentFor('two.js'),
      ' TWO.inc = function (n) {\n   return n + 1;\n };',
    );
    assert.throws(function () {
      map.sourceContentFor('');
    }, Error);
    assert.throws(function () {
      map.sourceContentFor('/the/root/three.js');
    }, Error);
    assert.throws(function () {
      map.sourceContentFor('three.js');
    }, Error);
  });

  // FIXME :: sourceContentFor does not support relative file resolution
  /*it('test that we can get the original source content with relative source paths', () => {
    var map = new SourceMapConsumer(fixtures.testMapRelativeSources);
    var sources = map.sources;

    assert.equal(map.sourceContentFor(sources[0]), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
    assert.equal(map.sourceContentFor(sources[1]), ' TWO.inc = function (n) {\n   return n + 1;\n };');
    assert.equal(map.sourceContentFor("one.js"), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
    assert.equal(map.sourceContentFor("two.js"), ' TWO.inc = function (n) {\n   return n + 1;\n };');
    assert.throws(function () {
      map.sourceContentFor("");
    }, Error);
    assert.throws(function () {
      map.sourceContentFor("/the/root/three.js");
    }, Error);
    assert.throws(function () {
      map.sourceContentFor("three.js");
    }, Error);
  });*/

  // FIXME :: rawSources only list the full path, and no way to access the inner sourceRoot to test
  /*it('test that we can get the original source content for the sources on an indexed source map', () => {
    var map = new SourceMapConsumer(fixtures.indexedTestMap);
    var sources = map.sources;

    assert.equal(map.sourceContentFor(sources[0]), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
    assert.equal(map.sourceContentFor(sources[1]), ' TWO.inc = function (n) {\n   return n + 1;\n };');
    assert.equal(map.sourceContentFor("one.js"), ' ONE.foo = function (bar) {\n   return baz(bar);\n };');
    assert.equal(map.sourceContentFor("two.js"), ' TWO.inc = function (n) {\n   return n + 1;\n };');
    assert.throws(function () {
      map.sourceContentFor("");
    }, Error);
    assert.throws(function () {
      map.sourceContentFor("/the/root/three.js");
    }, Error);
    assert.throws(function () {
      map.sourceContentFor("three.js");
    }, Error);
  });*/
});

describe('SourceMapConsuper.hasContentsOfAllSources', () => {
  function createSourceMapWithoutSources() {
    const smg = new SourceMapGenerator({
      sourceRoot: 'http://example.com/',
      file: 'foo.js',
    });
    smg.addMapping({
      original: { line: 1, column: 1 },
      generated: { line: 2, column: 2 },
      source: 'bar.js',
    });
    smg.addMapping({
      original: { line: 2, column: 2 },
      generated: { line: 4, column: 4 },
      source: 'baz.js',
      name: 'dirtMcGirt',
    });

    return smg;
  }

  it('has no content', () => {
    const smg = createSourceMapWithoutSources();

    const smc = SourceMapConsumer.fromSourceMap(smg);
    assert.equal(smc.hasContentsOfAllSources(), false);
  });

  it('has partial content', () => {
    const smg = createSourceMapWithoutSources();
    smg.setSourceContent('baz.js', 'baz.js content');

    const smc = SourceMapConsumer.fromSourceMap(smg);
    assert.equal(smc.hasContentsOfAllSources(), false);
  });

  it('has all content', () => {
    const smg = createSourceMapWithoutSources();
    smg.setSourceContent('bar.js', 'bar.js content');
    smg.setSourceContent('baz.js', 'baz.js content');

    const smc = SourceMapConsumer.fromSourceMap(smg);
    assert.equal(smc.hasContentsOfAllSources(), true);
  });
});

it('SourceMapConsumer.fromSourceMap', () => {
  const smg = new SourceMapGenerator({
    sourceRoot: 'http://example.com/',
    file: 'foo.js',
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bar.js',
  });
  smg.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 4, column: 4 },
    source: 'baz.js',
    name: 'dirtMcGirt',
  });
  smg.setSourceContent('baz.js', 'baz.js content');

  const smc = SourceMapConsumer.fromSourceMap(smg);
  assert.equal(smc.file, 'foo.js');
  assert.equal(smc.sourceRoot, 'http://example.com/');
  assert.equal(smc.sources.length, 2);
  assert.equal(smc.sources[0], 'http://example.com/bar.js');
  assert.equal(smc.sources[1], 'http://example.com/baz.js');
  assert.equal(smc.sourceContentFor('baz.js'), 'baz.js content');

  let pos = smc.originalPositionFor({
    line: 2,
    column: 2,
  });
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);
  assert.equal(pos.source, 'http://example.com/bar.js');
  assert.equal(pos.name, null);

  let gpos = smc.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'http://example.com/bar.js',
  });
  assert.equal(gpos.line, 2);
  assert.equal(gpos.column, 2);

  pos = smc.originalPositionFor({
    line: 4,
    column: 4,
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);
  assert.equal(pos.source, 'http://example.com/baz.js');
  assert.equal(pos.name, 'dirtMcGirt');

  gpos = smc.generatedPositionFor({
    line: 2,
    column: 2,
    source: 'http://example.com/baz.js',
  });
  assert.equal(gpos.line, 4);
  assert.equal(gpos.column, 4);
});

describe('SourceMapConsumer.eachMapping', () => {
  it('test eachMapping', () => {
    let map;

    map = new SourceMapConsumer(fixtures.testMap);
    let previousLine = -Infinity;
    let previousColumn = -Infinity;
    map.eachMapping(function (mapping) {
      assert.ok(mapping.generatedLine >= previousLine);

      assert.ok(mapping.source === '/the/root/one.js' || mapping.source === '/the/root/two.js');

      if (mapping.generatedLine === previousLine) {
        assert.ok(mapping.generatedColumn >= previousColumn);
        previousColumn = mapping.generatedColumn;
      } else {
        previousLine = mapping.generatedLine;
        previousColumn = -Infinity;
      }
    });

    map = new SourceMapConsumer(fixtures.testMapNoSourceRoot);
    map.eachMapping(function (mapping) {
      assert.ok(mapping.source === 'one.js' || mapping.source === 'two.js');
    });

    map = new SourceMapConsumer(fixtures.testMapEmptySourceRoot);
    map.eachMapping(function (mapping) {
      assert.ok(mapping.source === 'one.js' || mapping.source === 'two.js');
    });
  });

  it('test eachMapping for indexed source maps', () => {
    const map = new SourceMapConsumer(fixtures.indexedTestMap);
    let previousLine = -Infinity;
    let previousColumn = -Infinity;
    map.eachMapping(function (mapping) {
      assert.ok(mapping.generatedLine >= previousLine);

      if (mapping.source) {
        assert.equal(mapping.source.indexOf(fixtures.testMap.sourceRoot!), 0);
      }

      if (mapping.generatedLine === previousLine) {
        assert.ok(mapping.generatedColumn >= previousColumn);
        previousColumn = mapping.generatedColumn;
      } else {
        previousLine = mapping.generatedLine;
        previousColumn = -Infinity;
      }
    });
  });

  // Ordering isn't implemented

  /*it('test iterating over mappings in a different order', () => {
    var map = new SourceMapConsumer(fixtures.testMap);
    var previousLine = -Infinity;
    var previousColumn = -Infinity;
    var previousSource = "";
    map.eachMapping(function (mapping) {
      assert.ok(mapping.source >= previousSource);

      if (mapping.source === previousSource) {
        assert.ok(mapping.originalLine >= previousLine);

        if (mapping.originalLine === previousLine) {
          assert.ok(mapping.originalColumn >= previousColumn);
          previousColumn = mapping.originalColumn;
        }
        else {
          previousLine = mapping.originalLine;
          previousColumn = -Infinity;
        }
      }
      else {
        previousSource = mapping.source;
        previousLine = -Infinity;
        previousColumn = -Infinity;
      }
    }, null, SourceMapConsumer.ORIGINAL_ORDER);
  });

  it('test iterating over mappings in a different order in indexed source maps', () => {
    var map = new SourceMapConsumer(fixtures.indexedTestMap);
    var previousLine = -Infinity;
    var previousColumn = -Infinity;
    var previousSource = "";
    map.eachMapping(function (mapping) {
      assert.ok(mapping.source >= previousSource);

      if (mapping.source === previousSource) {
        assert.ok(mapping.originalLine >= previousLine);

        if (mapping.originalLine === previousLine) {
          assert.ok(mapping.originalColumn >= previousColumn);
          previousColumn = mapping.originalColumn;
        }
        else {
          previousLine = mapping.originalLine;
          previousColumn = -Infinity;
        }
      }
      else {
        previousSource = mapping.source;
        previousLine = -Infinity;
        previousColumn = -Infinity;
      }
    }, null, SourceMapConsumer.ORIGINAL_ORDER);
  });*/

  it('test that we can set the context for `this` in eachMapping', () => {
    const map = new SourceMapConsumer(fixtures.testMap);
    const context = {};
    map.eachMapping(function (this: object) {
      assert.equal(this, context);
    }, context);
  });

  it('test that we can set the context for `this` in eachMapping in indexed source maps', () => {
    const map = new SourceMapConsumer(fixtures.indexedTestMap);
    const context = {};
    map.eachMapping(function (this: object) {
      assert.equal(this, context);
    }, context);
  });
});

describe('SourceMapConsumer.generatedPositionFor', () => {
  it('test sourceRoot + generatedPositionFor', () => {
    const map = new SourceMapGenerator({
      sourceRoot: 'foo/bar',
      file: 'baz.js',
    });
    map.addMapping({
      original: { line: 1, column: 1 },
      generated: { line: 2, column: 2 },
      source: 'bang.coffee',
    });
    map.addMapping({
      original: { line: 5, column: 5 },
      generated: { line: 6, column: 6 },
      source: 'bang.coffee',
    });
    const consumer = new SourceMapConsumer(map.toString(), 'http://example.com/');

    // Should handle without sourceRoot.
    const pos = consumer.generatedPositionFor({
      line: 1,
      column: 1,
      source: 'bang.coffee',
    });

    assert.equal(pos.line, 2);
    assert.equal(pos.column, 2);

    /*
    // TODO :: should these cases be handled as well ?

    // Should handle with sourceRoot.
    pos = map.generatedPositionFor({
      line: 1,
      column: 1,
      source: 'foo/bar/bang.coffee'
    });

    assert.equal(pos.line, 2);
    assert.equal(pos.column, 2);

    // Should handle absolute case.
    pos = map.generatedPositionFor({
      line: 1,
      column: 1,
      source: 'http://example.com/foo/bar/bang.coffee'
    });

    assert.equal(pos.line, 2);
    assert.equal(pos.column, 2);
    */
  });

  it('test sourceRoot + generatedPositionFor for path above the root', () => {
    const map = new SourceMapGenerator({
      sourceRoot: 'foo/bar',
      file: 'baz.js',
    });
    map.addMapping({
      original: { line: 1, column: 1 },
      generated: { line: 2, column: 2 },
      source: '../bang.coffee',
    });
    const consumer = new SourceMapConsumer(map.toString());

    // Should handle with sourceRoot.
    const pos = consumer.generatedPositionFor({
      line: 1,
      column: 1,
      source: 'foo/bang.coffee',
    });

    assert.equal(pos.line, 2);
    assert.equal(pos.column, 2);
  });
});
