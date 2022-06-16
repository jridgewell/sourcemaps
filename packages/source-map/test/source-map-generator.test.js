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


describe('SourceMapGenerator.applySourceMap', () => {
  it('test applySourceMap', () => {

    var mapStep1 = {
      version: 3,
      sources: [ 'fileX', 'fileY' ],
      names: [],
      mappings: 'AACA;;ACAA;;ADDA;;ACAA',
      file: 'fileA',
      sourcesContent: [ 'lineX1\nlineX2\n', null ]
    };

    var mapStep2 = {
      version: 3,
      sources: [ 'fileA', 'fileB' ],
      names: [],
      mappings: ';AAAA;AACA;AACA;AACA;ACHA;AACA',
      file: 'fileGen',
      sourcesContent: [ null, 'lineB1\nlineB2\n' ]
    };

    var expectedMap = {
      version: 3,
      sources: [ 'fileX', 'fileA', 'fileY', 'fileB' ],
      names: [],
      mappings: ';AACA;ACAA;ACAA;ADEA;AEHA;AACA',
      file: 'fileGen',
      sourcesContent: [ 'lineX1\nlineX2\n', null, null, 'lineB1\nlineB2\n' ]
    };

    // apply source map "mapStep1" to "mapStep2"
    var generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(mapStep2));
    generator.applySourceMap(new SourceMapConsumer(mapStep1));
    var actualMap = generator.toJSON();

    utils.assertEqualMaps(assert, actualMap, expectedMap);
  });

  it('test applySourceMap throws when file is missing', () => {
    var map = new SourceMapGenerator({
      file: 'test.js'
    });
    var map2 = new SourceMapGenerator();
    assert.throws(function() {
      map.applySourceMap(new SourceMapConsumer(map2.toJSON()));
    });
  });

  it('test the two additional parameters of applySourceMap', () => {
    // Assume the following directory structure:
    //
    // http://foo.org/
    //   bar.coffee
    //   app/
    //     coffee/
    //       foo.coffee
    //     temp/
    //       bundle.js
    //       temp_maps/
    //         bundle.js.map
    //     public/
    //       bundle.min.js
    //       bundle.min.js.map
    //
    // http://www.example.com/
    //   baz.coffee

    var bundleMap = new SourceMapGenerator({
      file: 'bundle.js'
    });
    bundleMap.addMapping({
      generated: { line: 3, column: 3 },
      original: { line: 2, column: 2 },
      source: '../../coffee/foo.coffee'
    });
    bundleMap.setSourceContent('../../coffee/foo.coffee', 'foo coffee');
    bundleMap.addMapping({
      generated: { line: 13, column: 13 },
      original: { line: 12, column: 12 },
      source: '/bar.coffee'
    });
    bundleMap.setSourceContent('/bar.coffee', 'bar coffee');
    bundleMap.addMapping({
      generated: { line: 23, column: 23 },
      original: { line: 22, column: 22 },
      source: 'http://www.example.com/baz.coffee'
    });
    bundleMap.setSourceContent(
      'http://www.example.com/baz.coffee',
      'baz coffee'
    );
    bundleMap = new SourceMapConsumer(bundleMap.toJSON());

    var minifiedMap = new SourceMapGenerator({
      file: 'bundle.min.js',
      sourceRoot: '..'
    });
    minifiedMap.addMapping({
      generated: { line: 1, column: 1 },
      original: { line: 3, column: 3 },
      source: 'temp/bundle.js'
    });
    minifiedMap.addMapping({
      generated: { line: 11, column: 11 },
      original: { line: 13, column: 13 },
      source: 'temp/bundle.js'
    });
    minifiedMap.addMapping({
      generated: { line: 21, column: 21 },
      original: { line: 23, column: 23 },
      source: 'temp/bundle.js'
    });
    minifiedMap = new SourceMapConsumer(minifiedMap.toJSON());

    var expectedMap = function (sources) {
      var map = new SourceMapGenerator({
        file: 'bundle.min.js',
        sourceRoot: '..'
      });
      map.addMapping({
        generated: { line: 1, column: 1 },
        original: { line: 2, column: 2 },
        source: sources[0]
      });
      map.setSourceContent(sources[0], 'foo coffee');
      map.addMapping({
        generated: { line: 11, column: 11 },
        original: { line: 12, column: 12 },
        source: sources[1]
      });
      map.setSourceContent(sources[1], 'bar coffee');
      map.addMapping({
        generated: { line: 21, column: 21 },
        original: { line: 22, column: 22 },
        source: sources[2]
      });
      map.setSourceContent(sources[2], 'baz coffee');
      return map.toJSON();
    }

    var actualMap = function (aSourceMapPath) {
      var map = SourceMapGenerator.fromSourceMap(minifiedMap);
      // Note that relying on `bundleMap.file` (which is simply 'bundle.js')
      // instead of supplying the second parameter wouldn't work here.
      map.applySourceMap(bundleMap, '../temp/bundle.js', aSourceMapPath);
      return map.toJSON();
    }

    utils.assertEqualMaps(assert, actualMap('../temp/temp_maps'), expectedMap([
      'coffee/foo.coffee',
      '/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));

    utils.assertEqualMaps(assert, actualMap('/app/temp/temp_maps'), expectedMap([
      '/app/coffee/foo.coffee',
      '/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));

    utils.assertEqualMaps(assert, actualMap('http://foo.org/app/temp/temp_maps'), expectedMap([
      'http://foo.org/app/coffee/foo.coffee',
      'http://foo.org/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));

    // If the third parameter is omitted or set to the current working
    // directory we get incorrect source paths:

    utils.assertEqualMaps(assert, actualMap(), expectedMap([
      '../coffee/foo.coffee',
      '/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));

    utils.assertEqualMaps(assert, actualMap(''), expectedMap([
      '../coffee/foo.coffee',
      '/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));

    utils.assertEqualMaps(assert, actualMap('.'), expectedMap([
      '../coffee/foo.coffee',
      '/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));

    utils.assertEqualMaps(assert, actualMap('./'), expectedMap([
      '../coffee/foo.coffee',
      '/bar.coffee',
      'http://www.example.com/baz.coffee'
    ]));
  });

  it('test applySourceMap name handling', () => {
    // Imagine some CoffeeScript code being compiled into JavaScript and then
    // minified.

    var assertName = function(coffeeName, jsName, expectedName) {
      var minifiedMap = new SourceMapGenerator({
        file: 'test.js.min'
      });
      minifiedMap.addMapping({
        generated: { line: 1, column: 4 },
        original: { line: 1, column: 4 },
        source: 'test.js',
        name: jsName
      });

      var coffeeMap = new SourceMapGenerator({
        file: 'test.js'
      });
      coffeeMap.addMapping({
        generated: { line: 1, column: 4 },
        original: { line: 1, column: 0 },
        source: 'test.coffee',
        name: coffeeName
      });

      minifiedMap.applySourceMap(new SourceMapConsumer(coffeeMap.toJSON()));

      new SourceMapConsumer(minifiedMap.toJSON()).eachMapping(function(mapping) {
        assert.equal(mapping.name, expectedName);
      });
    };

    // `foo = 1` -> `var foo = 1;` -> `var a=1`
    // CoffeeScript doesn’t rename variables, so there’s no need for it to
    // provide names in its source maps. Minifiers do rename variables and
    // therefore do provide names in their source maps. So that name should be
    // retained if the original map lacks names.
    assertName(null, 'foo', 'foo');

    // `foo = 1` -> `var coffee$foo = 1;` -> `var a=1`
    // Imagine that CoffeeScript prefixed all variables with `coffee$`. Even
    // though the minifier then also provides a name, the original name is
    // what corresponds to the source.
    assertName('foo', 'coffee$foo', 'foo');

    // `foo = 1` -> `var coffee$foo = 1;` -> `var coffee$foo=1`
    // Minifiers can turn off variable mangling. Then there’s no need to
    // provide names in the source map, but the names from the original map are
    // still needed.
    assertName('foo', null, 'foo');

    // `foo = 1` -> `var foo = 1;` -> `var foo=1`
    // No renaming at all.
    assertName(null, null, null);
  });
})
