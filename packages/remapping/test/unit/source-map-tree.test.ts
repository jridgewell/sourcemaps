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
    const baseMap = {
      mappings: [],
      names: ['name'],
      sourceRoot,
      sources: ['child.js'],
      version: 3,
    } satisfies DecodedSourceMap;
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
      const map = {
        ...baseMap,
        mappings: [[[0, 0, 0, 4], [5]]],
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 1, 1], [5]]]);
    });

    it('records segment if trace hits 1-length segment', () => {
      const map = {
        ...baseMap,
        mappings: [
          [
            [0, 0, 0, 4],
            [5, 0, 1, 6],
          ],
        ],
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 1, 1], [5]]]);
    });

    it('skips segment if trace returns null', () => {
      const sourceIndex = 0;
      const line = 10; // There is no line 10 in child's mappings.
      const column = 0;
      const map = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, []);
    });

    it('ends mapped position if trace returns null', () => {
      const map = {
        ...baseMap,
        mappings: [
          [
            [0, 0, 1, 1],
            [0, 0, 1, 0], // There is no column 0 in child map
          ],
        ],
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 0, 0, 0], [0]]]);
    });

    it('traces name if segment is 5-length', () => {
      const sourceIndex = 0;
      const line = 0;
      const column = 0;
      const nameIndex = 0;
      const name = 'name';
      const map = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column, nameIndex]]],
        names: [name],
      } satisfies DecodedSourceMap;

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
      const map = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 1, 1]]]);
    });

    it('maps into traced segment with name', () => {
      const sourceIndex = 0;
      const line = 1;
      const column = 1;
      const map = {
        ...baseMap,
        mappings: [[[0, sourceIndex, line, column]]],
      } satisfies DecodedSourceMap;

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
      const map = {
        ...baseMap,
        mappings: [],
        ...extras,
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assertMatchObject(traced, extras);
    });

    it('resolves source files realtive to sourceRoot', () => {
      const map = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]]],
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assertMatchObject(traced, {
        // TODO: support sourceRoot
        sourceRoot: undefined,
        sources: ['foo/original.js'],
      });
    });

    it('truncates mappings to the last line with segment', () => {
      const map = {
        ...baseMap,
        mappings: [[[0, 0, 0, 0]], [], []],
        sourceRoot,
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, [[[0, 0, 0, 0]]]);
    });

    it('truncates empty mappings', () => {
      const map = {
        ...baseMap,
        mappings: [[], [], []],
        sourceRoot,
      } satisfies DecodedSourceMap;

      const tree = MapSource(new TraceMap(map), [child]);
      const traced = toDecodedMap(traceMappings(tree));
      assert.deepEqual(traced.mappings, []);
    });

    describe('redundant segments', () => {
      it('skips redundant segments on the same line', () => {
        const map = {
          ...baseMap,
          mappings: [
            [
              [0, 0, 0, 0],
              [1, 0, 0, 0],
            ],
          ],
        } satisfies DecodedSourceMap;

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[0, 0, 0, 0]]]);
      });

      it('keeps redundant segments on another line', () => {
        const map = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0]], [[0, 0, 0, 0]]],
        } satisfies DecodedSourceMap;

        const tree = MapSource(new TraceMap(map), [child]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[0, 0, 0, 0]], [[0, 0, 0, 0]]]);
      });
    });

    describe('range mappings', () => {
      // https://docs.google.com/presentation/d/1xMlkgiE-4PoFyqqJYw5XgZVmb6gMc8gSGqe7JWEC71k/edit?usp=sharing
      it('Regular -> Range (Slide 14)', () => {
        const map = {
          ...baseMap,
          mappings: [[], [[1, 0, 0, 4]]],
        } satisfies DecodedSourceMap;

        const childMap = {
          ...baseMap,
          sources: ['original.js'],
          mappings: [
            [
              [0, 0, 0, 10],
              [8, 0, 0, 20],
            ],
          ],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const childTree = MapSource(new TraceMap(childMap), [
          OriginalSource(`${sourceRoot}/original.js`, '', false),
        ]);

        const tree = MapSource(new TraceMap(map), [childTree]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[], [[1, 0, 0, 14]]]);
        assert.deepEqual(traced.rangeMappings, undefined);
      });

      it('Range -> Regular (Multiple) (Slide 19)', () => {
        const map = {
          ...baseMap,
          mappings: [[], [[1, 0, 2, 2], [6]]],
          rangeMappings: [[], [0]],
        } satisfies DecodedSourceMap;

        const childMap = {
          ...baseMap,
          sources: ['original.js'],
          mappings: [
            [],
            [],
            [
              [3, 0, 0, 10],
              [4, 0, 0, 20],
              [5, 0, 0, 30],
            ],
          ],
        } satisfies DecodedSourceMap;

        const childTree = MapSource(new TraceMap(childMap), [
          OriginalSource(`${sourceRoot}/original.js`, '', false),
        ]);

        const tree = MapSource(new TraceMap(map), [childTree]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [],
          [
            [3, 0, 0, 10],
            [4, 0, 0, 20],
            [5, 0, 0, 30],
          ],
        ]);
        assert.deepEqual(traced.rangeMappings, undefined);
      });

      it('Multiple Range -> Range (Slide 24)', () => {
        const map = {
          ...baseMap,
          mappings: [[[1, 0, 0, 2], [3], [6, 0, 0, 13], [9]]],
          rangeMappings: [[0, 2]],
        } satisfies DecodedSourceMap;

        const childMap = {
          ...baseMap,
          sources: ['original.js'],
          mappings: [[[0, 0, 0, 100], [20]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const childTree = MapSource(new TraceMap(childMap), [
          OriginalSource(`${sourceRoot}/original.js`, '', false),
        ]);

        const tree = MapSource(new TraceMap(map), [childTree]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[1, 0, 0, 102], [3], [6, 0, 0, 113], [9]]]);
        assert.deepEqual(traced.rangeMappings, [[0, 2]]);
      });

      it('Range -> Mix of Regular and Ranges', () => {
        const map = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0], [10]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const childMap = {
          ...baseMap,
          sources: ['original.js'],
          mappings: [[[2, 0, 0, 10], [4], [6, 0, 0, 20], [8, 0, 0, 30], [9]]],
          rangeMappings: [[0, 3]],
        } satisfies DecodedSourceMap;

        const childTree = MapSource(new TraceMap(childMap), [
          OriginalSource(`${sourceRoot}/original.js`, '', false),
        ]);

        const tree = MapSource(new TraceMap(map), [childTree]);
        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [[2, 0, 0, 10], [4], [6, 0, 0, 20], [8, 0, 0, 30], [9]],
        ]);
        assert.deepEqual(traced.rangeMappings, [[0, 3]]);
      });

      it('3 Levels Deep: Case 1 (Regular -> Range)', () => {
        const map1 = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0], [10]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const map2 = {
          ...baseMap,
          sources: ['level3.js'],
          mappings: [[[0, 0, 0, 0]]],
        } satisfies DecodedSourceMap;

        const map3 = {
          ...baseMap,
          mappings: [
            [
              [0, 0, 0, 10],
              [8, 0, 0, 20],
            ],
          ],
          rangeMappings: [[0]],
          sources: ['helloworld.js'],
        } satisfies DecodedSourceMap;

        const source3 = MapSource(new TraceMap(map3), [
          OriginalSource(`${sourceRoot}/helloworld.js`, '', false),
        ]);
        const source2 = MapSource(new TraceMap(map2), [source3]);
        const tree = MapSource(new TraceMap(map1), [source2]);

        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[0, 0, 0, 10]]]);
        assert.deepEqual(traced.rangeMappings, [[]]);
      });

      it('3 Levels Deep: Case 2 (Range -> Regular)', () => {
        const map1 = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0], [10]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const map2 = {
          ...baseMap,
          sources: ['level3.js'],
          mappings: [[[0, 0, 0, 0], [4]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const map3 = {
          ...baseMap,
          mappings: [
            [
              [2, 0, 0, 10],
              [3, 0, 0, 20],
              [4, 0, 0, 30],
            ],
          ],
          sources: ['helloworld.js'],
        } satisfies DecodedSourceMap;

        const source3 = MapSource(new TraceMap(map3), [
          OriginalSource(`${sourceRoot}/helloworld.js`, '', false),
        ]);
        const source2 = MapSource(new TraceMap(map2), [source3]);
        const tree = MapSource(new TraceMap(map1), [source2]);

        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [
            [2, 0, 0, 10],
            [3, 0, 0, 20],
            [4, 0, 0, 30],
          ],
        ]);
        assert.deepEqual(traced.rangeMappings, [[]]);
      });

      it('3 Levels Deep: Case 3 (Multiple Range -> Range)', () => {
        const map1 = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0], [10]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const map2 = {
          ...baseMap,
          sources: ['level3.js'],
          mappings: [[[1, 0, 0, 2], [3], [6, 0, 0, 13], [9]]],
          rangeMappings: [[0, 2]],
        } satisfies DecodedSourceMap;

        const map3 = {
          ...baseMap,
          mappings: [[[0, 0, 0, 100], [20]]],
          rangeMappings: [[0]],
          sources: ['helloworld.js'],
        } satisfies DecodedSourceMap;

        const source3 = MapSource(new TraceMap(map3), [
          OriginalSource(`${sourceRoot}/helloworld.js`, '', false),
        ]);
        const source2 = MapSource(new TraceMap(map2), [source3]);
        const tree = MapSource(new TraceMap(map1), [source2]);

        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [[[1, 0, 0, 102], [3], [6, 0, 0, 113], [9]]]);
        assert.deepEqual(traced.rangeMappings, [[0, 2]]);
      });

      it('3 Levels Deep: Case 4 (Range -> Mix)', () => {
        const map1 = {
          ...baseMap,
          mappings: [[[0, 0, 0, 0], [10]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const map2 = {
          ...baseMap,
          sources: ['level3.js'],
          mappings: [[[0, 0, 0, 0], [10]]],
          rangeMappings: [[0]],
        } satisfies DecodedSourceMap;

        const map3 = {
          ...baseMap,
          mappings: [[[2, 0, 0, 10], [4], [6, 0, 0, 20], [8, 0, 0, 30], [9]]],
          rangeMappings: [[0, 3]],
          sources: ['helloworld.js'],
        } satisfies DecodedSourceMap;

        const source3 = MapSource(new TraceMap(map3), [
          OriginalSource(`${sourceRoot}/helloworld.js`, '', false),
        ]);
        const source2 = MapSource(new TraceMap(map2), [source3]);
        const tree = MapSource(new TraceMap(map1), [source2]);

        const traced = toDecodedMap(traceMappings(tree));
        assert.deepEqual(traced.mappings, [
          [[2, 0, 0, 10], [4], [6, 0, 0, 20], [8, 0, 0, 30], [9]],
        ]);
        assert.deepEqual(traced.rangeMappings, [[0, 3]]);
      });
    });
  });

  describe('originalPositionFor()', () => {
    const map = {
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
    } satisfies DecodedSourceMap;
    const tree = MapSource(new TraceMap(map), [OriginalSource('child.js', '', false)]);

    function tracePosition(
      source: any,
      line: number,
      col: number,
      name: string,
      rangeBounds?: [number, number, number, number],
    ) {
      const gen = new GenMapping();
      originalPositionFor(gen, 0, 0, source, line, col, name, rangeBounds);
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
