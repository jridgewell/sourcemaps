# sourcemap-codec

Encode/decode the `mappings` property of a [sourcemap](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit).


## Why?

Sourcemaps are difficult to generate and manipulate, because the `mappings` property – the part that actually links the generated code back to the original source – is encoded using an obscure method called [Variable-length quantity](https://en.wikipedia.org/wiki/Variable-length_quantity). On top of that, each segment in the mapping contains offsets rather than absolute indices, which means that you can't look at a segment in isolation – you have to understand the whole sourcemap.

This package makes the process slightly easier.


## Installation

```bash
npm install sourcemap-codec
```


## Usage

```js
import { encode, decode } from 'sourcemap-codec';

var decoded = decode( ';EAEEA,EAAE,EAAC,CAAE;ECQY,UACC' );

assert.deepEqual( decoded, [
	// the first line (of the generated code) has no mappings,
	// as shown by the starting semi-colon (which separates lines)
	[],

	// the second line contains four (comma-separated) segments
	[
		// segments are encoded as you'd expect:
		// [ generatedCodeColumn, sourceIndex, sourceCodeLine, sourceCodeColumn, nameIndex ]

		// i.e. the first segment begins at column 2, and maps back to the second column
		// of the second line (both zero-based) of the 0th source, and uses the 0th
		// name in the `map.names` array
		[ 2, 0, 2, 2, 0 ],

		// the remaining segments are 4-length rather than 5-length,
		// because they don't map a name
		[ 4, 0, 2, 4 ],
		[ 6, 0, 2, 5 ],
		[ 7, 0, 2, 7 ]
	],

	// the final line contains two segments
	[
		[ 2, 1, 10, 19 ],
		[ 12, 1, 11, 20 ]
	]
]);

var encoded = encode( decoded );
assert.equal( encoded, ';EAEEA,EAAE,EAAC,CAAE;ECQY,UACC' );
```

## Benchmarks

```
node v18.0.0

amp.js.map
decode: @jridgewell/sourcemap-codec x 513 ops/sec ±1.04% (91 runs sampled)
decode: sourcemap-codec x 439 ops/sec ±0.91% (91 runs sampled)
decode: source-map-0.6.1 x 37.27 ops/sec ±1.31% (49 runs sampled)
decode: source-map-0.8.0 x 365 ops/sec ±0.11% (95 runs sampled)
Fastest is decode: @jridgewell/sourcemap-codec

encode: @jridgewell/sourcemap-codec x 695 ops/sec ±0.32% (96 runs sampled)
encode: sourcemap-codec x 238 ops/sec ±0.75% (88 runs sampled)
encode: source-map-0.6.1 x 162 ops/sec ±0.52% (84 runs sampled)
encode: source-map-0.8.0 x 193 ops/sec ±0.33% (83 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec

***

babel.min.js.map
decode: @jridgewell/sourcemap-codec x 41.15 ops/sec ±4.18% (55 runs sampled)
decode: sourcemap-codec x 37.94 ops/sec ±3.43% (51 runs sampled)
decode: source-map-0.6.1 x 4.39 ops/sec ±3.50% (16 runs sampled)
decode: source-map-0.8.0 x 59.29 ops/sec ±0.06% (78 runs sampled)
Fastest is decode: source-map-0.8.0

encode: @jridgewell/sourcemap-codec x 106 ops/sec ±0.46% (79 runs sampled)
encode: sourcemap-codec x 30.06 ops/sec ±3.12% (54 runs sampled)
encode: source-map-0.6.1 x 19.81 ops/sec ±2.40% (37 runs sampled)
encode: source-map-0.8.0 x 19.86 ops/sec ±2.68% (37 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec

***

preact.js.map
decode: @jridgewell/sourcemap-codec x 15,740 ops/sec ±0.22% (100 runs sampled)
decode: sourcemap-codec x 11,709 ops/sec ±0.14% (100 runs sampled)
decode: source-map-0.6.1 x 1,258 ops/sec ±1.68% (97 runs sampled)
decode: source-map-0.8.0 x 9,852 ops/sec ±0.06% (101 runs sampled)
Fastest is decode: @jridgewell/sourcemap-codec

encode: @jridgewell/sourcemap-codec x 19,019 ops/sec ±0.61% (97 runs sampled)
encode: sourcemap-codec x 6,979 ops/sec ±0.15% (100 runs sampled)
encode: source-map-0.6.1 x 4,680 ops/sec ±0.09% (101 runs sampled)
encode: source-map-0.8.0 x 5,319 ops/sec ±0.14% (102 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec

***

react.js.map
decode: @jridgewell/sourcemap-codec x 5,682 ops/sec ±0.23% (100 runs sampled)
decode: sourcemap-codec x 4,446 ops/sec ±0.06% (100 runs sampled)
decode: source-map-0.6.1 x 442 ops/sec ±0.38% (95 runs sampled)
decode: source-map-0.8.0 x 3,429 ops/sec ±0.16% (102 runs sampled)
Fastest is decode: @jridgewell/sourcemap-codec

encode: @jridgewell/sourcemap-codec x 6,067 ops/sec ±0.37% (96 runs sampled)
encode: sourcemap-codec x 2,529 ops/sec ±0.14% (101 runs sampled)
encode: source-map-0.6.1 x 2,261 ops/sec ±0.09% (101 runs sampled)
encode: source-map-0.8.0 x 2,319 ops/sec ±0.17% (101 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec
```

# License

MIT
