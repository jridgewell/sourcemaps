# [1.5.3] - 2025-06-30

- Update UMD Wrapper to fix webpack build issue: #33
- Add `getOwnPropertyDescriptors` polyfill to support Node v6: #34

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/sourcemap-codec/1.5.2...sourcemap-codec/1.5.3

# [1.5.2] - 2025-06-30

- Remove `require(esm)` support to fix bug with Node v22: https://github.com/jridgewell/sourcemaps/commit/e95784217661cdd44c3c1bd5b3c42bbb8a24b69c

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/sourcemap-codec/1.5.1...sourcemap-codec/1.5.2

# [1.5.1] - 2025-06-29

- Fix package types for CJS and ESM imports: https://github.com/jridgewell/sourcemaps/commit/a924ed32ebfa27e49bc0ff4196118e791eaff22d
- Add `module-sync` exports type for [require(esm)](https://joyeecheung.github.io/blog/2024/03/18/require-esm-in-node-js/): https://github.com/jridgewell/sourcemaps/commit/3836f6c8aee41d47119a642c7f88042b1a8ed239
- Add type declaration source maps to assist go-to-definition: https://github.com/jridgewell/sourcemaps/commit/9a0266518d2877047da27cbaf3290a4e6e3cb556

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/sourcemap-codec/1.5.0...sourcemap-codec/1.5.1

# [1.5.0] - 2024-07-09

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/sourcemap-codec/1.4.15...sourcemap-codec/1.5.0

# [1.4.15] - 2023-04-07

- Fix `types` field name by @benmccann in https://github.com/jridgewell/sourcemap-codec/pull/1

## New Contributors

- @benmccann made their first contribution in https://github.com/jridgewell/sourcemap-codec/pull/1

**Full Changelog**: https://github.com/jridgewell/sourcemap-codec/compare/v1.4.14...v1.4.15

# [1.4.14] - 2022-06-26

## Internal

- [Fix built sources paths](https://github.com/jridgewell/sourcemap-codec/commit/8da06e819d8d5cf73348cc4cad3fbf067d134994)
- [fix "exports" for node 13.0-13.6](https://github.com/jridgewell/sourcemap-codec/commit/4682557c0eef001f810e2b0321a8a759f77ad80d)

**Full Changelog**: https://github.com/jridgewell/sourcemap-codec/compare/v1.4.13...v1.4.14

# [1.4.13] - 2022-05-05

- [Add types field to exports](https://github.com/jridgewell/sourcemap-codec/commit/28b48c04e9175ab2c80a8fbb5d00ee1a963403db)

**Full Changelog**: https://github.com/jridgewell/sourcemap-codec/compare/v1.4.12...v1.4.13

# [1.4.12] - 2022-05-02

## Internal

- [Mark TextDecoder as PURE](https://github.com/jridgewell/sourcemap-codec/commit/9ed2dcd6e881c528beb503a098ad2d0a5b9f2347)
- [Reduce memory usage when encoding and improve speed!](https://github.com/jridgewell/sourcemap-codec/commit/3853166bdc3535dede7922cef7237cc17f57c791)
- [Improve decode speed](https://github.com/jridgewell/sourcemap-codec/commit/3671bd48d32c469b3b6764868a4442c56c9d3ac6)

**Full Changelog**: https://github.com/jridgewell/sourcemap-codec/compare/v1.4.11...v1.4.12

# 1.4.10

- Sort mappings during decode ([f9d1b33f](https://github.com/jridgewell/sourcemap-codec/commit/f9d1b33f))

# 1.4.9

- Performance boost ([#86](https://github.com/Rich-Harris/sourcemap-codec/pull/86))
- Add native ESM entry point ([#85](https://github.com/Rich-Harris/sourcemap-codec/pull/85))

# 1.4.8

- Performance boost ([#80](https://github.com/Rich-Harris/sourcemap-codec/pull/80))

# 1.4.7

- Include .map files in package ([#73](https://github.com/Rich-Harris/sourcemap-codec/issues/73))

# 1.4.6

- Use arrays instead of typed arrays ([#79](https://github.com/Rich-Harris/sourcemap-codec/pull/79))

# 1.4.5

- Handle overflow cases ([#78](https://github.com/Rich-Harris/sourcemap-codec/pull/78))

# 1.4.4

- Use Uint32Array, yikes ([#77](https://github.com/Rich-Harris/sourcemap-codec/pull/77))

# 1.4.3

- Use Uint16Array to prevent overflow ([#75](https://github.com/Rich-Harris/sourcemap-codec/pull/75))

# 1.4.2

- GO EVEN FASTER ([#74](https://github.com/Rich-Harris/sourcemap-codec/pull/74))

# 1.4.1

- GO FASTER ([#71](https://github.com/Rich-Harris/sourcemap-codec/pull/71))

# 1.4.0

- Add TypeScript declarations ([#70](https://github.com/Rich-Harris/sourcemap-codec/pull/70))

# 1.3.1

- Update build process, expose `pkg.module`

# 1.3.0

- Update build process

# 1.2.1

- Add dist files to npm package

# 1.2.0

- Add ES6 build
- Update dependencies
- Add test coverage

# 1.1.0

- Fix bug with lines containing single-character segments
- Add tests

# 1.0.0

- First release
