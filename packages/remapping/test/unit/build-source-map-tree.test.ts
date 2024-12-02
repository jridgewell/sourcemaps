import buildSourceMapTree from '../../src/build-source-map-tree';
import {
  type DecodedSourceMap,
  type EncodedSourceMap,
  type SourceMapLoader,
} from '../../src/types';
import assert from 'node:assert/strict';
import sinon from 'sinon';
import { assertMatchObject } from './util';

const nullLoader: SourceMapLoader = () => null;
function loaderFake<T>(...args: T[]) {
  let i = 0;
  return sinon.fake((() => {
    if (i < args.length) return args[i++];
    return null;
  }) as SourceMapLoader);
}
function loaderImpl(cb: SourceMapLoader) {
  let called = false;
  return sinon.fake(((...args) => {
    if (called) return null;
    called = true;
    return cb(...args);
  }) as SourceMapLoader);
}

describe('buildSourceMapTree', () => {
  const rawMap: EncodedSourceMap = {
    mappings: 'AAAA',
    names: [],
    sources: ['helloworld.js'],
    sourcesContent: [null],
    version: 3,
  };
  const decodedMap: DecodedSourceMap = {
    ...rawMap,
    mappings: [[[0, 0, 0, 0]]],
  };

  it('calls loader for any needed sourcemap', () => {
    const loader = sinon.fake(nullLoader);
    buildSourceMapTree(decodedMap, loader);

    assert.equal(loader.callCount, 1);
    assert(loader.calledWithExactly('helloworld.js', sinon.match.any));
  });

  it('loader cannot be async', () => {
    // tslint:disable-next-line: no-any
    const loader = (): any => Promise.resolve(null);
    assert.throws(() => {
      buildSourceMapTree(decodedMap, loader);
    });
  });

  it('creates OriginalSource if no sourcemap', () => {
    const tree = buildSourceMapTree(decodedMap, nullLoader);
    assertMatchObject(tree.sources, [
      {
        source: 'helloworld.js',
      },
    ]);
  });

  it('creates OriginalSource with sourceContent', () => {
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sourcesContent: ['1 + 1'],
      },
      nullLoader,
    );

    assertMatchObject(tree.sources, [
      {
        content: '1 + 1',
      },
    ]);
  });

  it('creates OriginalSource with null content if no sourceContent', () => {
    const tree = buildSourceMapTree(decodedMap, nullLoader);
    assertMatchObject(tree.sources, [
      {
        content: null,
      },
    ]);
  });

  it('creates OriginalSource with null content if no sourcesContent', () => {
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        sourcesContent: undefined,
      },
      nullLoader,
    );

    assertMatchObject(tree.sources, [
      {
        content: null,
      },
    ]);
  });

  it('creates ignored OriginalSource with ignoreList', () => {
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        ignoreList: [0],
      },
      nullLoader,
    );

    assertMatchObject(tree.sources, [
      {
        ignore: true,
      },
    ]);
  });

  it('creates unignored OriginalSource if no ignoreList', () => {
    const tree = buildSourceMapTree(decodedMap, nullLoader);
    assertMatchObject(tree.sources, [
      {
        ignore: false,
      },
    ]);
  });

  it('creates unignored OriginalSource with if no ignoreList', () => {
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        ignoreList: undefined,
      },
      nullLoader,
    );

    assertMatchObject(tree.sources, [
      {
        ignore: false,
      },
    ]);
  });

  it('recursively loads sourcemaps', () => {
    const loader = loaderFake({
      ...rawMap,
      sources: ['two.js'],
    });
    const tree = buildSourceMapTree(decodedMap, loader);

    assertMatchObject(tree.sources, [
      {
        sources: [
          {
            source: 'two.js',
          },
        ],
      },
    ]);

    assert.equal(loader.callCount, 2);
    assert(loader.calledWith('helloworld.js', sinon.match.any));
    assert(loader.calledWith('two.js', sinon.match.any));
  });

  it('calls loader with sourceRoot joined to source file', () => {
    const loader = sinon.fake(nullLoader);
    buildSourceMapTree(
      {
        ...decodedMap,
        sourceRoot: 'https://foo.com/',
      },
      loader,
    );

    assert.equal(loader.callCount, 1);
    assert(loader.calledWith('https://foo.com/helloworld.js', sinon.match.any));
  });

  it('original sources are relative to the tree path', () => {
    const loader = loaderFake(
      {
        ...rawMap,
        file: 'helloworld.js',
        sourceRoot: 'https://foo.com/',
        sources: ['./assets/two.js'],
      },
      {
        ...rawMap,
        file: 'two.js',
        // We need to support relative roots...
        sourceRoot: './deep/',
        sources: ['three.js'],
      },
    );
    const tree = buildSourceMapTree(decodedMap, loader);

    assertMatchObject(tree.sources, [
      {
        // helloworld.js's map
        sources: [
          {
            // two.js's map
            sources: [
              {
                source: 'https://foo.com/assets/deep/three.js',
              },
            ],
          },
        ],
      },
    ]);

    assert.equal(loader.callCount, 3);
    assert(loader.calledWith('helloworld.js', sinon.match.any));
    assert(loader.calledWith('https://foo.com/assets/two.js', sinon.match.any));
    assert(loader.calledWith('https://foo.com/assets/deep/three.js', sinon.match.any));
  });

  describe('loader context', () => {
    describe('importer', () => {
      it('is empty for sources loaded from the root', () => {
        const loader = sinon.fake();
        buildSourceMapTree(decodedMap, loader);

        assert.equal(loader.callCount, 1);
        assert(
          loader.calledWith(
            sinon.match.any,
            sinon.match({
              importer: '',
            }),
          ),
        );
      });

      it('is parent for nested sources', () => {
        const loader = loaderFake({
          ...rawMap,
          sources: ['two.js'],
        });
        buildSourceMapTree(decodedMap, loader);

        assert.equal(loader.callCount, 2);
        assert(
          loader.calledWith(
            'helloworld.js',
            sinon.match({
              importer: '',
            }),
          ),
        );
        assert(
          loader.calledWith(
            'two.js',
            sinon.match({
              importer: 'helloworld.js',
            }),
          ),
        );
      });
    });

    describe('depty', () => {
      it('is 1 for sources loaded from the root', () => {
        const loader = sinon.fake();
        buildSourceMapTree(
          {
            ...decodedMap,
            sources: ['first.js', 'second.js'],
          },
          loader,
        );

        assert.equal(loader.callCount, 2);
        assert(
          loader.calledWith(
            'first.js',
            sinon.match({
              depth: 1,
            }),
          ),
        );
        assert(
          loader.calledWith(
            'second.js',
            sinon.match({
              depth: 1,
            }),
          ),
        );
      });

      it('is increased for nested sources', () => {
        const loader = loaderFake({
          ...rawMap,
          sources: ['two.js'],
        });
        buildSourceMapTree(
          {
            ...decodedMap,
            sources: ['first.js', 'second.js'],
          },
          loader,
        );

        assert.equal(loader.callCount, 3);
        assert(
          loader.calledWith(
            'first.js',
            sinon.match({
              depth: 1,
            }),
          ),
        );
        assert(
          loader.calledWith(
            'two.js',
            sinon.match({
              depth: 2,
            }),
          ),
        );
        assert(
          loader.calledWith(
            'second.js',
            sinon.match({
              depth: 1,
            }),
          ),
        );
      });
    });

    describe('source', () => {
      it('matches the loader source param', () => {
        const loader = sinon.fake();
        buildSourceMapTree(decodedMap, loader);

        assert.equal(loader.callCount, 1);
        assert(
          loader.calledWith(
            'helloworld.js',
            sinon.match({
              source: 'helloworld.js',
            }),
          ),
        );
      });

      it('can be overridden to change source of original file', () => {
        const loader = loaderImpl((s, ctx) => {
          assert.equal(s, 'helloworld.js');
          ctx.source = 'bar/baz.js';
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        assertMatchObject(tree.sources, [
          {
            source: 'bar/baz.js',
          },
        ]);
      });

      it('can be overridden to change resolving location', () => {
        const loader = loaderImpl((s, ctx) => {
          assert.equal(s, 'helloworld.js');
          ctx.source = 'bar/baz.js';
          return {
            ...rawMap,
            sources: ['two.js'],
          };
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        assertMatchObject(tree.sources, [
          {
            sources: [
              {
                source: 'bar/two.js',
              },
            ],
          },
        ]);
      });
    });

    describe('content', () => {
      it('can override the sourcesContent of parent map', () => {
        const loader = loaderImpl((s, ctx) => {
          assert.equal(s, 'helloworld.js');
          ctx.content = 'override';
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        assertMatchObject(tree.sources, [
          {
            content: 'override',
          },
        ]);
      });

      it('can override the sourcesContent of parent map', () => {
        const loader = loaderImpl((s, ctx) => {
          assert.equal(s, 'helloworld.js');
          ctx.content = null;
        });

        const tree = buildSourceMapTree(
          {
            ...decodedMap,
            sourcesContent: ['it'],
          },
          loader,
        );

        assertMatchObject(tree.sources, [
          {
            content: null,
          },
        ]);
      });
    });

    describe('ignore', () => {
      it('can override the ignore of parent map', () => {
        const loader = loaderImpl((s, ctx) => {
          assert.equal(s, 'helloworld.js');
          ctx.ignore = true;
        });

        const tree = buildSourceMapTree(decodedMap, loader);

        assertMatchObject(tree.sources, [
          {
            ignore: true,
          },
        ]);
      });

      it('can override the sourcesContent of parent map', () => {
        const loader = loaderImpl((s, ctx) => {
          assert.equal(s, 'helloworld.js');
          ctx.ignore = false;
        });

        const tree = buildSourceMapTree(
          {
            ...decodedMap,
            ignoreList: [0],
          },
          loader,
        );

        assertMatchObject(tree.sources, [
          {
            ignore: false,
          },
        ]);
      });
    });
  });

  it('original sources are relative to the tree path, edge cases', () => {
    const loader = loaderFake(
      {
        ...rawMap,
        file: 'helloworld.js',
        sources: ['/two.js'],
      },
      {
        ...rawMap,
        file: 'two.js',
        // We need to support relative roots...
        // sourceRoot: './assets/',
        sources: ['./assets/three.js'],
      },
    );
    const tree = buildSourceMapTree(
      {
        ...decodedMap,
        // We shouldn't need this, but we need absolute URLs because our resolver
        // sucks.
        sourceRoot: 'https://foo.com/deep',
      },
      loader,
    );

    assertMatchObject(tree.sources, [
      {
        // helloworld.js's map
        sources: [
          {
            // two.js's map
            sources: [
              {
                source: 'https://foo.com/assets/three.js',
              },
            ],
          },
        ],
      },
    ]);

    assert.equal(loader.callCount, 3);
    assert(loader.calledWith('https://foo.com/deep/helloworld.js', sinon.match.any));
    assert(loader.calledWith('https://foo.com/two.js', sinon.match.any));
    assert(loader.calledWith('https://foo.com/assets/three.js', sinon.match.any));
  });

  describe('array form', () => {
    it('transformation maps of a sourcemap may be passed before the sourcemap', () => {
      const maps = [
        decodedMap, // "transformation map"
        decodedMap,
      ];
      const tree = buildSourceMapTree(maps, nullLoader);

      assertMatchObject(tree.sources, [
        {
          // helloworld.js's map
          sources: [
            {
              source: 'helloworld.js',
            },
          ],
        },
      ]);
    });

    it('transformation map does not influence map url', () => {
      const maps = [
        {
          ...decodedMap,
          sourceRoot: 'https://example.com/',
        }, // "transformation map"
        decodedMap,
      ];
      const tree = buildSourceMapTree(maps, nullLoader);

      assertMatchObject(tree.sources, [
        {
          // helloworld.js's map
          sources: [
            {
              source: 'helloworld.js',
            },
          ],
        },
      ]);
    });

    it('throws when transformation map has more than one source', () => {
      const maps = [
        {
          ...decodedMap,
          sources: ['one.js', 'two.js'],
        }, // "transformation map"
        decodedMap,
      ];

      assert.throws(() => {
        buildSourceMapTree(maps, nullLoader);
      });
    });

    it('handles when transformation map has 0 sources', () => {
      const maps = [
        {
          ...decodedMap,
          mappings: [],
          sources: [],
        }, // "transformation map"
        decodedMap,
      ];
      const loader = sinon.fake();

      const tree = buildSourceMapTree(maps, loader);
      assertMatchObject(tree.map, {
        sources: [],
      });
      assert.equal(loader.callCount, 1);
      assert(loader.calledWith('helloworld.js', sinon.match.any));
    });
  });

  describe('null source', () => {
    it('parses map with null source', () => {
      const loader = loaderFake({
        ...rawMap,
        sources: ['two.js'],
      });
      const tree = buildSourceMapTree(
        {
          ...decodedMap,
          sources: [null],
        },
        loader,
      );

      assertMatchObject(tree.map, {
        sources: [null],
      });

      assert(loader.calledWith('', sinon.match.any));
    });

    it('parses maps descending from null source', () => {
      const loader = loaderFake({
        ...rawMap,
        sources: ['two.js'],
      });
      const tree = buildSourceMapTree(
        {
          ...decodedMap,
          sources: [null],
        },
        loader,
      );

      assertMatchObject(tree.sources, [
        {
          sources: [
            {
              source: 'two.js',
            },
          ],
        },
      ]);

      assert(loader.calledWith('', sinon.match.any));
      assert(loader.calledWith('two.js', sinon.match.any));
    });

    it('parses maps descending from null source with sourceRoot', () => {
      const loader = loaderFake({
        ...rawMap,
        sources: ['two.js'],
      });
      const tree = buildSourceMapTree(
        {
          ...decodedMap,
          sourceRoot: 'https://foo.com/',
          sources: [null],
        },
        loader,
      );

      assertMatchObject(tree.sources, [
        {
          sources: [
            {
              source: 'https://foo.com/two.js',
            },
          ],
        },
      ]);

      assert(loader.calledWith('https://foo.com/', sinon.match.any));
      assert(loader.calledWith('https://foo.com/two.js', sinon.match.any));
    });
  });
});
