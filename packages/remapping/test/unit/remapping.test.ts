import remapping from '../../src/remapping';
import { type EncodedSourceMap } from '../../src/types';
import assert from 'node:assert/strict';

function stripUndefined(value: object) {
  return JSON.parse(JSON.stringify(value));
}

describe('remapping', () => {
  const rawMap: EncodedSourceMap = {
    file: 'transpiled.min.js',
    // 0th column of 1st line of output file translates into the 1st source
    // file, line 2, column 1, using 1st name.
    mappings: 'AACCA',
    names: ['add'],
    sources: ['transpiled.js'],
    sourcesContent: ['1+1'],
    version: 3,
    ignoreList: [],
  };
  const transpiledMap: EncodedSourceMap = {
    // 1st column of 2nd line of output file translates into the 1st source
    // file, line 3, column 2
    mappings: ';CAEE',
    names: [],
    sources: ['helloworld.js'],
    sourcesContent: ['\n\n  1 + 1;'],
    version: 3,
    ignoreList: [],
  };
  const translatedMap: EncodedSourceMap = {
    file: 'transpiled.min.js',
    // 0th column of 1st line of output file translates into the 1st source
    // file, line 3, column 2, using first name
    mappings: 'AAEEA',
    names: ['add'],
    // TODO: support sourceRoot
    // sourceRoot: '',
    sources: ['helloworld.js'],
    sourcesContent: ['\n\n  1 + 1;'],
    version: 3,
    ignoreList: [],
  };

  it('does not alter a lone sourcemap', () => {
    const map = remapping(rawMap, () => null);
    assert.deepEqual(stripUndefined(map), rawMap);
  });

  it('traces SourceMapSegments through child sourcemaps', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return transpiledMap;
      }
    });

    assert.deepEqual(stripUndefined(map), translatedMap);
  });

  it('traces transformations through sourcemap', () => {
    const maps = [rawMap, transpiledMap];
    const map = remapping(maps, () => null);

    assert.deepEqual(stripUndefined(map), translatedMap);
  });

  it('resolves sourcemaps realtive to sourceRoot', () => {
    const sourceRoot = 'foo/';
    const map = remapping(
      {
        ...rawMap,
        sourceRoot,
      },
      (name: string) => {
        if (name.endsWith('transpiled.js')) {
          return transpiledMap;
        }
      },
    );

    assert.deepEqual(stripUndefined(map), {
      ...translatedMap,
      // TODO: support sourceRoot
      // sourceRoot,
      sources: ['foo/helloworld.js'],
    });
  });

  it('resolves sourcemaps realtive to absolute sourceRoot', () => {
    const sourceRoot = 'https://foo.com/';
    const map = remapping(
      {
        ...rawMap,
        sourceRoot,
      },
      (name: string) => {
        if (name.endsWith('transpiled.js')) {
          return transpiledMap;
        }
      },
    );

    assert.deepEqual(stripUndefined(map), {
      ...translatedMap,
      // TODO: support sourceRoot
      // sourceRoot,
      sources: [`${sourceRoot}helloworld.js`],
    });
  });

  it('includes null sourceContent if sourcemap has no sourcesContent', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          sourcesContent: undefined,
        };
      }
    });

    assert.deepEqual(map.sourcesContent, [null]);
  });

  it('excludes null sourceContent if sourcemap is not self-containing', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          sourcesContent: [null],
        };
      }
    });

    assert.deepEqual(map.sourcesContent, [null]);
  });

  it('ignores if original source is ignored', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          ignoreList: [0],
        };
      }
    });

    assert.deepEqual(map.ignoreList, [0]);
  });

  it('unignores if sourcemap has no ignoreList', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          ignoreList: undefined,
        };
      }
    });

    assert.deepEqual(map.ignoreList, []);
  });

  it('unignores if sourcemap unignores original source', () => {
    const map = remapping(rawMap, (name: string) => {
      if (name === 'transpiled.js') {
        return {
          ...transpiledMap,
          ignoreList: [],
        };
      }
    });

    assert.deepEqual(map.ignoreList, []);
  });

  describe('boolean options', () => {
    it('excludes sourcesContent if `excludeContent` is set', () => {
      const map = remapping(
        rawMap,
        (name: string) => {
          if (name === 'transpiled.js') {
            return transpiledMap;
          }
        },
        true,
      );

      assert(!('sourcesContent' in map));
    });
  });

  describe('options bag', () => {
    it('excludes sourcesContent if `excludeContent` is set', () => {
      const map = remapping(
        rawMap,
        (name: string) => {
          if (name === 'transpiled.js') {
            return transpiledMap;
          }
        },
        { excludeContent: true },
      );

      assert(!('sourcesContent' in map));
    });

    it('returns decoded sourcemap if `decodedMappings` is set', () => {
      const map = remapping(
        rawMap,
        (name: string) => {
          if (name === 'transpiled.js') {
            return transpiledMap;
          }
        },
        { decodedMappings: true },
      );

      assert.deepEqual(map.mappings, [[[0, 0, 2, 2, 0]]]);
    });
  });
});
