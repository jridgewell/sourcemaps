import {
  decodeRangeMappings,
  encodeRangeMappings,
  type RangeMappings,
} from '../src/range-mappings';
import assert from 'node:assert/strict';

describe('range mappings proposal', () => {
  describe('encoding', () => {
    let tests: { encoded: string; decoded: RangeMappings; only?: true }[] = [
      {
        encoded: '',
        decoded: [[]],
      },
      {
        encoded: 'B',
        decoded: [[0]],
      },
      {
        encoded: ';BC;',
        decoded: [[], [0, 2], []],
      },
      {
        encoded: 'C;BC;E',
        decoded: [[1], [0, 2], [3]],
      },
      {
        encoded: 'nF;BPP;9I',
        decoded: [[166], [0, 15, 30], [284]],
      },
    ];

    const filtered = tests.filter((test) => {
      return test.only;
    });

    tests = filtered.length ? filtered : tests;

    describe('decodeRangeMappings()', () => {
      tests.forEach((test, i) => {
        it('decodes sample ' + i, () => {
          assert.deepEqual(decodeRangeMappings(test.encoded), test.decoded);
        });
      });
    });

    describe('encodeRangeMappings()', () => {
      tests.forEach((test, i) => {
        it('encodes sample ' + i, () => {
          assert.deepEqual(encodeRangeMappings(test.decoded), test.encoded);
        });
      });
    });
  });
});
