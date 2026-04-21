import { toDecodedMap, GenMapping } from '@jridgewell/gen-mapping';
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

    function tracePosition(source: any, line: number, col: number, name: string) {
      const gen = new GenMapping();
      originalPositionFor(gen, 0, 0, source, line, col, name);
      return toDecodedMap(gen);
    }

    it('traces LineSegments to the segment with matching generated column', () => {
      const { mappings } = tracePosition(tree, 0, 4, '');
      assert.deepEqual(mappings, [[[0, 0, 1, 1]]]);
    });

    it('traces all generated cols on a line back to their source when source had characters removed', () => {
      const expectedCols = [0, 0, 0, 0, 0, 6, 6, 6, 6];
      for (let genCol = 0; genCol < expectedCols.length; genCol++) {
        const { mappings } = tracePosition(tree, 4, genCol, '');
        assert.deepEqual(mappings, [[[0, 0, 4, expectedCols[genCol]]]]);
      }
    });

    it('traces all generated cols on a line back to their source when source had characters added', () => {
      const expectedCols = [0, 0, 0, 0, 0, null, 5, 5, 5, 5, 5];
      for (let genCol = 0; genCol < expectedCols.length; genCol++) {
        const { mappings } = tracePosition(tree, 5, genCol, '');
        if (expectedCols[genCol] == null) {
          assert.deepEqual(mappings, []);
        } else {
          assert.deepEqual(mappings, [[[0, 0, 5, expectedCols[genCol]]]]);
        }
      }
    });

    it('returns empty mappings if line is longer than mapping lines', () => {
      const { mappings } = tracePosition(tree, 10, 0, '');
      assert.deepEqual(mappings, []);
    });

    it('returns empty mappings if no matching segment column', () => {
      //line 1 col 0 of generated doesn't exist in the original source
      const { mappings } = tracePosition(tree, 1, 0, '');
      assert.deepEqual(mappings, []);
    });

    it('returns empty mappings if segment is 1-length', () => {
      const { mappings } = tracePosition(tree, 2, 0, '');
      assert.deepEqual(mappings, []);
    });

    it('passes in outer name to trace', () => {
      const { mappings, names } = tracePosition(tree, 0, 0, 'foo');
      assert.deepEqual(mappings, [[[0, 0, 0, 0, 0]]]);
      assert.deepEqual(names, ['foo']);
    });

    it('overrides name if segment is 5-length', () => {
      const { mappings, names } = tracePosition(tree, 3, 0, 'foo');
      assert.deepEqual(mappings, [[[0, 0, 0, 0, 0]]]);
      assert.deepEqual(names, ['name']);
    });

    describe('tracing same line multiple times', () => {
      describe('later column', () => {
        it('returns matching segment after match', () => {
          tracePosition(tree, 0, 1, '');
          const { mappings } = tracePosition(tree, 0, 4, '');
          assert.deepEqual(mappings, [[[0, 0, 1, 1]]]);
        });

        it('returns matching segment after null match', () => {
          const { mappings: emptyMappings } = tracePosition(tree, 1, 0, '');
          assert.deepEqual(emptyMappings, []);
          const { mappings } = tracePosition(tree, 1, 2, '');
          assert.deepEqual(mappings, [[[0, 0, 0, 0]]]);
        });

        it('returns empty mappings after null match', () => {
          tracePosition(tree, 1, 0, '');
          const { mappings } = tracePosition(tree, 1, 1, '');
          assert.deepEqual(mappings, []);
        });

        it('returns matching segment after almost match', () => {
          tracePosition(tree, 4, 2, '');
          const { mappings } = tracePosition(tree, 4, 5, '');
          assert.deepEqual(mappings, [[[0, 0, 4, 6]]]);
        });
      });

      describe('earlier column', () => {
        it('returns matching segment after match', () => {
          tracePosition(tree, 0, 4, '');
          const { mappings } = tracePosition(tree, 0, 1, '');
          assert.deepEqual(mappings, [[[0, 0, 0, 0]]]);
        });

        it('returns empty mappings after null match', () => {
          tracePosition(tree, 1, 1, '');
          const { mappings } = tracePosition(tree, 1, 0, '');
          assert.deepEqual(mappings, []);
        });

        it('returns matching segment after almost match', () => {
          tracePosition(tree, 4, 2, '');
          const { mappings } = tracePosition(tree, 4, 0, '');
          assert.deepEqual(mappings, [[[0, 0, 4, 0]]]);
        });
      });
    });
  });
});
