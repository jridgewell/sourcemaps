/// <reference lib="esnext" />

import assert from 'node:assert/strict';
import {
  FlattenMap,
  allGeneratedPositionsFor,
  originalPositionFor,
  sourceContentFor,
  isIgnored,
  encodedMappings,
  decodedMappings,
  decodedRangeMappings,
  encodedRangeMappings,
  type SectionedSourceMap,
  type SourceMapSegment,
} from '../src/trace-mapping';

describe('FlattenMap', () => {
  const map: SectionedSourceMap = {
    version: 3,
    file: 'sectioned.js',
    sections: [
      {
        offset: { line: 1, column: 1 },
        map: {
          version: 3,
          sections: [
            {
              offset: { line: 0, column: 1 },
              map: {
                version: 3,
                names: ['first'],
                sources: ['first.js'],
                sourcesContent: ['firstsource'],
                mappings: 'AAAAA,CAAC',
                ignoreList: [0],
              },
            },
            {
              offset: { line: 0, column: 2 },
              map: {
                version: 3,
                names: ['second'],
                sources: ['second.js'],
                sourcesContent: ['secondsource'],
                mappings: 'AAAAA;AAAA',
              },
            },
          ],
        },
      },
      {
        offset: { line: 2, column: 0 },
        map: {
          version: 3,
          sections: [
            {
              offset: { line: 0, column: 0 },
              map: {
                version: 3,
                names: ['third'],
                sources: ['third.js'],
                sourcesContent: ['thirdsource'],
                sourceRoot: 'nested',
                mappings: 'AAAAA,CAAA;AAAA',
                rangeMappings: 'A',
              },
            },
            {
              offset: { line: 0, column: 1 },
              map: {
                version: 3,
                names: [],
                sources: ['fourth.js'],
                sourcesContent: ['fourthsource'],
                mappings: [[[0, 0, 0, 0]]],
                ignoreList: [0],
                rangeMappings: [[0]],
              },
            },
          ],
        },
      },
    ],
  };

  describe('map properties', () => {
    it('version', () => {
      const tracer = new FlattenMap(map);
      assert.equal(tracer.version, map.version);
    });

    it('file', () => {
      const tracer = new FlattenMap(map);
      assert.equal(tracer.file, map.file);
    });

    it('sourceRoot', () => {
      const tracer = new FlattenMap(map);
      assert.equal(tracer.sourceRoot, undefined);
    });

    it('sources', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.sources, ['first.js', 'second.js', 'nested/third.js', 'fourth.js']);
    });

    it('names', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.names, ['first', 'second', 'third']);
    });

    it('encodedMappings', () => {
      const tracer = new FlattenMap(map);
      assert.equal(encodedMappings(tracer), ';EAAAA,CCAAC;ACAAC,CCAA');
    });

    it('decodedMappings', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(decodedMappings(tracer), [
        [],
        [
          [2, 0, 0, 0, 0],
          [3, 1, 0, 0, 1],
        ],
        [
          [0, 2, 0, 0, 2],
          [1, 3, 0, 0],
        ],
      ]);
    });

    it('sourcesContent', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.sourcesContent, [
        'firstsource',
        'secondsource',
        'thirdsource',
        'fourthsource',
      ]);
    });

    it('ignoreList', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(tracer.ignoreList, [0, 3]);
    });

    it('rangeMappings', () => {
      const tracer = new FlattenMap(map);
      assert.deepEqual(decodedRangeMappings(tracer), [[], [], [0, 1]]);
      assert.deepEqual(encodedRangeMappings(tracer), ';;AB');
    });
  });

  describe('shared sources', () => {
    it('finds every generated position across encoded sections', () => {
      const input: SectionedSourceMap = {
        version: 3,
        sections: [0, 1].map((line) => ({
          offset: { line, column: 0 },
          map: {
            version: 3,
            sources: ['original.js'],
            sourcesContent: ['original source'],
            names: ['name' + line],
            mappings: 'AAAAA',
          },
        })),
      };
      const before = JSON.stringify(input);
      const tracer = new FlattenMap(JSON.stringify(input));

      assert.deepEqual(tracer.sources, ['original.js']);
      assert.deepEqual(tracer.names, ['name0', 'name1']);
      assert.deepEqual(tracer.sourcesContent, ['original source']);
      assert.deepEqual(
        allGeneratedPositionsFor(tracer, { source: 'original.js', line: 1, column: 0 }),
        [
          { line: 1, column: 0 },
          { line: 2, column: 0 },
        ],
      );
      assert.deepEqual(originalPositionFor(tracer, { line: 2, column: 0 }), {
        source: 'original.js',
        line: 1,
        column: 0,
        name: 'name1',
      });
      assert.equal(JSON.stringify(input), before);
    });

    it('remaps repeated indices within a decoded section', () => {
      const tracer = new FlattenMap({
        version: 3,
        sections: [
          {
            offset: { line: 0, column: 2 },
            map: {
              version: 3,
              sources: ['original.js', 'original.js'],
              sourcesContent: ['first content', 'later content'],
              names: [],
              mappings: [
                [
                  [0, 0, 0, 0],
                  [3, 1, 0, 0],
                ],
              ],
            },
          },
        ],
      });

      assert.deepEqual(decodedMappings(tracer), [
        [
          [2, 0, 0, 0],
          [5, 0, 0, 0],
        ],
      ]);
      assert.deepEqual(
        allGeneratedPositionsFor(tracer, { source: 'original.js', line: 1, column: 0 }),
        [
          { line: 1, column: 2 },
          { line: 1, column: 5 },
        ],
      );
      assert.equal(sourceContentFor(tracer, 'original.js'), 'first content');
    });

    it('shares resolved URLs across nested sections without merging distinct URLs', () => {
      const input: SectionedSourceMap = {
        version: 3,
        sections: [
          {
            offset: { line: 0, column: 0 },
            map: {
              version: 3,
              sourceRoot: '../src',
              sources: ['shared.js'],
              names: [],
              mappings: [[[0, 0, 0, 0]]],
            },
          },
          {
            offset: { line: 1, column: 0 },
            map: {
              version: 3,
              sections: [
                {
                  offset: { line: 0, column: 0 },
                  map: {
                    version: 3,
                    sourceRoot: '..',
                    sources: ['src/shared.js'],
                    names: [],
                    mappings: [[[0, 0, 1, 0]]],
                  },
                },
                {
                  offset: { line: 1, column: 0 },
                  map: {
                    version: 3,
                    sourceRoot: '../other',
                    sources: ['shared.js'],
                    names: [],
                    mappings: [[[0, 0, 0, 0]]],
                  },
                },
              ],
            },
          },
        ],
      };
      const before = JSON.stringify(input);
      const tracer = new FlattenMap(input, 'https://example.com/maps/bundle.js.map');

      assert.deepEqual(tracer.sources, [
        'https://example.com/src/shared.js',
        'https://example.com/other/shared.js',
      ]);
      assert.deepEqual(decodedMappings(tracer), [[[0, 0, 0, 0]], [[0, 0, 1, 0]], [[0, 1, 0, 0]]]);
      assert.deepEqual(
        allGeneratedPositionsFor(tracer, {
          source: 'https://example.com/src/shared.js',
          line: 2,
          column: 0,
        }),
        [{ line: 2, column: 0 }],
      );
      assert.equal(
        originalPositionFor(tracer, { line: 3, column: 0 }).source,
        'https://example.com/other/shared.js',
      );
      assert.equal(JSON.stringify(input), before);
    });

    it('remaps and deduplicates ignore indices while retaining the first source content', () => {
      const tracer = new FlattenMap({
        version: 3,
        sections: [
          {
            offset: { line: 0, column: 0 },
            map: {
              version: 3,
              sources: ['shared.js'],
              names: [],
              mappings: [[[0, 0, 0, 0]]],
            },
          },
          {
            offset: { line: 1, column: 0 },
            map: {
              version: 3,
              sources: ['other.js', 'shared.js'],
              sourcesContent: ['other content', 'later content'],
              ignoreList: [1, 0, 1],
              names: [],
              mappings: [
                [
                  [0, 1, 0, 0],
                  [3, 0, 0, 0],
                ],
              ],
            },
          },
        ],
      });

      assert.deepEqual(tracer.sourcesContent, [null, 'other content']);
      assert.deepEqual(tracer.ignoreList, [0, 1]);
      assert.equal(isIgnored(tracer, 'shared.js'), true);
      assert.equal(isIgnored(tracer, 'other.js'), true);
    });

    it('preserves section clipping, names and range markers when remapping sources', () => {
      const tracer = new FlattenMap({
        version: 3,
        sections: [
          {
            offset: { line: 0, column: 0 },
            map: {
              version: 3,
              sources: ['shared.js'],
              names: ['first'],
              mappings: [[[0, 0, 0, 0, 0], [3, 0, 0, 3, 0], [5]]],
              rangeMappings: [[0, 1]],
            },
          },
          {
            offset: { line: 0, column: 3 },
            map: {
              version: 3,
              sources: ['shared.js'],
              names: ['second'],
              mappings: [[[0, 0, 1, 0, 0], [4]]],
              rangeMappings: [[0]],
            },
          },
        ],
      });

      assert.deepEqual(decodedMappings(tracer), [[[0, 0, 0, 0, 0], [3, 0, 1, 0, 1], [7]]]);
      assert.deepEqual(decodedRangeMappings(tracer), [[0, 1]]);
      assert.deepEqual(tracer.names, ['first', 'second']);
    });

    it('leaves a non-sectioned map unchanged', () => {
      const tracer = new FlattenMap({
        version: 3,
        sources: ['original.js', 'original.js'],
        names: [],
        mappings: [
          [
            [0, 0, 0, 0],
            [3, 1, 0, 0],
          ],
        ],
      });

      assert.deepEqual(tracer.sources, ['original.js', 'original.js']);
      assert.deepEqual(decodedMappings(tracer), [
        [
          [0, 0, 0, 0],
          [3, 1, 0, 0],
        ],
      ]);
    });
  });

  describe('typescript readonly type', () => {
    it('decoded source map', () => {
      // This is a TS lint test, not a real one.
      const decodedMap = {
        version: 3 as const,
        sources: ['input.js'] as readonly string[],
        names: [] as readonly string[],
        mappings: [] as readonly SourceMapSegment[][],
        sourcesContent: [] as readonly string[],
      };

      new FlattenMap(decodedMap);
    });
  });
});
