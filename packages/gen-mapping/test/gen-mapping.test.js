const {
  GenMapping,
  addSegment,
  addMapping,
  setSourceContent,
  decodedMap,
  encodedMap,
  allMappings,
} = require('..');
const assert = require('assert');

describe('GenMapping', () => {
  describe('decodedMap', () => {
    it('has version', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(decodedMap(map).version, 3);
    });

    it('has file name', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(decodedMap(map).file, 'output.js');
    });

    it('has sourceRoot', () => {
      const map = new GenMapping({ sourceRoot: 'foo/' });

      assert.strictEqual(decodedMap(map).sourceRoot, 'foo/');
    });

    it('has sources', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(decodedMap(map).sources, ['input.js']);
    });

    it('has sourcesContent', () => {
      const map = new GenMapping();
      setSourceContent(map, 'input.js', 'input');

      assert.deepEqual(decodedMap(map).sourcesContent, ['input']);
    });

    it('has names', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(decodedMap(map).names, ['foo']);
    });

    it('has mappings', () => {
      const map = new GenMapping();
      addSegment(map, 0, 1, 'input.js', 2, 3, 'foo');

      assert.deepEqual(decodedMap(map).mappings, [[[1, 0, 2, 3, 0]]]);
    });
  });

  describe('encodedMap', () => {
    it('has version', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(encodedMap(map).version, 3);
    });

    it('has file name', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(encodedMap(map).file, 'output.js');
    });

    it('has sourceRoot', () => {
      const map = new GenMapping({ sourceRoot: 'foo/' });

      assert.strictEqual(encodedMap(map).sourceRoot, 'foo/');
    });

    it('has sources', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(encodedMap(map).sources, ['input.js']);
    });

    it('has sourcesContent', () => {
      const map = new GenMapping();
      setSourceContent(map, 'input.js', 'input');

      assert.deepEqual(encodedMap(map).sourcesContent, ['input']);
    });

    it('has names', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(encodedMap(map).names, ['foo']);
    });

    it('has mappings', () => {
      const map = new GenMapping();
      addSegment(map, 0, 1, 'input.js', 2, 3, 'foo');

      assert.deepEqual(encodedMap(map).mappings, 'CAEGA');
    });
  });

  describe('addSegment', () => {
    it('requires generated line/column', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [[[0]]]);
    });

    it('records nameless source segment', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [[[0, 0, 0, 0]]]);
    });

    it('records named source segment', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(decodedMap(map).mappings, [[[0, 0, 0, 0, 0]]]);
    });

    it('uses 0-based line', () => {
      const map = new GenMapping();
      addSegment(map, 1, 0, 'input.js', 1, 0, 'foo');

      assert.deepEqual(decodedMap(map).mappings, [[], [[0, 0, 1, 0, 0]]]);
    });

    it('can skip back and forth in generated lines', () => {
      const map = new GenMapping();
      addSegment(map, 1, 0, 'input.js', 1, 0);
      addSegment(map, 2, 0, 'input.js', 2, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [[[0, 0, 0, 0]], [[0, 0, 1, 0]], [[0, 0, 2, 0]]]);
    });

    it('sorts generated column', () => {
      const map = new GenMapping();
      addSegment(map, 0, 1, 'input.js', 0, 0);
      addSegment(map, 0, 2, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [2, 0, 0, 0],
        ],
      ]);
    });

    it('sorts source index', () => {
      const map = new GenMapping();

      addSegment(map, 1, 0, 'foo.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'foo.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
        ],
        [[0, 0, 0, 0]],
      ]);
    });

    it('sorts source line', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 1, 0);
      addSegment(map, 0, 0, 'input.js', 2, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 2, 0],
        ],
      ]);
    });

    it('sorts source column', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 1);
      addSegment(map, 0, 0, 'input.js', 0, 2);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 1],
          [0, 0, 0, 2],
        ],
      ]);
    });

    it('sorts name index', () => {
      const map = new GenMapping();

      addSegment(map, 1, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0, 'input.js', 0, 0, 'bar');
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1],
        ],
        [[0, 0, 0, 0, 0]],
      ]);
    });

    it('sorts sourceless segment before source segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [[[0], [0, 0, 0, 0]]]);
    });

    it('sorts sourceless segment before named segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [[[0], [0, 0, 0, 0, 0]]]);
    });

    it('sorts source segment before named segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ]);
    });

    it('keeps equivalent sourceless segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0);
      addSegment(map, 1, 0);
      addSegment(map, 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [[[0], [0]], [[0]]]);
    });

    it('skips equivalent source segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 1, 0, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [[0, 0, 0, 0]],
      ]);
    });

    it('keeps equivalent named segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 1, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(decodedMap(map).mappings, [
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [[0, 0, 0, 0, 0]],
      ]);
    });

    it('keeps sourcesContent in sync with sources', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 1, 0, 'foo.js', 0, 0);
      addSegment(map, 2, 0, 'bar.js', 0, 0);

      setSourceContent(map, 'bar.js', 'bar');
      setSourceContent(map, 'input.js', 'input');

      assert.deepEqual(decodedMap(map).sourcesContent, ['input', null, 'bar']);
    });
  });

  describe('addMapping', () => {
    it('requires generated line/column', () => {
      const map = new GenMapping();
      addMapping(map, { generated: { line: 1, column: 0 } });

      assert.deepEqual(decodedMap(map).mappings, [[[0]]]);
    });

    it('records nameless source segment', () => {
      const map = new GenMapping();
      addMapping(map, {
        generated: { line: 1, column: 0 },
        source: 'input.js',
        original: { line: 1, column: 0 },
      });

      assert.deepEqual(decodedMap(map).mappings, [[[0, 0, 0, 0]]]);
    });

    it('records named source segment', () => {
      const map = new GenMapping();
      addMapping(map, {
        generated: { line: 1, column: 0 },
        source: 'input.js',
        original: { line: 1, column: 0 },
        name: 'foo',
      });

      assert.deepEqual(decodedMap(map).mappings, [[[0, 0, 0, 0, 0]]]);
    });

    it('uses 1-based line', () => {
      const map = new GenMapping();
      addMapping(map, {
        generated: { line: 2, column: 0 },
        source: 'input.js',
        original: { line: 2, column: 0 },
        name: 'foo',
      });

      assert.deepEqual(decodedMap(map).mappings, [[], [[0, 0, 1, 0, 0]]]);
    });
  });

  describe('allMappings', () => {
    it('returns sourceless mappings', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0);

      assert.deepEqual(allMappings(map), [
        {
          generated: { line: 1, column: 0 },
          source: undefined,
          original: undefined,
          name: undefined,
        },
      ]);
    });

    it('returns source mappings', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(allMappings(map), [
        {
          generated: { line: 1, column: 0 },
          source: 'input.js',
          original: { line: 1, column: 0 },
          name: undefined,
        },
      ]);
    });

    it('returns named mappings', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(allMappings(map), [
        {
          generated: { line: 1, column: 0 },
          source: 'input.js',
          original: { line: 1, column: 0 },
          name: 'foo',
        },
      ]);
    });

    it('returns mappings in sorted order', () => {
      const map = new GenMapping();

      addSegment(map, 0, 1, 'input.js', 0, 0);
      addSegment(map, 0, 2, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(allMappings(map), [
        {
          generated: { line: 1, column: 0 },
          source: 'input.js',
          original: { line: 1, column: 0 },
          name: undefined,
        },
        {
          generated: { line: 1, column: 1 },
          source: 'input.js',
          original: { line: 1, column: 0 },
          name: undefined,
        },
        {
          generated: { line: 1, column: 2 },
          source: 'input.js',
          original: { line: 1, column: 0 },
          name: undefined,
        },
      ]);
    });
  });
});
