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

amp.js.map - 45120 segments

Decode Memory Usage:
@jridgewell/sourcemap-codec       5433795 bytes
sourcemap-codec                   5485360 bytes
source-map-0.6.1                 13464992 bytes
source-map-0.8.0                  6418968 bytes
Smallest memory usage is @jridgewell/sourcemap-codec

Decode speed:
decode: @jridgewell/sourcemap-codec x 465 ops/sec ±1.49% (89 runs sampled)
decode: sourcemap-codec x 416 ops/sec ±1.37% (89 runs sampled)
decode: source-map-0.6.1 x 34.08 ops/sec ±1.47% (47 runs sampled)
decode: source-map-0.8.0 x 357 ops/sec ±0.09% (97 runs sampled)
Fastest is decode: @jridgewell/sourcemap-codec

Encode Memory Usage:
@jridgewell/sourcemap-codec       2251428 bytes
sourcemap-codec                   8712368 bytes
source-map-0.6.1                  8444280 bytes
source-map-0.8.0                  8517648 bytes
Smallest memory usage is @jridgewell/sourcemap-codec

Encode speed:
encode: @jridgewell/sourcemap-codec x 634 ops/sec ±0.40% (95 runs sampled)
encode: sourcemap-codec x 229 ops/sec ±1.04% (88 runs sampled)
encode: source-map-0.6.1 x 155 ops/sec ±0.41% (82 runs sampled)
encode: source-map-0.8.0 x 181 ops/sec ±0.36% (85 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec


***


babel.min.js.map - 347793 segments

Decode Memory Usage:
@jridgewell/sourcemap-codec      35364008 bytes
sourcemap-codec                  35640904 bytes
source-map-0.6.1                 62298080 bytes
source-map-0.8.0                 44101904 bytes
Smallest memory usage is @jridgewell/sourcemap-codec

Decode speed:
decode: @jridgewell/sourcemap-codec x 34.52 ops/sec ±6.23% (49 runs sampled)
decode: sourcemap-codec x 32.06 ops/sec ±6.48% (45 runs sampled)
decode: source-map-0.6.1 x 4.14 ops/sec ±4.52% (15 runs sampled)
decode: source-map-0.8.0 x 57.60 ops/sec ±0.34% (75 runs sampled)
Fastest is decode: source-map-0.8.0

Encode Memory Usage:
@jridgewell/sourcemap-codec      17767216 bytes
sourcemap-codec                   8133588 bytes
source-map-0.6.1                 25127904 bytes
source-map-0.8.0                 25261096 bytes
Smallest memory usage is sourcemap-codec

Encode speed:
encode: @jridgewell/sourcemap-codec x 92.47 ops/sec ±3.95% (69 runs sampled)
encode: sourcemap-codec x 26.38 ops/sec ±6.39% (49 runs sampled)
encode: source-map-0.6.1 x 18.85 ops/sec ±3.09% (35 runs sampled)
encode: source-map-0.8.0 x 18.82 ops/sec ±4.12% (36 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec


***


preact.js.map - 1992 segments

Decode Memory Usage:
@jridgewell/sourcemap-codec        244912 bytes
sourcemap-codec                    252480 bytes
source-map-0.6.1                   971224 bytes
source-map-0.8.0                    12824 bytes
Smallest memory usage is source-map-0.8.0

Decode speed:
decode: @jridgewell/sourcemap-codec x 15,535 ops/sec ±0.14% (96 runs sampled)
decode: sourcemap-codec x 11,760 ops/sec ±0.11% (102 runs sampled)
decode: source-map-0.6.1 x 1,220 ops/sec ±0.12% (100 runs sampled)
decode: source-map-0.8.0 x 9,565 ops/sec ±0.06% (99 runs sampled)
Fastest is decode: @jridgewell/sourcemap-codec

Encode Memory Usage:
@jridgewell/sourcemap-codec         76218 bytes
sourcemap-codec                    327752 bytes
source-map-0.6.1                   359904 bytes
source-map-0.8.0                   359576 bytes
Smallest memory usage is @jridgewell/sourcemap-codec

Encode speed:
encode: @jridgewell/sourcemap-codec x 16,670 ops/sec ±1.19% (90 runs sampled)
encode: sourcemap-codec x 6,739 ops/sec ±0.22% (99 runs sampled)
encode: source-map-0.6.1 x 4,679 ops/sec ±0.10% (100 runs sampled)
encode: source-map-0.8.0 x 5,355 ops/sec ±0.18% (98 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec


***


react.js.map - 5726 segments

Decode Memory Usage:
@jridgewell/sourcemap-codec        681704 bytes
sourcemap-codec                    729464 bytes
source-map-0.6.1                  2331368 bytes
source-map-0.8.0                   723616 bytes
Smallest memory usage is @jridgewell/sourcemap-codec

Decode speed:
decode: @jridgewell/sourcemap-codec x 5,531 ops/sec ±0.12% (99 runs sampled)
decode: sourcemap-codec x 4,377 ops/sec ±0.29% (100 runs sampled)
decode: source-map-0.6.1 x 417 ops/sec ±0.40% (93 runs sampled)
decode: source-map-0.8.0 x 3,325 ops/sec ±0.18% (100 runs sampled)
Fastest is decode: @jridgewell/sourcemap-codec

Encode Memory Usage:
@jridgewell/sourcemap-codec        244368 bytes
sourcemap-codec                    853992 bytes
source-map-0.6.1                  1107776 bytes
source-map-0.8.0                  1107864 bytes
Smallest memory usage is @jridgewell/sourcemap-codec

Encode speed:
encode: @jridgewell/sourcemap-codec x 5,545 ops/sec ±1.09% (90 runs sampled)
encode: sourcemap-codec x 2,445 ops/sec ±0.39% (99 runs sampled)
encode: source-map-0.6.1 x 2,179 ops/sec ±0.14% (99 runs sampled)
encode: source-map-0.8.0 x 2,224 ops/sec ±0.29% (99 runs sampled)
Fastest is encode: @jridgewell/sourcemap-codec
```

# License

MIT
