# [0.3.12] - 2025-06-30

- Use `Object.assign` to avoid polyfill in old Node versions: https://github.com/jridgewell/sourcemaps/commit/dd0615a
- Optimize UMD wrapper: https://github.com/jridgewell/sourcemaps/commit/557ca37
- Reorder subpath exports to improve import usage: #35

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/gen-mapping/0.3.11...gen-mapping/0.3.12

# [0.3.11] - 2025-06-30

- Update UMD Wrapper to fix webpack build issue: #33
- Add `getOwnPropertyDescriptors` polyfill to support Node v6: #34

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/gen-mapping/0.3.10...gen-mapping/0.3.11

# [0.3.10] - 2025-06-30

- Remove `require(esm)` support to fix bug with Node v22: https://github.com/jridgewell/sourcemaps/commit/e95784217661cdd44c3c1bd5b3c42bbb8a24b69c

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/gen-mapping/0.3.9...gen-mapping/0.3.10

# [0.3.9] - 2025-06-29

- Fix package types for CJS and ESM imports: https://github.com/jridgewell/sourcemaps/commit/a924ed32ebfa27e49bc0ff4196118e791eaff22d
- fix: use stable version of sourcemap-codec dependency: #26 (thanks @benmccann)
- Add `module-sync` exports type for [require(esm)](https://joyeecheung.github.io/blog/2024/03/18/require-esm-in-node-js/): https://github.com/jridgewell/sourcemaps/commit/3836f6c8aee41d47119a642c7f88042b1a8ed239
- Add type declaration source maps to assist go-to-definition: https://github.com/jridgewell/sourcemaps/commit/9a0266518d2877047da27cbaf3290a4e6e3cb556
- Temporarily remove scopes/ranges APIs: https://github.com/jridgewell/sourcemaps/commit/7575b63bc3f70388c2cafc33efc8b47254ff4b4c
- Include set-array source directly in gen-mapping project: #1 (thanks @benmccann)

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/gen-mapping/0.3.5...gen-mapping/0.3.9

# [0.3.5] - 2024-03-01

- Add `ignoreList` support: https://github.com/jridgewell/gen-mapping/commit/9add0c20b3058a0f98c5d1a730405b3726479269

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.3.4...v0.3.5

# [0.3.4] - 2024-02-24

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.3.3...v0.3.4

# [0.3.3] - 2023-04-07

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.3.2...v0.3.3

# [0.3.2] - 2022-06-26

## Internal

- [meta] fix "exports" for node 13.0-13.6 by @ljharb in https://github.com/jridgewell/gen-mapping/pull/4
- [Fix built sources paths](https://github.com/jridgewell/gen-mapping/commit/7191ee4a1485a2e8d4a70cf9e9c291f520ee4080)

## New Contributors

- @ljharb made their first contribution in https://github.com/jridgewell/gen-mapping/pull/4

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.3.1...v0.3.2

# [0.3.1] - 2022-05-05

- [Add ability to set content while adding marking](https://github.com/jridgewell/gen-mapping/commit/30a8f00f000c3fcac65f57cbfd38e816c14e7f60)
- [Add types field to exports](https://github.com/jridgewell/gen-mapping/commit/8c1834672b1451ac19c37b0f44cf55f1e2997d4d)

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.3.0...v0.3.1

# [0.3.0] - 2022-04-30

## Breaking Changes

- Segments are no longer sorted by `sourcesIndex`/`sourceLine`/`sourceColumn`/`namesIndex` when inserting

  Segments are still ordered by `genColumn`, since this affects the binary search algorithm when tracing. For the other fields, it's not clear that we _should_ sort them. Instead, they're sorted in the order they were added to the map. This allows the `maybeAdd*` APIs to work.

## New Features

- Add `maybeAdd*` APIs by @jridgewell in https://github.com/jridgewell/gen-mapping/pull/1

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.2.0...v0.3.0

# [0.2.0] - 2022-04-27

## Breaking Changes

- [Rename `decodedMap`/`encodedMap` to `toDecodedMap`/`toEncodedMap`](https://github.com/jridgewell/gen-mapping/commit/ff4047ff4e2d98092643bbea9dec4878b7cd614e)

## New Features

- [Add fromMap API](https://github.com/jridgewell/gen-mapping/commit/6d768ab291796b8a602f0031ed23e00ef6f11d03)

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.1.1...v0.2.0

# [0.1.1] - 2022-04-27

## Bug Fixes

- [Use any v1 set-array version](https://github.com/jridgewell/gen-mapping/commit/6c47b8e439bbd5d1be83e83125fc92d1552474d2)

**Full Changelog**: https://github.com/jridgewell/gen-mapping/compare/v0.1.0...v0.1.1

# [0.1.0] - 2022-04-27

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

**Full Changelog**: https://github.com/jridgewell/gen-mapping/commits/v0.1.0
