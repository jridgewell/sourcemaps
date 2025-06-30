# [2.3.2] - 2025-06-30

- Remove `require(esm)` support to fix bug with Node v22: https://github.com/jridgewell/sourcemaps/commit/e95784217661cdd44c3c1bd5b3c42bbb8a24b69c

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/remapping/2.3.1...remapping/2.3.2

# [2.3.1] - 2025-06-29

- Fix package types for CJS and ESM imports: https://github.com/jridgewell/sourcemaps/commit/a924ed32ebfa27e49bc0ff4196118e791eaff22d
- Add `module-sync` exports type for [require(esm)](https://joyeecheung.github.io/blog/2024/03/18/require-esm-in-node-js/): https://github.com/jridgewell/sourcemaps/commit/3836f6c8aee41d47119a642c7f88042b1a8ed239
- Add type declaration source maps to assist go-to-definition: https://github.com/jridgewell/sourcemaps/commit/9a0266518d2877047da27cbaf3290a4e6e3cb556
- Rename package to `@jridgewell/remapping`: https://github.com/jridgewell/sourcemaps/commit/6882c505e4c9e9abb5b341cd3ae02cf42f376a5b

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/remapping/2.3.0...remapping/2.3.1

# [2.3.0] - 2024-03-01

- Add `ignoreList` support: https://github.com/ampproject/remapping/commit/72a4ee26b8f1531592065ae88270ad6dc6104bbe
- Export `SourceMap` return type: https://github.com/ampproject/remapping/commit/94a9b772aa992ba3bbd7c94f0b879f8767dae12b

**Full Changelog**: https://github.com/ampproject/remapping/compare/v2.2.1...v2.3.0

# [2.2.1] - 2023-04-07

**Full Changelog**: https://github.com/ampproject/remapping/compare/v2.2.0...v2.2.1

# [2.2.0] - 2022-04-27

## New Features

- [Switch to any input supported by `TraceMap`](https://github.com/ampproject/remapping/commit/13c44eb94bd47db5a994f0e3ad83b3e09598dfdc)
  - This could give a small speed improvement, because a `presortedDecodedMap` can be returned by the loader

## Internal

- [Refactor `originalPositionFor` to remove polymorphism](https://github.com/ampproject/remapping/commit/cfa1c9bf8a88449b778eaea79602381f48ca8087)
- [Extract `FastStringArray` into separate package](https://github.com/ampproject/remapping/commit/5285f275babc03c8495e6efa73176d87acb5beea)
- [Extract `GenMapping` into separate package](https://github.com/ampproject/remapping/pull/171)

**Full Changelog**: https://github.com/ampproject/remapping/compare/v2.1.2...v2.2.0

# [More Advanced Loading Controls] - 2022-02-16

Building on https://github.com/ampproject/remapping/releases/tag/v2.1.0, `LoadingContext` now provides a `depth` field so that you can track the depth of the sourcmap tree at the current load. This can be used to, eg, prevent a recursive loading scenario when transforming files in-place (where the transformed load has a sourcemap, but the child source should not).

# [Advanced Loading Control] - 2022-02-07

The loader API now provides a new `LoadingContext` object, which provides new features:

- `importer` provides the resolved path of the parent sourcemap.
- `source` allows the loader to change the resolved location of the transformed sourcemap or original source file.
- `content` allows override the parent sourcemap's `sourcesContent` field for an original source file.

See https://github.com/ampproject/remapping#advanced-control-of-the-loading-graph for more information.
