/* eslint-env node, mocha */

import {
  decodeGeneratedRanges,
  decodeOriginalScopes,
  encodeGeneratedRanges,
  encodeOriginalScopes,
} from '../src/scopes';
import { strict as assert } from 'assert';
import type { CallSite, ExpressionBinding, GeneratedRange, OriginalScope } from '../src/scopes';

describe('scopes proposal', () => {
  function vars(scope: OriginalScope, vars: number[]) {
    scope.vars = vars;
    return scope;
  }
  function scope(range: GeneratedRange, isScope?: boolean) {
    range.isScope = isScope;
    return range;
  }
  function callsite(range: GeneratedRange, callsite?: CallSite) {
    range.callsite = callsite;
    return range;
  }
  function bindings(range: GeneratedRange, bindings?: ExpressionBinding[][]) {
    range.bindings = bindings;
    return range;
  }

  describe('original scopes', () => {
    let tests: { encoded: string[]; decoded: OriginalScope[][]; only?: true }[] = [
      {
        encoded: ['AACAAC,AAECAE,EC,CAECCE,GC,E2C'],
        decoded: [
          [
            vars([0, 0, 8, 43, 1], [0, 1]),
            vars([0, 0, 2, 1, 2, 0], [2]),
            vars([3, 0, 6, 1, 2, 1], [2]),
          ],
        ],
      },
      {
        encoded: ['AACAAC,GgBECEG,EG,CC', 'AACACIK,EkBECIG,EC,EkBECKG,EC,GY'],
        decoded: [
          [vars([0, 0, 6, 1, 1], [0, 1]), vars([3, 16, 5, 3, 2, 2], [3])],
          [
            vars([0, 0, 11, 12, 1], [1, 4, 5]),
            vars([2, 18, 4, 1, 2, 4], [3]),
            vars([6, 18, 8, 1, 2, 5], [3]),
          ],
        ],
      },
      {
        encoded: ['AACAAC,GmB', 'AACAEA,CqBECAG,EC,AC'],
        decoded: [
          [vars([0, 0, 3, 19, 1], [0, 1])],
          [vars([0, 0, 3, 1, 1], [2, 0]), vars([1, 21, 3, 1, 2, 0], [3])],
        ],
      },
      {
        encoded: ['AACAACEG,EgBECCI,EC,EkBECEI,EC,EkBECGIK,GkBIA,EG,CC,GY'],
        decoded: [
          [
            vars([0, 0, 19, 12, 1], [0, 1, 2, 3]),
            vars([2, 16, 4, 1, 2, 1], [4]),
            vars([6, 18, 8, 1, 2, 2], [4]),
            vars([10, 18, 16, 1, 2, 3], [4, 5]),
            [13, 18, 15, 3, 4],
          ],
        ],
      },
      {
        encoded: ['AACAAC,AkBECAE,EC,IO'],
        decoded: [[vars([0, 0, 6, 7, 1], [0, 1]), vars([0, 18, 2, 1, 2, 0], [2])]],
      },
      {
        encoded: ['AACA,AAIAA,GEIAA,GG,EC,AC'],
        decoded: [[[0, 0, 8, 1, 1], vars([0, 0, 8, 1, 4], [0]), vars([3, 2, 6, 3, 4], [0])]],
      },
      {
        encoded: ['AACAA,AAECACEG,CEECCIK,GG,GC,CS'],
        decoded: [
          [
            vars([0, 0, 8, 9, 1], [0]),
            vars([0, 0, 7, 1, 2, 0], [1, 2, 3]),
            vars([1, 2, 4, 3, 2, 1], [4, 5]),
          ],
        ],
      },
    ];

    const filtered = tests.filter((test) => {
      return test.only;
    });

    tests = filtered.length ? filtered : tests;

    describe('decodeOriginalScopes()', () => {
      tests.forEach((test, i) => {
        test.encoded.forEach((encoded, j) => {
          it(`decodes sample ${i}, source ${j}`, () => {
            assert.deepEqual(decodeOriginalScopes(encoded), test.decoded[j]);
          });
        });
      });
    });

    describe('encodeOriginalScopes()', () => {
      tests.forEach((test, i) => {
        test.decoded.forEach((decoded, j) => {
          it(`encodes sample ${i}, source ${j}`, () => {
            assert.deepEqual(encodeOriginalScopes(decoded), test.encoded[j]);
          });
        });
      });
    });
  });

  describe('generated ranges', () => {
    let tests: { encoded: string; decoded: GeneratedRange[]; only?: true }[] = [
      {
        encoded: 'AKAADD,AGAEAOAG,AGADAHEI,2B;8B;2C',
        decoded: [
          bindings(scope([0, 0, 2, 43, 0, 0], true), [[[-1]], [[-1]]]),
          bindings(callsite([0, 0, 1, 30, 0, 2], [0, 7, 0]), [[[3]]]),
          bindings(callsite([0, 0, 0, 27, 0, 1], [0, 4, 2]), [[[4]]]),
        ],
      },
      {
        encoded:
          'AKCADDD,ACDAMD,AGCECUAO,AGADAHEO,AGDCAJEO,gB,A,A,A,ACADMD,AGCEAQAQ,AGADAJEQ,AGDCAJEQ,kB,A,A,A,A',
        decoded: [
          bindings(scope([0, 0, 0, 34, 1, 0], true), [[[-1]], [[-1]], [[-1]]]),
          bindings([0, 0, 0, 16, 0, 0], [[[6]], [[-1]]]),
          bindings(callsite([0, 0, 0, 16, 1, 2], [1, 10, 0]), [[[7]]]),
          bindings(callsite([0, 0, 0, 16, 1, 1], [1, 7, 2]), [[[7]]]),
          bindings(callsite([0, 0, 0, 16, 0, 1], [1, 3, 2]), [[[7]]]),
          bindings([0, 16, 0, 34, 0, 0], [[[6]], [[-1]]]),
          bindings(callsite([0, 16, 0, 34, 1, 2], [1, 11, 0]), [[[8]]]),
          bindings(callsite([0, 16, 0, 34, 1, 1], [1, 7, 2]), [[[8]]]),
          bindings(callsite([0, 16, 0, 34, 0, 1], [1, 3, 2]), [[[8]]]),
        ],
      },
      {
        encoded: 'AKAADI,ACCAKD;;AGACAEAM;;qB;iB,A',
        decoded: [
          bindings(scope([0, 0, 5, 17, 0, 0], true), [[[-1]], [[4]]]),
          bindings([0, 0, 5, 17, 1, 0], [[[5]], [[-1]]]),
          bindings(callsite([2, 0, 4, 21, 1, 1], [0, 2, 0]), [[[6]]]),
        ],
      },
      {
        encoded: 'AKAAMDDD,aKAGOQ,yDGADAcIO,AGADAPEO,c,A,C,c',
        decoded: [
          bindings(scope([0, 0, 0, 99, 0, 0], true), [[[6]], [[-1]], [[-1]], [[-1]]]),
          bindings(scope([0, 13, 0, 85, 0, 3], true), [[[7]], [[8]]]),
          bindings(callsite([0, 70, 0, 84, 0, 2], [0, 14, 4]), [[[7]]]),
          bindings(callsite([0, 70, 0, 84, 0, 1], [0, 7, 2]), [[[7]]]),
        ],
      },
      {
        encoded: 'AKAADGFCAI,AGACAICG,mB;AGAAAEAI,mB,A',
        decoded: [
          bindings(scope([0, 0, 1, 19, 0, 0], true), [[[-1]], [[3], [4, 1, 0]]]),
          bindings(callsite([0, 0, 0, 19, 0, 1], [0, 4, 1]), [[[3]]]),
          bindings(callsite([1, 0, 1, 19, 0, 1], [0, 6, 0]), [[[4]]]),
        ],
      },
      {
        encoded: 'AKAA,AKACC;;;ECACE;kB;;C,A',
        decoded: [
          scope([0, 0, 6, 1, 0, 0], true),
          bindings(scope([0, 0, 6, 1, 0, 1], true), [[[1]]]),
          bindings([3, 2, 4, 18, 0, 2], [[[2]]]),
        ],
      },
      {
        encoded: 'AKAAM,AKACOQS;EKACQS;;;G;;;C;K',
        decoded: [
          bindings(scope([0, 0, 8, 5, 0, 0], true), [[[6]]]),
          bindings(scope([0, 0, 7, 1, 0, 1], true), [[[7]], [[8]], [[9]]]),
          bindings(scope([1, 2, 4, 3, 0, 2], true), [[[8]], [[9]]]),
        ],
      },
    ];

    const filtered = tests.filter((test) => {
      return test.only;
    });

    tests = filtered.length ? filtered : tests;

    describe('decodeOriginalScopes()', () => {
      tests.forEach((test, i) => {
        it('decodes sample ' + i, () => {
          assert.deepEqual(decodeGeneratedRanges(test.encoded), test.decoded);
        });
      });
    });

    describe('encodeOriginalScopes()', () => {
      tests.forEach((test, i) => {
        it('encodes sample ' + i, () => {
          assert.deepEqual(encodeGeneratedRanges(test.decoded), test.encoded);
        });
      });
    });
  });
});
