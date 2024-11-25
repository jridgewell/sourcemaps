/* eslint-env node, mocha */

import {
  decodeGeneratedRanges,
  decodeOriginalScopes,
  encodeGeneratedRanges,
  encodeOriginalScopes,
} from '../src/scopes';
import { strict as assert } from 'assert';
import type { GeneratedRange, OriginalScope } from '../src/scopes';

describe('scopes proposal', () => {
  type Tuple<T> = Pick<T, Extract<keyof T, number>>;
  function init<T>(
    init: Tuple<T>,
    data: Pick<T, Exclude<keyof T, keyof number[] | `${number}`>>,
  ): T {
    return Object.assign(init, data) as T;
  }

  describe('original scopes', () => {
    let tests: { encoded: string[]; decoded: OriginalScope[][]; only?: true }[] = [
      {
        encoded: ['AACAAC,AAECAE,EC,CAECCE,GC,E2C'],
        decoded: [
          [
            init([0, 0, 8, 43, 1], { vars: [0, 1] }),
            init([0, 0, 2, 1, 2, 0], { vars: [2] }),
            init([3, 0, 6, 1, 2, 1], { vars: [2] }),
          ],
        ],
      },
      {
        encoded: ['AACAAC,GgBECEG,EG,CC', 'AACACIK,EkBECIG,EC,EkBECKG,EC,GY'],
        decoded: [
          [init([0, 0, 6, 1, 1], { vars: [0, 1] }), init([3, 16, 5, 3, 2, 2], { vars: [3] })],
          [
            init([0, 0, 11, 12, 1], { vars: [1, 4, 5] }),
            init([2, 18, 4, 1, 2, 4], { vars: [3] }),
            init([6, 18, 8, 1, 2, 5], { vars: [3] }),
          ],
        ],
      },
      {
        encoded: ['AACAAC,GmB', 'AACAEA,CqBECAG,EC,AC'],
        decoded: [
          [init([0, 0, 3, 19, 1], { vars: [0, 1] })],
          [init([0, 0, 3, 1, 1], { vars: [2, 0] }), init([1, 21, 3, 1, 2, 0], { vars: [3] })],
        ],
      },
      {
        encoded: ['AACAACEG,EgBECCI,EC,EkBECEI,EC,EkBECGIK,GkBIA,EG,CC,GY'],
        decoded: [
          [
            init([0, 0, 19, 12, 1], { vars: [0, 1, 2, 3] }),
            init([2, 16, 4, 1, 2, 1], { vars: [4] }),
            init([6, 18, 8, 1, 2, 2], { vars: [4] }),
            init([10, 18, 16, 1, 2, 3], { vars: [4, 5] }),
            init([13, 18, 15, 3, 4], { vars: [] }),
          ],
        ],
      },
      {
        encoded: ['AACAAC,AkBECAE,EC,IO'],
        decoded: [
          [init([0, 0, 6, 7, 1], { vars: [0, 1] }), init([0, 18, 2, 1, 2, 0], { vars: [2] })],
        ],
      },
      {
        encoded: ['AACA,AAIAA,GEIAA,GG,EC,AC'],
        decoded: [
          [
            init([0, 0, 8, 1, 1], { vars: [] }),
            init([0, 0, 8, 1, 4], { vars: [0] }),
            init([3, 2, 6, 3, 4], { vars: [0] }),
          ],
        ],
      },
      {
        encoded: ['AACAA,AAECACEG,CEECCIK,GG,GC,CS'],
        decoded: [
          [
            init([0, 0, 8, 9, 1], { vars: [0] }),
            init([0, 0, 7, 1, 2, 0], { vars: [1, 2, 3] }),
            init([1, 2, 4, 3, 2, 1], { vars: [4, 5] }),
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
          init([0, 0, 2, 43, 0, 0], { isScope: true, callsite: null, bindings: [[[-1]], [[-1]]] }),
          init([0, 0, 1, 30, 0, 2], { isScope: false, callsite: [0, 7, 0], bindings: [[[3]]] }),
          init([0, 0, 0, 27, 0, 1], { isScope: false, callsite: [0, 4, 2], bindings: [[[4]]] }),
        ],
      },
      {
        encoded:
          'AKCADDD,ACDAMD,AGCECUAO,AGADAHEO,AGDCAJEO,gB,A,A,A,ACADMD,AGCEAQAQ,AGADAJEQ,AGDCAJEQ,kB,A,A,A,A',
        decoded: [
          init([0, 0, 0, 34, 1, 0], {
            isScope: true,
            callsite: null,
            bindings: [[[-1]], [[-1]], [[-1]]],
          }),
          init([0, 0, 0, 16, 0, 0], { isScope: false, callsite: null, bindings: [[[6]], [[-1]]] }),
          init([0, 0, 0, 16, 1, 2], { isScope: false, callsite: [1, 10, 0], bindings: [[[7]]] }),
          init([0, 0, 0, 16, 1, 1], { isScope: false, callsite: [1, 7, 2], bindings: [[[7]]] }),
          init([0, 0, 0, 16, 0, 1], { isScope: false, callsite: [1, 3, 2], bindings: [[[7]]] }),
          init([0, 16, 0, 34, 0, 0], { isScope: false, callsite: null, bindings: [[[6]], [[-1]]] }),
          init([0, 16, 0, 34, 1, 2], { isScope: false, callsite: [1, 11, 0], bindings: [[[8]]] }),
          init([0, 16, 0, 34, 1, 1], { isScope: false, callsite: [1, 7, 2], bindings: [[[8]]] }),
          init([0, 16, 0, 34, 0, 1], { isScope: false, callsite: [1, 3, 2], bindings: [[[8]]] }),
        ],
      },
      {
        encoded: 'AKAADI,ACCAKD;;AGACAEAM;;qB;iB,A',
        decoded: [
          init([0, 0, 5, 17, 0, 0], { isScope: true, callsite: null, bindings: [[[-1]], [[4]]] }),
          init([0, 0, 5, 17, 1, 0], { isScope: false, callsite: null, bindings: [[[5]], [[-1]]] }),
          init([2, 0, 4, 21, 1, 1], { isScope: false, callsite: [0, 2, 0], bindings: [[[6]]] }),
        ],
      },
      {
        encoded: 'AKAAMDDD,aKAGOQ,yDGADAcIO,AGADAPEO,c,A,C,c',
        decoded: [
          init([0, 0, 0, 99, 0, 0], {
            isScope: true,
            callsite: null,
            bindings: [[[6]], [[-1]], [[-1]], [[-1]]],
          }),
          init([0, 13, 0, 85, 0, 3], { isScope: true, callsite: null, bindings: [[[7]], [[8]]] }),
          init([0, 70, 0, 84, 0, 2], { isScope: false, callsite: [0, 14, 4], bindings: [[[7]]] }),
          init([0, 70, 0, 84, 0, 1], { isScope: false, callsite: [0, 7, 2], bindings: [[[7]]] }),
        ],
      },
      {
        encoded: 'AKAADFGCAI,AGACAICG,mB;AGAAAEAI,mB,A',
        decoded: [
          init([0, 0, 1, 19, 0, 0], {
            isScope: true,
            callsite: null,
            bindings: [[[-1]], [[3], [4, 1, 0]]],
          }),
          init([0, 0, 0, 19, 0, 1], { isScope: false, callsite: [0, 4, 1], bindings: [[[3]]] }),
          init([1, 0, 1, 19, 0, 1], { isScope: false, callsite: [0, 6, 0], bindings: [[[4]]] }),
        ],
      },
      {
        encoded: 'AKAA,AKACC;;;ECACE;kB;;C,A',
        decoded: [
          init([0, 0, 6, 1, 0, 0], { isScope: true, callsite: null, bindings: [] }),
          init([0, 0, 6, 1, 0, 1], { isScope: true, callsite: null, bindings: [[[1]]] }),
          init([3, 2, 4, 18, 0, 2], { isScope: false, callsite: null, bindings: [[[2]]] }),
        ],
      },
      {
        encoded: 'AKAAM,AKACOQS;EKACQS;;;G;;;C;K',
        decoded: [
          init([0, 0, 8, 5, 0, 0], { isScope: true, callsite: null, bindings: [[[6]]] }),
          init([0, 0, 7, 1, 0, 1], {
            isScope: true,
            callsite: null,
            bindings: [[[7]], [[8]], [[9]]],
          }),
          init([1, 2, 4, 3, 0, 2], { isScope: true, callsite: null, bindings: [[[8]], [[9]]] }),
        ],
      },
    ];

    const filtered = tests.filter((test) => {
      return test.only;
    });

    tests = filtered.length ? filtered : tests;

    describe('decodeGeneratedRanges()', () => {
      tests.forEach((test, i) => {
        it('decodes sample ' + i, () => {
          assert.deepEqual(decodeGeneratedRanges(test.encoded), test.decoded);
        });
      });
    });

    describe('encodeGeneratedRanges()', () => {
      tests.forEach((test, i) => {
        it('encodes sample ' + i, () => {
          assert.deepEqual(encodeGeneratedRanges(test.decoded), test.encoded);
        });
      });
    });
  });
});
