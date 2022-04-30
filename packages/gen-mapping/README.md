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

### Smaller Sourcemaps

Not everything needs to be added to a sourcemap, and needless markings can cause signficantly
larger file sizes. `gen-mapping` exposes `maybeAddSegment`/`maybeAddMapping` APIs that will
intelligently determine if this marking adds useful information. If not, the marking will be
skipped.

```typescript
import { GenMapping, encodedMap, maybeAddMapping } from '@jridgewell/gen-mapping';

const map = new GenMapping();

// Adding a sourceless marking at the beginning of a line isn't useful.
maybeAddMapping(map, {
  generated: { line: 1, column: 0 },
});

// Adding a new source marking is useful.
maybeAddMapping(map, {
  generated: { line: 1, column: 0 },
  source: 'input.js',
  original: { line: 1, column: 0 },
});

// But adding another marking pointing to the exact same original location isn't, even if the
// generated column changed.
maybeAddMapping(map, {
  generated: { line: 1, column: 9 },
  source: 'input.js',
  original: { line: 1, column: 0 },
});

assert.deepEqual(encodedMap(map), {
  version: 3,
  names: [],
  sources: ['input.js'],
  sourcesContent: [null],
  mappings: 'AAAA',
});
```

## Benchmarks

```
node v18.0.0

amp.js.map
gen-mapping:      addSegment x 450 ops/sec ±1.16% (87 runs sampled)
gen-mapping:      addMapping x 430 ops/sec ±0.90% (90 runs sampled)
source-map-js:    addMapping x 178 ops/sec ±1.06% (84 runs sampled)
source-map-0.6.1: addMapping x 177 ops/sec ±1.07% (84 runs sampled)
source-map-0.8.0: addMapping x 178 ops/sec ±0.98% (84 runs sampled)
Fastest is gen-mapping:      addSegment

gen-mapping:      decoded output x 157,549,649 ops/sec ±0.14% (97 runs sampled)
gen-mapping:      encoded output x 669 ops/sec ±1.34% (95 runs sampled)
source-map-js:    encoded output x 160 ops/sec ±0.64% (83 runs sampled)
source-map-0.6.1: encoded output x 161 ops/sec ±0.47% (84 runs sampled)
source-map-0.8.0: encoded output x 190 ops/sec ±0.28% (90 runs sampled)
Fastest is gen-mapping:      decoded output

***

babel.min.js.map
gen-mapping:      addSegment x 51.09 ops/sec ±4.58% (56 runs sampled)
gen-mapping:      addMapping x 39.38 ops/sec ±4.40% (54 runs sampled)
source-map-js:    addMapping x 21.65 ops/sec ±3.34% (40 runs sampled)
source-map-0.6.1: addMapping x 21.90 ops/sec ±3.59% (41 runs sampled)
source-map-0.8.0: addMapping x 21.89 ops/sec ±3.10% (41 runs sampled)
Fastest is gen-mapping:      addSegment

gen-mapping:      decoded output x 154,505,123 ops/sec ±0.45% (100 runs sampled)
gen-mapping:      encoded output x 84.17 ops/sec ±5.44% (66 runs sampled)
source-map-js:    encoded output x 17.57 ops/sec ±4.55% (33 runs sampled)
source-map-0.6.1: encoded output x 16.43 ops/sec ±7.03% (34 runs sampled)
source-map-0.8.0: encoded output x 16.60 ops/sec ±6.44% (32 runs sampled)
Fastest is gen-mapping:      decoded output

***

preact.js.map
gen-mapping:      addSegment x 11,643 ops/sec ±3.36% (91 runs sampled)
gen-mapping:      addMapping x 10,921 ops/sec ±0.63% (87 runs sampled)
source-map-js:    addMapping x 4,534 ops/sec ±0.25% (98 runs sampled)
source-map-0.6.1: addMapping x 4,572 ops/sec ±0.18% (99 runs sampled)
source-map-0.8.0: addMapping x 4,519 ops/sec ±0.27% (99 runs sampled)
Fastest is gen-mapping:      addSegment

gen-mapping:      decoded output x 157,554,436 ops/sec ±0.09% (98 runs sampled)
gen-mapping:      encoded output x 17,673 ops/sec ±1.11% (87 runs sampled)
source-map-js:    encoded output x 5,526 ops/sec ±0.63% (93 runs sampled)
source-map-0.6.1: encoded output x 5,679 ops/sec ±0.21% (98 runs sampled)
source-map-0.8.0: encoded output x 5,911 ops/sec ±0.14% (101 runs sampled)
Fastest is gen-mapping:      decoded output

***

react.js.map
gen-mapping:      addSegment x 4,168 ops/sec ±1.08% (81 runs sampled)
gen-mapping:      addMapping x 3,842 ops/sec ±1.27% (84 runs sampled)
source-map-js:    addMapping x 1,510 ops/sec ±1.63% (95 runs sampled)
source-map-0.6.1: addMapping x 1,537 ops/sec ±0.34% (97 runs sampled)
source-map-0.8.0: addMapping x 1,546 ops/sec ±0.29% (98 runs sampled)
Fastest is gen-mapping:      addSegment

gen-mapping:      decoded output x 157,136,960 ops/sec ±0.13% (92 runs sampled)
gen-mapping:      encoded output x 6,494 ops/sec ±0.56% (96 runs sampled)
source-map-js:    encoded output x 2,206 ops/sec ±0.25% (100 runs sampled)
source-map-0.6.1: encoded output x 2,188 ops/sec ±0.51% (99 runs sampled)
source-map-0.8.0: encoded output x 2,254 ops/sec ±0.27% (100 runs sampled)
Fastest is gen-mapping:      decoded output
```

[source-map]: https://www.npmjs.com/package/source-map
[trace-mapping]: https://github.com/jridgewell/trace-mapping
