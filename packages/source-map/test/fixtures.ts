// This is a test mapping which maps functions from two different files
// (one.js and two.js) to a minified generated source.
//
// Here is one.js:
//
//   ONE.foo = function (bar) {
//     return baz(bar);
//   };
//
// Here is two.js:
//
//   TWO.inc = function (n) {
//     return n + 1;
//   };
//
// And here is the generated code (min.js):
//
//   ONE.foo=function(a){return baz(a);};

import { type EncodedSourceMap, type SectionedSourceMap } from '@jridgewell/trace-mapping';

//   TWO.inc=function(a){return a+1;};
export const testGeneratedCode =
  ' ONE.foo=function(a){return baz(a);};\n' + ' TWO.inc=function(a){return a+1;};';
export const testMap: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['one.js', 'two.js'],
  sourceRoot: '/the/root',
  sourcesContent: [null, null],
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
};
export const testMapNoSourceRoot: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['one.js', 'two.js'],
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
};
export const testMapEmptySourceRoot: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['one.js', 'two.js'],
  sourceRoot: '',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
};
export const testMapSingleSource: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz'],
  sources: ['one.js'],
  //sourceRoot: '',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID',
};
export const testMapEmptyMappings: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: [],
  sources: ['one.js', 'two.js'],
  sourcesContent: [' ONE.foo = 1;', ' TWO.inc = 2;'],
  //sourceRoot: '',
  mappings: '',
};
export const testMapEmptyMappingsRelativeSources: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: [],
  sources: ['./one.js', './two.js'],
  sourcesContent: [' ONE.foo = 1;', ' TWO.inc = 2;'],
  sourceRoot: '/the/root',
  mappings: '',
};
export const testMapEmptyMappingsRelativeSources_generated: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: [],
  sources: ['/the/root/one.js', '/the/root/two.js'],
  sourcesContent: [' ONE.foo = 1;', ' TWO.inc = 2;'],
  sourceRoot: '/the/root',
  mappings: '',
};
export const testMapMultiSourcesMappingRefersSingleSourceOnly: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz'],
  sources: ['one.js', 'withoutMappings.js'],
  //sourceRoot: '',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID',
};
// This mapping is identical to above, but uses the indexed format instead.
export const indexedTestMap: SectionedSourceMap = {
  version: 3,
  file: 'min.js',
  sections: [
    {
      offset: {
        line: 0,
        column: 0,
      },
      map: {
        version: 3,
        sources: ['one.js'],
        sourcesContent: [' ONE.foo = function (bar) {\n' + '   return baz(bar);\n' + ' };'],
        names: ['bar', 'baz'],
        mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID',
        file: 'min.js',
        sourceRoot: '/the/root',
      },
    },
    {
      offset: {
        line: 1,
        column: 0,
      },
      map: {
        version: 3,
        sources: ['two.js'],
        sourcesContent: [' TWO.inc = function (n) {\n' + '   return n + 1;\n' + ' };'],
        names: ['n'],
        mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOA',
        file: 'min.js',
        sourceRoot: '/the/root',
      },
    },
  ],
};
export const indexedTestMapDifferentSourceRoots: SectionedSourceMap = {
  version: 3,
  file: 'min.js',
  sections: [
    {
      offset: {
        line: 0,
        column: 0,
      },
      map: {
        version: 3,
        sources: ['one.js'],
        sourcesContent: [' ONE.foo = function (bar) {\n' + '   return baz(bar);\n' + ' };'],
        names: ['bar', 'baz'],
        mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID',
        file: 'min.js',
        sourceRoot: '/the/root',
      },
    },
    {
      offset: {
        line: 1,
        column: 0,
      },
      map: {
        version: 3,
        sources: ['two.js'],
        sourcesContent: [' TWO.inc = function (n) {\n' + '   return n + 1;\n' + ' };'],
        names: ['n'],
        mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOA',
        file: 'min.js',
        sourceRoot: '/different/root',
      },
    },
  ],
};
export const testMapWithSourcesContent: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['one.js', 'two.js'],
  sourcesContent: [
    ' ONE.foo = function (bar) {\n' + '   return baz(bar);\n' + ' };',
    ' TWO.inc = function (n) {\n' + '   return n + 1;\n' + ' };',
  ],
  sourceRoot: '/the/root',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
};
export const testMapWithSourcesContent_generated: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['/the/root/one.js', '/the/root/two.js'],
  sourcesContent: [
    ' ONE.foo = function (bar) {\n' + '   return baz(bar);\n' + ' };',
    ' TWO.inc = function (n) {\n' + '   return n + 1;\n' + ' };',
  ],
  sourceRoot: '/the/root',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
};
export const testMapRelativeSources: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: ['bar', 'baz', 'n'],
  sources: ['./one.js', './two.js'],
  sourcesContent: [
    ' ONE.foo = function (bar) {\n' + '   return baz(bar);\n' + ' };',
    ' TWO.inc = function (n) {\n' + '   return n + 1;\n' + ' };',
  ],
  sourceRoot: '/the/root',
  mappings: 'CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA',
};
export const emptyMap: EncodedSourceMap = {
  version: 3,
  file: 'min.js',
  names: [],
  sources: [],
  mappings: '',
};
