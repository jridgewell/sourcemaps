const {
  GenMapping,
  addSegment,
  addMapping,
  setSourceContent,
  toDecodedMap,
  toEncodedMap,
  allMappings,
  fromMap,
  maybeAddSegment,
  maybeAddMapping,
} = require('..');
const assert = require('assert');

describe('GenMapping', () => {
  describe('toDecodedMap', () => {
    it('has version', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(toDecodedMap(map).version, 3);
    });

    it('has file name', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(toDecodedMap(map).file, 'output.js');
    });

    it('has sourceRoot', () => {
      const map = new GenMapping({ sourceRoot: 'foo/' });

      assert.strictEqual(toDecodedMap(map).sourceRoot, 'foo/');
    });

    it('has sources', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(toDecodedMap(map).sources, ['input.js']);
    });

    it('has sourcesContent', () => {
      const map = new GenMapping();
      setSourceContent(map, 'input.js', 'input');

      assert.deepEqual(toDecodedMap(map).sourcesContent, ['input']);
    });

    it('has names', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(toDecodedMap(map).names, ['foo']);
    });

    it('has mappings', () => {
      const map = new GenMapping();
      addSegment(map, 0, 1, 'input.js', 2, 3, 'foo');

      assert.deepEqual(toDecodedMap(map).mappings, [[[1, 0, 2, 3, 0]]]);
    });
  });

  describe('toEncodedMap', () => {
    it('has version', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(toEncodedMap(map).version, 3);
    });

    it('has file name', () => {
      const map = new GenMapping({ file: 'output.js' });

      assert.strictEqual(toEncodedMap(map).file, 'output.js');
    });

    it('has sourceRoot', () => {
      const map = new GenMapping({ sourceRoot: 'foo/' });

      assert.strictEqual(toEncodedMap(map).sourceRoot, 'foo/');
    });

    it('has sources', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(toEncodedMap(map).sources, ['input.js']);
    });

    it('has sourcesContent', () => {
      const map = new GenMapping();
      setSourceContent(map, 'input.js', 'input');

      assert.deepEqual(toEncodedMap(map).sourcesContent, ['input']);
    });

    it('has names', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(toEncodedMap(map).names, ['foo']);
    });

    it('has mappings', () => {
      const map = new GenMapping();
      addSegment(map, 0, 1, 'input.js', 2, 3, 'foo');

      assert.deepEqual(toEncodedMap(map).mappings, 'CAEGA');
    });
  });

  describe('addSegment', () => {
    it('requires generated line/column', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [[[0]]]);
    });

    it('records nameless source segment', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0]]]);
    });

    it('records named source segment', () => {
      const map = new GenMapping();
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0, 0]]]);
    });

    it('uses 0-based line', () => {
      const map = new GenMapping();
      addSegment(map, 1, 0, 'input.js', 1, 0, 'foo');

      assert.deepEqual(toDecodedMap(map).mappings, [[], [[0, 0, 1, 0, 0]]]);
    });

    it('can skip back and forth in generated lines', () => {
      const map = new GenMapping();
      addSegment(map, 1, 0, 'input.js', 1, 0);
      addSegment(map, 2, 0, 'input.js', 2, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
        [[0, 0, 0, 0]],
        [[0, 0, 1, 0]],
        [[0, 0, 2, 0]],
      ]);
    });

    it('sorts generated column', () => {
      const map = new GenMapping();
      addSegment(map, 0, 1, 'input.js', 0, 0);
      addSegment(map, 0, 2, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [2, 0, 0, 0],
        ],
      ]);
    });

    it('postfix sorts source index', () => {
      const map = new GenMapping();

      addSegment(map, 1, 0, 'foo.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'foo.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
        [
          [0, 1, 0, 0],
          [0, 0, 0, 0],
        ],
        [[0, 0, 0, 0]],
      ]);
    });

    it('postfix sorts source line', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 1, 0);
      addSegment(map, 0, 0, 'input.js', 2, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
        [
          [0, 0, 1, 0],
          [0, 0, 2, 0],
          [0, 0, 0, 0],
        ],
      ]);
    });

    it('postfix sorts source column', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 1);
      addSegment(map, 0, 0, 'input.js', 0, 2);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
        [
          [0, 0, 0, 1],
          [0, 0, 0, 2],
          [0, 0, 0, 0],
        ],
      ]);
    });

    it('postfix sorts name index', () => {
      const map = new GenMapping();

      addSegment(map, 1, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0, 'input.js', 0, 0, 'bar');
      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

      assert.deepEqual(toDecodedMap(map).mappings, [
        [
          [0, 0, 0, 0, 1],
          [0, 0, 0, 0, 0],
        ],
        [[0, 0, 0, 0, 0]],
      ]);
    });

    it('postfix sorts sourceless segment after source segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [0]]]);
    });

    it('postfix sorts sourceless segment after named segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0, 0], [0]]]);
    });

    it('postfix sorts source segment after named segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      ]);
    });

    it('keeps equivalent sourceless segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0);
      addSegment(map, 1, 0);
      addSegment(map, 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [[[0], [0]], [[0]]]);
    });

    it('keeps equivalent source segment', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 1, 0, 'input.js', 0, 0);
      addSegment(map, 0, 0, 'input.js', 0, 0);

      assert.deepEqual(toDecodedMap(map).mappings, [
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

      assert.deepEqual(toDecodedMap(map).mappings, [
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

      assert.deepEqual(toDecodedMap(map).sourcesContent, ['input', null, 'bar']);
    });

    it('can set content when adding', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, '', 'input');
      addSegment(map, 1, 0, 'foo.js', 0, 0, '', undefined);

      assert.deepEqual(toDecodedMap(map).sourcesContent, ['input', null]);
    });

    it('only sets content during initial source add', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0, '', 'first');
      addSegment(map, 1, 0, 'input.js', 0, 0, '', 'second');

      assert.deepEqual(toDecodedMap(map).sourcesContent, ['first']);
    });

    it('ignores content when sourceless', () => {
      const map = new GenMapping();

      addSegment(map, 0, 0, 'input.js', 0, 0);
      addSegment(map, 0, 1, '', 0, 0, '', 'foo');

      assert.deepEqual(toDecodedMap(map).sourcesContent, [null]);
    });
  });

  describe('addMapping', () => {
    it('requires generated line/column', () => {
      const map = new GenMapping();
      addMapping(map, { generated: { line: 1, column: 0 } });

      assert.deepEqual(toDecodedMap(map).mappings, [[[0]]]);
    });

    it('records nameless source segment', () => {
      const map = new GenMapping();
      addMapping(map, {
        generated: { line: 1, column: 0 },
        source: 'input.js',
        original: { line: 1, column: 0 },
      });

      assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0]]]);
    });

    it('records named source segment', () => {
      const map = new GenMapping();
      addMapping(map, {
        generated: { line: 1, column: 0 },
        source: 'input.js',
        original: { line: 1, column: 0 },
        name: 'foo',
      });

      assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0, 0]]]);
    });

    it('uses 1-based line', () => {
      const map = new GenMapping();
      addMapping(map, {
        generated: { line: 2, column: 0 },
        source: 'input.js',
        original: { line: 2, column: 0 },
        name: 'foo',
      });

      assert.deepEqual(toDecodedMap(map).mappings, [[], [[0, 0, 1, 0, 0]]]);
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

  describe('fromMap', () => {
    it('copies version', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: [],
        sources: ['input.js'],
        sourcesContent: [],
        mappings: [],
      });
      const map = fromMap(input);

      assert.strictEqual(toDecodedMap(map).version, 3);
    });

    it('copies file name', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        file: 'output.js',
        names: [],
        sources: ['input.js'],
        sourcesContent: [],
        mappings: [],
      });
      const map = fromMap(input);

      assert.strictEqual(toDecodedMap(map).file, 'output.js');
    });

    it('copies sourceRoot', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: [],
        sourceRoot: 'foo/',
        sources: ['input.js'],
        sourcesContent: [],
        mappings: [],
      });
      const map = fromMap(input);

      assert.strictEqual(toDecodedMap(map).sourceRoot, 'foo/');
    });

    it('copies sources', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: [],
        sources: ['input.js'],
        sourcesContent: [],
        mappings: [],
      });
      const map = fromMap(input);

      assert.deepEqual(toDecodedMap(map).sources, ['input.js']);
    });

    it('copies sourcesContent', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: [],
        sources: ['input.js'],
        sourcesContent: ['input'],
        mappings: [],
      });
      const map = fromMap(input);

      assert.deepEqual(toDecodedMap(map).sourcesContent, ['input']);
    });

    it('creates sourcesContent', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: [],
        sources: ['input.js'],
        mappings: [],
      });
      const map = fromMap(input);

      assert.deepEqual(toDecodedMap(map).sourcesContent, [null]);
    });

    it('copies names', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: ['foo'],
        sources: ['input.js'],
        sourcesContent: [],
        mappings: [[[0, 0, 0, 0, 0]]],
      });
      const map = fromMap(input);

      assert.deepEqual(toDecodedMap(map).names, ['foo']);
    });

    it('copies decoded mappings', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').DecodedSourceMap} */ ({
        version: 3,
        names: [],
        sources: ['input.js'],
        sourcesContent: [],
        mappings: [[[1, 0, 2, 3, 0]]],
      });
      const map = fromMap(input);

      assert.deepEqual(toDecodedMap(map).mappings, [[[1, 0, 2, 3, 0]]]);
    });

    it('copies encoded mappings', () => {
      const input = /** @type {import('@jridgewell/trace-mapping').EncodedSourceMap} */ ({
        version: 3,
        names: [],
        sources: ['input.js'],
        sourcesContent: [],
        mappings: 'CAEGA',
      });
      const map = fromMap(input);

      assert.deepEqual(toDecodedMap(map).mappings, [[[1, 0, 2, 3, 0]]]);
    });
  });

  describe('maybeAddSegment', () => {
    describe('sourceless segment added afterwards', () => {
      it('skips sourceless segment first on line', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 1, 'input.js', 0, 0);
        maybeAddSegment(map, 1, 1);

        assert.deepEqual(toDecodedMap(map).mappings, [[[1, 0, 0, 0]]]);
      });

      it('skips sourceless segment sorted first in line', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 1, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [[[1, 0, 0, 0]]]);
      });

      it('skips equivalent sourceless segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 1);
        maybeAddSegment(map, 0, 1);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [1]]]);
      });

      it('skips runs of sourceless segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 1);
        maybeAddSegment(map, 0, 2);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [1]]]);
      });

      it('does not skip sourcless segment sorted before sourceless segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 2);
        maybeAddSegment(map, 0, 1);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [1], [2]]]);
      });

      it('does not skip sourcless segment matching source segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [0]]]);
      });
    });

    describe('source segment added afterwards', () => {
      it('skips equivalent source segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0]]]);
      });

      it('keeps source segment after matching named segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0],
          ],
        ]);
      });

      it('keeps runs of source segment after matching named segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
        maybeAddSegment(map, 0, 1, 'input.js', 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0, 0],
            [1, 0, 0, 0],
          ],
        ]);
      });

      it('keeps named segment after matching source segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0, 'input.js', 0, 0, 'foo');

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0],
            [0, 0, 0, 0, 0],
          ],
        ]);
      });

      it('keeps runs of named segment after matching source segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 1, 'input.js', 0, 0, 'foo');

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0],
            [1, 0, 0, 0, 0],
          ],
        ]);
      });

      it('skips runs of matching source segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 1, 'input.js', 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0]]]);
      });

      it('skips runs of matching named segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0, 'foo');
        maybeAddSegment(map, 0, 1, 'input.js', 0, 0, 'foo');

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0, 0]]]);
      });

      it('keeps source segment pointing to different source file', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0, 'foo.js', 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
          ],
        ]);
      });

      it('keeps source segment pointing to different source line', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0, 'input.js', 1, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
          ],
        ]);
      });

      it('keeps source segment pointing to different source column', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 0, 'input.js', 0, 1);

        assert.deepEqual(toDecodedMap(map).mappings, [
          [
            [0, 0, 0, 0],
            [0, 0, 0, 1],
          ],
        ]);
      });

      it('keeps source segment after matching sourceless segment', () => {
        const map = new GenMapping();

        maybeAddSegment(map, 0, 0, 'input.js', 0, 0);
        maybeAddSegment(map, 0, 1);
        maybeAddSegment(map, 0, 1, 'input.js', 0, 0);

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [1], [1, 0, 0, 0]]]);
      });
    });
  });

  describe('maybeAddMapping', () => {
    describe('sourceless segment added afterwards', () => {
      it('skips sourceless segment first on line', () => {
        const map = new GenMapping();

        maybeAddMapping(map, {
          generated: { line: 1, column: 1 },
          source: 'input.js',
          original: {
            line: 1,
            column: 0,
          },
        });
        maybeAddMapping(map, { generated: { line: 2, column: 1 } });

        assert.deepEqual(toDecodedMap(map).mappings, [[[1, 0, 0, 0]]]);
      });

      it('skips equivalent sourceless segment', () => {
        const map = new GenMapping();

        maybeAddMapping(map, {
          generated: { line: 1, column: 0 },
          source: 'input.js',
          original: {
            line: 1,
            column: 0,
          },
        });
        maybeAddMapping(map, { generated: { line: 1, column: 1 } });
        maybeAddMapping(map, { generated: { line: 1, column: 1 } });

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0], [1]]]);
      });
    });

    describe('source segment added afterwards', () => {
      it('skips equivalent source segment', () => {
        const map = new GenMapping();

        maybeAddMapping(map, {
          generated: { line: 1, column: 0 },
          source: 'input.js',
          original: {
            line: 1,
            column: 0,
          },
        });
        maybeAddMapping(map, {
          generated: { line: 1, column: 0 },
          source: 'input.js',
          original: {
            line: 1,
            column: 0,
          },
        });

        assert.deepEqual(toDecodedMap(map).mappings, [[[0, 0, 0, 0]]]);
      });
    });
  });
});
