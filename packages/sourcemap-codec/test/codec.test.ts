/* eslint-env node, mocha */

import { encode, decode, SourceMapMappings } from '../src/sourcemap-codec';
import { strict as assert } from 'assert';
import * as fs from 'fs';
import * as path from 'path';

describe('sourcemap-codec', () => {
  // TODO more tests
  let tests: { encoded: string; decoded: SourceMapMappings; only?: true }[] = [
    {
      encoded: 'AAAA',
      decoded: [[[0, 0, 0, 0]]],
    },
    {
      encoded: ';;;',
      decoded: [[], [], [], []],
    },
    {
      encoded: 'A,AAAC;;AACDE;',
      decoded: [[[0], [0, 0, 0, 1]], [], [[0, 0, 1, 0, 2]], []],
    },
    {
      encoded: ';;;;EAEEA,EAAE,EAAC,CAAE;ECQY,UACC',
      decoded: [
        [],
        [],
        [],
        [],
        [
          [2, 0, 2, 2, 0],
          [4, 0, 2, 4],
          [6, 0, 2, 5],
          [7, 0, 2, 7],
        ],
        [
          [2, 1, 10, 19],
          [12, 1, 11, 20],
        ],
      ],
    },
    {
      encoded:
        'AAAA,aAEA,IAAIA,eAAiB,oCAAoCC,cACzD,SAASC,IACRC,OAAOC,MAAOJ,eAAgB,GAG/B,IAAIK,iBAAmB,sBAAsBJ,cAC7C,SAASK,IACRH,OAAOC,MAAOC,iBAAkB,GAGjCH,IACAI',
      decoded: [
        [
          [0, 0, 0, 0],
          [13, 0, 2, 0],
          [17, 0, 2, 4, 0],
          [32, 0, 2, 21],
          [68, 0, 2, 57, 1],
          [82, 0, 3, 0],
          [91, 0, 3, 9, 2],
          [95, 0, 4, 1, 3],
          [102, 0, 4, 8, 4],
          [108, 0, 4, 15, 0],
          [123, 0, 4, 31],
          [126, 0, 7, 0],
          [130, 0, 7, 4, 5],
          [147, 0, 7, 23],
          [169, 0, 7, 45, 1],
          [183, 0, 8, 0],
          [192, 0, 8, 9, 6],
          [196, 0, 9, 1, 3],
          [203, 0, 9, 8, 4],
          [209, 0, 9, 15, 5],
          [226, 0, 9, 33],
          [229, 0, 12, 0, 2],
          [233, 0, 13, 0, 6],
        ],
      ],
    },
    {
      encoded:
        'CAAC,SAAUA,EAAQC,GACC,iBAAZC,SAA0C,oBAAXC,OAAyBF,IAC7C,mBAAXG,QAAyBA,OAAOC,IAAMD,OAAOH,GACnDA,IAHF,CAIEK,EAAM,WAAe,aAEtB,IAAIC,EAAiB,oCAAoCC,cAKzD,IAAIC,EAAmB,sBAAsBD,cAH5CE,OAAOC,MAAOJ,EAAgB,GAK9BG,OAAOC,MAAOF,EAAkB',
      decoded: [
        [
          [1, 0, 0, 1],
          [10, 0, 0, 11, 0],
          [12, 0, 0, 19, 1],
          [15, 0, 1, 20],
          [32, 0, 1, 8, 2],
          [41, 0, 1, 50],
          [61, 0, 1, 39, 3],
          [68, 0, 1, 64, 1],
          [72, 0, 2, 19],
          [91, 0, 2, 8, 4],
          [99, 0, 2, 33, 4],
          [106, 0, 2, 40, 5],
          [110, 0, 2, 46, 4],
          [117, 0, 2, 53, 1],
          [120, 0, 3, 2, 1],
          [124, 0, 0, 0],
          [125, 0, 4, 2, 6],
          [127, 0, 4, 8],
          [138, 0, 4, 23],
          [151, 0, 6, 1],
          [155, 0, 6, 5, 7],
          [157, 0, 6, 22],
          [193, 0, 6, 58, 8],
          [207, 0, 11, 1],
          [211, 0, 11, 5, 9],
          [213, 0, 11, 24],
          [235, 0, 11, 46, 8],
          [249, 0, 8, 2, 10],
          [256, 0, 8, 9, 11],
          [262, 0, 8, 16, 7],
          [264, 0, 8, 32],
          [267, 0, 13, 2, 10],
          [274, 0, 13, 9, 11],
          [280, 0, 13, 16, 9],
          [282, 0, 13, 34],
        ],
      ],
    },
    {
      // Make sure Int16 isn't being used
      encoded: 'gw+BAAAA,w+BAAAA,w+BAAAA,w+BAAAA',
      decoded: [
        [
          [32000, 0, 0, 0, 0],
          [33000, 0, 0, 0, 0],
          [34000, 0, 0, 0, 0],
          [35000, 0, 0, 0, 0],
        ],
      ],
    },
    {
      // Handle largest 32bit int
      encoded: '+/////D',
      decoded: [[[2147483647]]],
    },
    {
      // Handle smallest 32bit int
      encoded: 'AAA+/////D,AAAE,AAAB',
      decoded: [
        [
          [0, 0, 0, 2147483647],
          [0, 0, 0, 2147483649],
          [0, 0, 0, 1],
        ],
      ],
    },
  ];

  const filtered = tests.filter((test) => {
    return test.only;
  });

  tests = filtered.length ? filtered : tests;

  describe('decode()', () => {
    tests.forEach((test, i) => {
      it('decodes sample ' + i, () => {
        assert.deepEqual(decode(test.encoded), test.decoded);
      });
    });

    it('sorts during decoding', () => {
      const mappings: SourceMapMappings = [
        [[1], [2], [3]],
        [[1], [3], [2]],
        [[2], [1], [3]],
        [[2], [3], [1]],
        [[3], [1], [2]],
        [[3], [2], [1]],
      ];
      mappings.sort(() => (Math.random() < 0.5 ? 1 : -1));

      const decoded = decode(encode(mappings));
      const expected = mappings.map(() => {
        return [[1], [2], [3]];
      });

      assert.deepEqual(decoded, expected);
    });
  });

  describe('encode()', () => {
    tests.forEach((test, i) => {
      it('encodes sample ' + i, () => {
        assert.deepEqual(encode(test.decoded), test.encoded);
      });
    });
  });

  describe('real world', () => {
    const dir = path.join(__dirname, '..', 'benchmark');
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      if (path.extname(file) !== '.map') return;

      it(file, function () {
        this.timeout(5000);
        const { mappings } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        assert.deepEqual(encode(decode(mappings)), mappings);
      });
    });
  });
});
