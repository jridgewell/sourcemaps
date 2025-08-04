/* eslint-env node, mocha */

import { decodeScopes, encodeScopes, type GeneratedRange, type OriginalScope } from '../src/scopes';
import assert from 'node:assert/strict';

describe.skip('scopes proposal', () => {
  type Tuple<T> = Pick<T, Extract<keyof T, number>>;
  type Data<T> = Partial<Pick<T, Exclude<keyof T, keyof number[] | `${number}`>>>;

  function init<T>(init: Tuple<T>, data: Data<T>): T {
    return Object.assign(init, data) as T;
  }

  describe('original scopes', () => {
    let tests: { encoded: string[]; decoded: OriginalScope[][]; only?: true }[] = [
      {
        encoded: ['BBAAC,DAC,BAAA,DCCB,BABA,DADBCrB'],
        decoded: [
          [
            init([0, 0, 8, 43, 1], { vars: [0, 1] }),
            init([0, 0, 2, 1, 2, 0], { vars: [2] }),
            init([3, 0, 6, 1, 2, 1], { vars: [2] }),
          ],
        ],
      },
      {
        encoded: ['BBAAC,DAC,BADQ,DECDBB', 'BBAAC,DCGC,BACS,DFCB,BACS,DACBDM'],
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
        encoded: ['BBAAC,DACDT', 'BBAAC,DEF,BABV,DGCBAA'],
        decoded: [
          [init([0, 0, 3, 19, 1], { vars: [0, 1] })],
          [init([0, 0, 3, 1, 1], { vars: [2, 0] }), init([1, 21, 3, 1, 2, 0], { vars: [3] })],
        ],
      },
      {
        encoded: ['BBAAC,DACCC,BACQ,DCCB,BACS,DACB,BACS,DAC,BBDSGCDBBDM'],
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
        encoded: ['BBAAC,DAC,BAAS,DCCBEH'],
        decoded: [
          [init([0, 0, 6, 7, 1], { vars: [0, 1] }), init([0, 18, 2, 1, 2, 0], { vars: [2] })],
        ],
      },
      {
        encoded: ['BBAAC,BBAAG,DA,BBDCA,DADDCBAA'],
        decoded: [
          [
            init([0, 0, 8, 1, 1], { vars: [] }),
            init([0, 0, 8, 1, 4], { vars: [0] }),
            init([3, 2, 6, 3, 4], { vars: [0] }),
          ],
        ],
      },
      {
        encoded: ['BBAAC,DA,BAAA,DCCC,BABC,DCCDDDBBJ'],
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

    describe('decodeScopes()', () => {
      tests.forEach((test, i) => {
        test.encoded.forEach((encoded, j) => {
          it(`decodes sample ${i}, source ${j}`, () => {
            assert.deepEqual(decodeScopes(encoded), {
              originalScopes: test.decoded[j],
              generatedRanges: [],
            });
          });
        });
      });
    });

    describe('encodeScopes()', () => {
      tests.forEach((test, i) => {
        test.decoded.forEach((decoded, j) => {
          it(`encodes sample ${i}, source ${j}`, () => {
            assert.deepEqual(encodeScopes({
              originalScopes: decoded,
              generatedRanges: [],
            }), test.encoded[j]);
          });
        });
      });
    });
  });

  describe('generated ranges', () => {
    let tests: { encoded: string; decoded: GeneratedRange[]; only?: true }[] = [
      {
        encoded: '',
        decoded: [
          init([0, 0, 2, 43, 0, 0], { flags: 0b0100, callsite: null, bindings: [[[-1]], [[-1]]] }),
          init([0, 0, 1, 30, 0, 2], { flags: 0b0000, callsite: [0, 7, 0], bindings: [[[3]]] }),
          init([0, 0, 0, 27, 0, 1], { flags: 0b0000, callsite: [0, 4, 2], bindings: [[[4]]] }),
        ],
      },
      {
        encoded: '',
        decoded: [
          init([0, 0, 0, 34, 1, 0], {
            flags: 0b0100,
            callsite: null,
            bindings: [[[-1]], [[-1]], [[-1]]],
          }),
          init([0, 0, 0, 16, 0, 0], { flags: 0b0000, callsite: null, bindings: [[[6]], [[-1]]] }),
          init([0, 0, 0, 16, 1, 2], { flags: 0b0000, callsite: [1, 10, 0], bindings: [[[7]]] }),
          init([0, 0, 0, 16, 1, 1], { flags: 0b0000, callsite: [1, 7, 2], bindings: [[[7]]] }),
          init([0, 0, 0, 16, 0, 1], { flags: 0b0000, callsite: [1, 3, 2], bindings: [[[7]]] }),
          init([0, 16, 0, 34, 0, 0], { flags: 0b0000, callsite: null, bindings: [[[6]], [[-1]]] }),
          init([0, 16, 0, 34, 1, 2], { flags: 0b0000, callsite: [1, 11, 0], bindings: [[[8]]] }),
          init([0, 16, 0, 34, 1, 1], { flags: 0b0000, callsite: [1, 7, 2], bindings: [[[8]]] }),
          init([0, 16, 0, 34, 0, 1], { flags: 0b0000, callsite: [1, 3, 2], bindings: [[[8]]] }),
        ],
      },
      {
        encoded: '',
        decoded: [
          init([0, 0, 5, 17, 0, 0], { flags: 0b0100, callsite: null, bindings: [[[-1]], [[4]]] }),
          init([0, 0, 5, 17, 1, 0], { flags: 0b0000, callsite: null, bindings: [[[5]], [[-1]]] }),
          init([2, 0, 4, 21, 1, 1], { flags: 0b0000, callsite: [0, 2, 0], bindings: [[[6]]] }),
        ],
      },
      {
        encoded: '',
        decoded: [
          init([0, 0, 0, 99, 0, 0], {
            flags: 0b0100,
            callsite: null,
            bindings: [[[6]], [[-1]], [[-1]], [[-1]]],
          }),
          init([0, 13, 0, 85, 0, 3], { flags: 0b0100, callsite: null, bindings: [[[7]], [[8]]] }),
          init([0, 70, 0, 84, 0, 2], { flags: 0b0000, callsite: [0, 14, 4], bindings: [[[7]]] }),
          init([0, 70, 0, 84, 0, 1], { flags: 0b0000, callsite: [0, 7, 2], bindings: [[[7]]] }),
        ],
      },
      {
        encoded: '',
        decoded: [
          init([0, 0, 1, 19, 0, 0], {
            flags: 0b0100,
            callsite: null,
            bindings: [[[-1]], [[3], [4, 1, 0]]],
          }),
          init([0, 0, 0, 19, 0, 1], { flags: 0b0000, callsite: [0, 4, 1], bindings: [[[3]]] }),
          init([1, 0, 1, 19, 0, 1], { flags: 0b0000, callsite: [0, 6, 0], bindings: [[[4]]] }),
        ],
      },
      {
        encoded: '',
        decoded: [
          init([0, 0, 6, 1, 0, 0], { flags: 0b0100, callsite: null, bindings: [] }),
          init([0, 0, 6, 1, 0, 1], { flags: 0b0100, callsite: null, bindings: [[[1]]] }),
          init([3, 2, 4, 18, 0, 2], { flags: 0b0000, callsite: null, bindings: [[[2]]] }),
        ],
      },
      {
        encoded: '',
        decoded: [
          init([0, 0, 8, 5, 0, 0], { flags: 0b0100, callsite: null, bindings: [[[6]]] }),
          init([0, 0, 7, 1, 0, 1], {
            flags: 0b0100,
            callsite: null,
            bindings: [[[7]], [[8]], [[9]]],
          }),
          init([1, 2, 4, 3, 0, 2], { flags: 0b0100, callsite: null, bindings: [[[8]], [[9]]] }),
        ],
      },
    ];

    const filtered = tests.filter((test) => {
      return test.only;
    });

    tests = filtered.length ? filtered : tests;

    describe('decodeScopes()', () => {
      tests.forEach((test, i) => {
        it('decodes sample ' + i, () => {
          assert.deepEqual(decodeScopes(test.encoded), {
            originalScopes: [],
            generatedRanges: test.decoded,
          });
        });
      });
    });

    describe('encodeScopes()', () => {
      tests.forEach((test, i) => {
        it('encodes sample ' + i, () => {
          assert.deepEqual(encodeScopes({
            originalScopes: [],
            generatedRanges: test.decoded,
          }), test.encoded);
        });
      });
    });
  });
});
