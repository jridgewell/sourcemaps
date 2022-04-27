# @jridgewell/gen-mapping

> Generate source maps

`gen-mapping` allows you to generate a source map during transpilation or minification.
With a source map, you're able to trace the original location in the source file, either in Chrome's
DevTools or using a library like [`@jridgewell/trace-mapping`][trace-mapping].

You may already be familiar with the [`source-map`][source-map] package's `SourceMapGenerator`. This
provides the same `addMapping` and `setSourceContent` API.

## Installation

```sh
npm install @jridgewell/gen-mapping
```

## Usage

```typescript
import { GenMapping, addMapping, setSourceContent, encodedMap } from '@jridgewell/gen-mapping';

const map = new GenMapping({
  file: 'output.js',
  sourceRoot: 'https://example.com/',
});

setSourceContent(map, 'input.js', `function foo() {}`);

addMapping(map, {
  // Lines start at line 1, columns at column 0.
  generated: { line: 1, column: 0 },
  source: 'input.js',
  original: { line: 1, column: 0 },
});

addMapping(map, {
  generated: { line: 1, column: 9 },
  source: 'input.js',
  original: { line: 1, column: 9 },
  name: 'foo',
});

assert.deepEqual(encodedMap(map), {
  version: 3,
  file: 'output.js',
  names: ['foo'],
  sourceRoot: 'https://example.com/',
  sources: ['input.js'],
  sourcesContent: ['function foo() {}'],
  mappings: 'AAAA,SAASA',
});
```

[source-map]: https://www.npmjs.com/package/source-map
[trace-mapping]: https://github.com/jridgewell/trace-mapping
