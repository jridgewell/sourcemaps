import { GenMapping, addSegment, setIgnore, setSourceContent } from '@jridgewell/gen-mapping';
import SourceMap from '../../src/source-map';
import assert from 'node:assert/strict';

describe('SourceMap', () => {
  const opts = {
    excludeContent: false,
    decodedMappings: false,
  };

  it('it is a compliant, v3 sourcemap', () => {
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, opts);
    assert.deepEqual(map.mappings, 'AAAA');
    assert.deepEqual(map.names, []);
    assert.deepEqual(map.sources, ['file.js']);
    assert.deepEqual(map.version, 3);
  });

  it('it can include a file', () => {
    const file = 'foobar.js';
    const traced = new GenMapping({ file });
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, opts);
    assert.deepEqual(map.file, file);
  });

  // TODO: support sourceRoot
  it.skip('it can include a sourceRoot', () => {
    const sourceRoot = 'https://foo.com/';
    const traced = new GenMapping({ sourceRoot });
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, opts);
    assert.deepEqual(map.sourceRoot, sourceRoot);
  });

  it('it can include a sourcesContent', () => {
    const content = '1 + 1';
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');
    setSourceContent(traced, 'file.js', content);

    const map = new SourceMap(traced, opts);
    assert.deepEqual(map.sourcesContent, [content]);
  });

  it('sourcesContent can be manually excluded', () => {
    const content = '1 + 1';
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');
    setSourceContent(traced, 'file.js', content);

    const map = new SourceMap(traced, { ...opts, excludeContent: true });
    assert(!('sourcesContent' in map));
  });

  it('it can include ignoreList', () => {
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');
    setIgnore(traced, 'file.js');

    const map = new SourceMap(traced, opts);
    assert.deepEqual(map.ignoreList, [0]);
  });

  it('mappings can be decoded', () => {
    const traced = new GenMapping();
    addSegment(traced, 0, 0, 'file.js', 0, 0, '');

    const map = new SourceMap(traced, { ...opts, decodedMappings: true });
    assert.deepEqual(map.mappings, [[[0, 0, 0, 0]]]);
  });

  describe('toString()', () => {
    it('returns the sourcemap in JSON', () => {
      const traced = new GenMapping();
      addSegment(traced, 0, 0, 'file.js', 0, 0, '');

      const map = new SourceMap(traced, opts);
      assert.deepEqual(JSON.parse(map.toString()), JSON.parse(JSON.stringify(map)));
    });
  });
});
