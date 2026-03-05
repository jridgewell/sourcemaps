import { toDecodedMap, toEncodedMap } from '@jridgewell/gen-mapping';
import { TraceMap } from '@jridgewell/trace-mapping';
import assert from 'node:assert/strict';

import {
  OriginalSource,
  MapSource,
  originalPositionFor,
  traceMappings,
} from '../../src/source-map-tree';
import { type DecodedSourceMap } from '../../src/types';
import { assertMatchObject } from './util';

describe('MapSource', () => {
  describe('traceMappings()', () => {
    const sourceRoot = 'foo';
    const baseMap: DecodedSourceMap = {
      mappings: [],
      names: ['name'],
      sourceRoot,
      sources: ['child.js'],
      version: 3,
    };
    const child = MapSource(
      new TraceMap({
        mappings: [
          [
            [0, 0, 0, 0],
            [1, 0, 0, 0],
            [2, 0, 0, 0],
            [4, 0, 1, 1],
          ], // line 0
          [[1, 0, 0, 0, 0], [6]], // line 1
          [[3, 0, 3, 7], [9]], // line 2
        ],
        rangeMappings: [[], [], [0]],
        names: ['child'],
        sources: ['original.js'],
        version: 3,
      }),
      [OriginalSource(`${sourceRoot}/original.js`, '', false)],
    );

    it('records segment if segment is 1-length', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 4], [5]]],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 1, 1], [5]]]);
    });

    it('records segment if trace hits 1-length segment', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [
          [
            [0, 0, 0, 4],
            [5, 0, 1, 6],
          ],
        ],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 1, 1], [5]]]);
    });

    it('skips segment if trace returns null', () => {
      const sourceIndex = 0;
      const line = 10; // There is no line 10 in child's mappings.
      const column = 0;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, []);
    });

    it('traces name if segment is 5-length', () => {
      const sourceIndex = 0;
      const line = 0;
      const column = 0;
      const nameIndex = 0;
      const name = 'name';
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column, nameIndex]]],
        names: [name],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 0, 0, 0]]]);
      assertMatchObject(traced, {
        names: [name],
      });
    });

    it('maps into traced segment', () => {
      const sourceIndex = 0;
      const line = 0;
      const column = 4;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 1, 1]]]);
    });

    it('maps into traced segment with name', () => {
      const sourceIndex = 0;
      const line = 1;
      const column = 1;
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 0, 0, 0]]]);
      assertMatchObject(traced, {
        names: ['child'],
      });
    });

    it('defaults decoded return map with original data', () => {
      const extras = {
        file: 'foobar.js',
        // TODO: support sourceRoot
        // sourceRoot: 'https://foobar.com/',
      };
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [],
        ...extras,
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assertMatchObject(traced, extras);
    });

    it('resolves source files realtive to sourceRoot', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]]],
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assertMatchObject(traced, {
        // TODO: support sourceRoot
        sourceRoot: undefined,
        sources: ['foo/original.js'],
      });
    });

    it('truncates mappings to the last line with segment', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]], [], []],
        sourceRoot,
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 0, 0]]]);
    });

    it('truncates empty mappings', () => {
      const map: DecodedSourceMap = {
        ...baseMap,
        mappings: [[], [], []],
        sourceRoot,
      };

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, []);
    });

    describe('redundant segments', () => {
      it('skips redundant segments on the same line', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [
            [
              [0, 0, 0, 0],
              [1, 0, 0, 0],
            ],
          ],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[0, 0, 0, 0]]]);
      });

      it('keeps redundant segments on another line', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0]], [[0, 0, 0, 0]]],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[0, 0, 0, 0]], [[0, 0, 0, 0]]]);
      });
    });

    describe('range mappings', () => {
      it('range mapping in base maps into normal mappings', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [[[5, 0, 0, 1], [9]]],
          rangeMappings: [[0]],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        // This doesn't have mappings at column 6 or 7 because they don't
        // add more info (they'd map to the same original location).
        assert.deepEqual(traced.mappings, [[[5, 0, 0, 0], [8, 0, 1, 1], [9]]]);
      });

      it('multi-line range mapping in base maps into normal mappings', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          // range from [(1,5), (2,7)] maps to [(0,3), (1,7)]
          mappings: [[], [[5, 0, 0, 3]], [[7, 0, 1, 7]]],
          rangeMappings: [[], [0], []],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [],
          [
            [5, 0, 0, 0],
            [6, 0, 1, 1],
          ],
          [[1, 0, 0, 0, 0], [6]],
        ]);
      });

      it('multi-line range mapping in base maps into range mappings', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          // range from [(0,2), (1,5)] maps to [(1,0), (2,5)]
          mappings: [[[2, 0, 1, 0]], [[5, 0, 2, 5]]],
          rangeMappings: [[0], []],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [[3, 0, 0, 0, 0], [8]],
          [
            [3, 0, 3, 7],
            [5, 0, 3, 9],
          ],
        ]);
        assert.deepEqual(traced.rangeMappings, [[], [0]]);
      });

      it('normal mapping in base maps into range mappings', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          // child range mapping maps line 2, columns 3-9
          // so line 2, col 3 and line 2, col 5 are in the range
          mappings: [
            [],
            [],
            [
              [5, 0, 2, 3],
              [19, 0, 2, 5],
            ],
          ],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [],
          [],
          [
            [5, 0, 3, 7],
            [19, 0, 3, 9],
          ],
        ]);
      });

      it('range mapping in base maps into range mappings in child', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [
            [],
            [],
            [
              [5, 0, 2, 3],
              [7, 0, 2, 5],
              [15, 0, 2, 7],
              [17, 0, 2, 9],
            ],
          ],
          rangeMappings: [[], [], [0, 2]],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = traceMappings(tree);
        const decoded = toDecodedMap(traced);
        assert.deepEqual(decoded.mappings, [
          [],
          [],
          [[5, 0, 3, 7], [7, 0, 3, 9], [15, 0, 3, 11], [17]],
        ]);
        assert.deepEqual(decoded.rangeMappings, [[], [], [0, 2]]);
        const encoded = toEncodedMap(traced);
        assert.deepEqual(encoded.rangeMappings, ';;BC');
      });

      it('range mapping in base maps into sub-ranges in child', () => {
        const map: DecodedSourceMap = {
          ...baseMap,
          mappings: [
            [],
            [],
            [
              // base range has length 10, child range has length 6
              [15, 0, 2, 0],
              [25, 0, 2, 10],
            ],
          ],
          rangeMappings: [[], [], [0]],
        };

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[], [], [[18, 0, 3, 7], [24]]]);
        assert.deepEqual(traced.rangeMappings, [[], [], [0]]);
        const encoded = toEncodedMap(traceMappings(tree));
        assert.deepEqual(encoded.rangeMappings, ';;B');
      });
    });
  });

  describe('originalPositionFor()', () => {
    const map: DecodedSourceMap = {
      mappings: [
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [2, 0, 0, 0],
          [4, 0, 1, 1],
        ], // line 0
        [[2, 0, 0, 0]], // line 1 - maps to line 0 col 0
        [[0]], // line 2 has 1 length segment
        [[0, 0, 0, 0, 0]], // line 3 has a name
        [
          [0, 0, 4, 0],
          [5, 0, 4, 6],
        ], // line 4 is identical to line 4 of source except col 5 was removed eg 01234567890 -> 012346789
        [[0, 0, 5, 0], [5], [6, 0, 5, 5]], // line 4 is identical to line 4 of source except a char was added at col 5 eg 01234*56789 -> 0123*456789
      ],
      names: ['name'],
      sources: ['child.js'],
      version: 3,
    };
    const tree = MapSource(new TraceMap(map), [OriginalSource('child.js', '', false)]);

    it('traces LineSegments to the segment with matching generated column', () => {
      const trace = originalPositionFor(tree, 0, 4, '');
      assertMatchObject(trace, { line: 1, column: 1 });
    });

    it('traces all generated cols on a line back to their source when source had characters removed', () => {
      const expectedCols = [0, 0, 0, 0, 0, 6, 6, 6, 6];
      for (let genCol = 0; genCol < expectedCols.length; genCol++) {
        const trace = originalPositionFor(tree, 4, genCol, '');
        assertMatchObject(trace, { line: 4, column: expectedCols[genCol] });
      }
    });

    it('traces all generated cols on a line back to their source when source had characters added', () => {
      const expectedCols = [0, 0, 0, 0, 0, null, 5, 5, 5, 5, 5];
      for (let genCol = 0; genCol < expectedCols.length; genCol++) {
        const trace = originalPositionFor(tree, 5, genCol, '');
        if (expectedCols[genCol] == null) {
          assertMatchObject(trace, { source: '' });
        } else {
          assertMatchObject(trace, { line: 5, column: expectedCols[genCol] });
        }
      }
    });

    it('returns null if line is longer than mapping lines', () => {
      const trace = originalPositionFor(tree, 10, 0, '');
      assert.equal(trace, null);
    });

    it('returns null if no matching segment column', () => {
      //line 1 col 0 of generated doesn't exist in the original source
      const trace = originalPositionFor(tree, 1, 0, '');
      assert.equal(trace, null);
    });

    it('returns sourceless segment object if segment is 1-length', () => {
      const trace = originalPositionFor(tree, 2, 0, '');
      assertMatchObject(trace, { source: '' });
    });

    it('passes in outer name to trace', () => {
      const trace = originalPositionFor(tree, 0, 0, 'foo');
      assertMatchObject(trace, { name: 'foo' });
    });

    it('overrides name if segment is 5-length', () => {
      const trace = originalPositionFor(tree, 3, 0, 'foo');
      assertMatchObject(trace, { name: 'name' });
    });

    describe('tracing same line multiple times', () => {
      describe('later column', () => {
        it('returns matching segment after match', () => {
          assert.notEqual(originalPositionFor(tree, 0, 1, ''), null);
          const trace = originalPositionFor(tree, 0, 4, '');
          assertMatchObject(trace, { line: 1, column: 1 });
        });

        it('returns matching segment after null match', () => {
          assert.equal(originalPositionFor(tree, 1, 0, ''), null);
          const trace = originalPositionFor(tree, 1, 2, '');
          assertMatchObject(trace, { line: 0, column: 0 });
        });

        it('returns null segment segment after null match', () => {
          assert.equal(originalPositionFor(tree, 1, 0, ''), null);
          const trace = originalPositionFor(tree, 1, 1, '');
          assert.equal(trace, null);
        });

        it('returns matching segment after almost match', () => {
          assert.notEqual(originalPositionFor(tree, 4, 2, ''), null);
          const trace = originalPositionFor(tree, 4, 5, '');
          assertMatchObject(trace, { line: 4, column: 6 });
        });
      });

      describe('earlier column', () => {
        it('returns matching segment after match', () => {
          assert.notEqual(originalPositionFor(tree, 0, 4, ''), null);
          const trace = originalPositionFor(tree, 0, 1, '');
          assertMatchObject(trace, { line: 0, column: 0 });
        });

        it('returns null segment segment after null match', () => {
          assert.equal(originalPositionFor(tree, 1, 1, ''), null);
          const trace = originalPositionFor(tree, 1, 0, '');
          assert.equal(trace, null);
        });

        it('returns matching segment after almost match', () => {
          assert.notEqual(originalPositionFor(tree, 4, 2, ''), null);
          const trace = originalPositionFor(tree, 4, 0, '');
          assertMatchObject(trace, { line: 4, column: 0 });
        });
      });
    });
  });

  //describe('traceMappings() with range mappings', () => {
  //  const sourceRoot = 'foo';
  //  const baseMap: DecodedSourceMap = {
  //    mappings: [],
  //    rangeMappings: [],
  //    names: ['name'],
  //    sourceRoot,
  //    sources: ['child.js'],
  //    version: 3,
  //  };
  //  const child = MapSource(
  //    new TraceMap({
  //      mappings: [
  //        [
  //          [0, 0, 0, 0],
  //          [1, 0, 0, 0],
  //          [2, 0, 0, 0],
  //          [4, 0, 1, 1],
  //        ], // line 0
  //        [[1, 0, 0, 0, 0], [6]], // line 1
  //      ],
  //      rangeMappings: [[]],
  //      names: ['child'],
  //      sources: ['original.js'],
  //      version: 3,
  //    }),
  //    [OriginalSource(`${sourceRoot}/original.js`, '', false)],
  //  );
  //});
});
