const { SourceMapConsumer, SourceMapGenerator } = require('../src/source-map');
const fixtures = require('./fixtures');
const assert = require('assert');

describe('SourceMapConsumer.sourceContentFor', () => {
  it('test that we can get the original sources for the sources', () => {
    var map = new SourceMapConsumer(fixtures.testMapWithSourcesContent);
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

})

it('SourceMapConsumer.fromSourceMap', () => {
  var smg = new SourceMapGenerator({
    sourceRoot: 'http://example.com/',
    file: 'foo.js'
  });
  smg.addMapping({
    original: { line: 1, column: 1 },
    generated: { line: 2, column: 2 },
    source: 'bar.js'
  });
  smg.addMapping({
    original: { line: 2, column: 2 },
    generated: { line: 4, column: 4 },
    source: 'baz.js',
    name: 'dirtMcGirt'
  });
  smg.setSourceContent('baz.js', 'baz.js content');

  var smc = SourceMapConsumer.fromSourceMap(smg);
  assert.equal(smc.file, 'foo.js');
  assert.equal(smc.sourceRoot, 'http://example.com/');
  assert.equal(smc.sources.length, 2);
  assert.equal(smc.sources[0], 'http://example.com/bar.js');
  assert.equal(smc.sources[1], 'http://example.com/baz.js');
  assert.equal(smc.sourceContentFor('baz.js'), 'baz.js content');

  var pos = smc.originalPositionFor({
    line: 2,
    column: 2
  });
  assert.equal(pos.line, 1);
  assert.equal(pos.column, 1);
  assert.equal(pos.source, 'http://example.com/bar.js');
  assert.equal(pos.name, null);

  pos = smc.generatedPositionFor({
    line: 1,
    column: 1,
    source: 'http://example.com/bar.js'
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);

  pos = smc.originalPositionFor({
    line: 4,
    column: 4
  });
  assert.equal(pos.line, 2);
  assert.equal(pos.column, 2);
  assert.equal(pos.source, 'http://example.com/baz.js');
  assert.equal(pos.name, 'dirtMcGirt');

  pos = smc.generatedPositionFor({
    line: 2,
    column: 2,
    source: 'http://example.com/baz.js'
  });
  assert.equal(pos.line, 4);
  assert.equal(pos.column, 4);
});

describe("SourceMapConsumer.eachMapping", () => {
  it('test eachMapping', () => {
    var map;

    map = new SourceMapConsumer(fixtures.testMap);
    var previousLine = -Infinity;
    var previousColumn = -Infinity;
    map.eachMapping(function (mapping) {
      assert.ok(mapping.generatedLine >= previousLine);

      assert.ok(mapping.source === '/the/root/one.js' || mapping.source === '/the/root/two.js');

      if (mapping.generatedLine === previousLine) {
        assert.ok(mapping.generatedColumn >= previousColumn);
        previousColumn = mapping.generatedColumn;
      }
      else {
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
    var map = new SourceMapConsumer(fixtures.indexedTestMap);
    var previousLine = -Infinity;
    var previousColumn = -Infinity;
    map.eachMapping(function (mapping) {
      assert.ok(mapping.generatedLine >= previousLine);

      if (mapping.source) {
        assert.equal(mapping.source.indexOf(fixtures.testMap.sourceRoot), 0);
      }

      if (mapping.generatedLine === previousLine) {
        assert.ok(mapping.generatedColumn >= previousColumn);
        previousColumn = mapping.generatedColumn;
      }
      else {
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
    var map = new SourceMapConsumer(fixtures.testMap);
    var context = {};
    map.eachMapping(function () {
      assert.equal(this, context);
    }, context);
  });

  it('test that we can set the context for `this` in eachMapping in indexed source maps', () => {
    var map = new SourceMapConsumer(fixtures.indexedTestMap);
    var context = {};
    map.eachMapping(function () {
      assert.equal(this, context);
    }, context);
  });
})

describe("SourceMapConsumer.generatedPositionFor", () => {
  it('test sourceRoot + generatedPositionFor', () => {
    var map = new SourceMapGenerator({
      sourceRoot: 'foo/bar',
      file: 'baz.js'
    });
    map.addMapping({
      original: { line: 1, column: 1 },
      generated: { line: 2, column: 2 },
      source: 'bang.coffee'
    });
    map.addMapping({
      original: { line: 5, column: 5 },
      generated: { line: 6, column: 6 },
      source: 'bang.coffee'
    });
    map = new SourceMapConsumer(map.toString(), 'http://example.com/');

    // Should handle without sourceRoot.
    let pos = map.generatedPositionFor({
      line: 1,
      column: 1,
      source: 'bang.coffee'
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
    var map = new SourceMapGenerator({
      sourceRoot: 'foo/bar',
      file: 'baz.js'
    });
    map.addMapping({
      original: { line: 1, column: 1 },
      generated: { line: 2, column: 2 },
      source: '../bang.coffee'
    });
    map = new SourceMapConsumer(map.toString());

    // Should handle with sourceRoot.
    var pos = map.generatedPositionFor({
      line: 1,
      column: 1,
      source: 'foo/bang.coffee'
    });

    assert.equal(pos.line, 2);
    assert.equal(pos.column, 2);
  });
})
