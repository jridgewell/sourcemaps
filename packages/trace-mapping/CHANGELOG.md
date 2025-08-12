# [0.3.30] - 2025-08-12

- Use `default` subpath export: https://github.com/jridgewell/sourcemaps/commit/aab8d72
- Transform `export default` into `module.exports =` in UMD plugin: https://github.com/jridgewell/sourcemaps/commit/cf85c75

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/trace-mapping/0.3.29...trace-mapping/0.3.30

# [0.3.29] - 2025-07-01

- Optimize UMD wrapper: https://github.com/jridgewell/sourcemaps/commit/557ca37
- Reorder subpath exports to improve import usage: #35

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/trace-mapping/0.3.28...trace-mapping/0.3.29

# [0.3.28] - 2025-06-30

- Update UMD Wrapper to fix webpack build issue: #33
- Add `getOwnPropertyDescriptors` polyfill to support Node v6: #34

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/trace-mapping/0.3.27...trace-mapping/0.3.28

# [0.3.27] - 2025-06-30

- Remove `require(esm)` support to fix bug with Node v22: https://github.com/jridgewell/sourcemaps/commit/e95784217661cdd44c3c1bd5b3c42bbb8a24b69c

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/trace-mapping/0.3.26...trace-mapping/0.3.27

# [0.3.26] - 2025-06-29

- Fix package types for CJS and ESM imports: https://github.com/jridgewell/sourcemaps/commit/a924ed32ebfa27e49bc0ff4196118e791eaff22d
- Add `module-sync` exports type for [require(esm)](https://joyeecheung.github.io/blog/2024/03/18/require-esm-in-node-js/): https://github.com/jridgewell/sourcemaps/commit/3836f6c8aee41d47119a642c7f88042b1a8ed239
- Add type declaration source maps to assist go-to-definition: https://github.com/jridgewell/sourcemaps/commit/9a0266518d2877047da27cbaf3290a4e6e3cb556
- Fix map file resolution to match spec: #36
- Accept readonly types: https://github.com/jridgewell/sourcemaps/commit/cdf32c7dc8cde4b3963306ea2d316a675002e296
- Rename AnyMap: https://github.com/jridgewell/sourcemaps/commit/5676069c80ca426f2d60b2ccfafca0944c79c039
- Add error messages for common issues: https://github.com/jridgewell/sourcemaps/commit/13c8987c4067c0e42d3b2b7192d23daedbb99a1b

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/trace-mapping/0.3.25...trace-mapping/0.3.26

# [0.3.25] - 2024-03-02

- Support `TraceMap` instances in `SectionedSourceMap`'s `sections` field: https://github.com/jridgewell/trace-mapping/commit/8d8fc353673c9dbd6b03d68c09430dc28880095a

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.24...v0.3.25

# [0.3.24] - 2024-03-01

- Add `ignoreList` (and `x_google_ignoreList`) support: https://github.com/jridgewell/trace-mapping/commit/1027ce6bfc068dc71cc16861d2e09b155fee9293

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.23...v0.3.24

# [0.3.23] - 2024-02-24

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.22...v0.3.23

# [0.3.22] - 2024-01-19

- Specify all exported types to unbreak TS v4.\* by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/34

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.21...v0.3.22

# [0.3.21] - 2024-01-12

- Use `export type *` by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/32

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.20...v0.3.21

# [0.3.20] - 2023-10-17

- Fix handling of sectioned source maps missing 'names' array by @RandomByte in https://github.com/jridgewell/trace-mapping/pull/29

## New Contributors

- @RandomByte made their first contribution in https://github.com/jridgewell/trace-mapping/pull/29

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.19...v0.3.20

# [0.3.19] - 2023-08-07

- Unpins the `@jridgewell/resolve-uri` and `@jridgewell/sourcemap-codec` dependencies so they can be de-duped.

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.16...v0.3.17

# [0.3.18] - 2023-04-07

- fix: add "types" field to package.json by @dominikg in https://github.com/jridgewell/trace-mapping/pull/24

## New Contributors

- @dominikg made their first contribution in https://github.com/jridgewell/trace-mapping/pull/24

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.17...v0.3.18

# [0.3.17] - 2022-10-14

- Add support for bias in allGeneratedPositionsFor by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/23

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.16...v0.3.17

# [0.3.16] - 2022-10-08

- Add `allGeneratedPositionsFor` by @connor4312 in https://github.com/jridgewell/trace-mapping/pull/19
- Be more permissive with readonly input types by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/20

## New Contributors

- @connor4312 made their first contribution in https://github.com/jridgewell/trace-mapping/pull/19

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.15...v0.3.16

# [0.3.15] - 2022-08-11

- Fix presortedDecodedMap to only copy sourcemap fields by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/15

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.14...v0.3.15

# [0.3.14] - 2022-06-26

## Internal

- [Fix built sources paths](https://github.com/jridgewell/trace-mapping/commit/6a465b166913ae3eb3f444be3afcd09113a5b34e)
- [fix "exports" for node 13.0-13.6](https://github.com/jridgewell/trace-mapping/commit/8b887ef4c0b3156f5eae04d501f055f44c516bd8)

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.13...v0.3.14

# [0.3.13] - 2022-05-11

- Always normalize `resolvedSources` by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/10

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.12...v0.3.13

# [0.3.12] - 2022-05-11

- [Return unfrozen objects from originalPositionFor/generatedPositionFor](https://github.com/jridgewell/trace-mapping/commit/5dabccfa2d5a0a00a598efd83dc88eebcd5aa529)

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.11...v0.3.12

# [0.3.11] - 2022-05-10

- Add sourceContentFor API by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/8

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.10...v0.3.11

# [0.3.10] - 2022-05-05

- Optimize `AnyMap`:
  - [Implement recursive sectioned translation without intermediate TraceMap](https://github.com/jridgewell/trace-mapping/commit/7a6db0f09294945667043d6402763191da2d6659)
  - [Roll AnyMap loop together](https://github.com/jridgewell/trace-mapping/commit/a235a0470458775b62f111c6e24d41f7792b00ee)
  - [Small optimizations to AnyMap](https://github.com/jridgewell/trace-mapping/commit/1abee9ca32e18f075da802a015019118fcfe9484)
  - [Don't allocate a throwaway array](https://github.com/jridgewell/trace-mapping/commit/a960a04ded63abae537df2e19858f8c5bc2fc62f)
- [Duck type detect TraceMap instances](https://github.com/jridgewell/trace-mapping/commit/165983e26d98abf2157c91469c1670f60235d8b0)
- chore: add `types` entry to `export` map by @mrazauskas in https://github.com/jridgewell/trace-mapping/pull/6

## New Contributors

- @mrazauskas made their first contribution in https://github.com/jridgewell/trace-mapping/pull/6

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.9...v0.3.10

# [0.3.9] - 2022-04-20

## Bug Fixes

- Fix bug with SectionedSourceMaps by @jridgewell in 9f52472f24ed9a3177836e860e76311e86928a93

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.8...v0.3.9

# [0.3.8] - 2022-04-20

## New Features

- Add decodedMap and encodedMap helpers by @jridgewell in 0f543e6a466c2f4fcd82868d85bcc8fe558da62f

## Internal

- Extract traceSegmentInternal to top level scope by @jridgewell in 7ac8154dae864b32315389bda712135d20a57001

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.7...v0.3.8

# [0.3.7] - 2022-04-20

## Bug Fixes

- Fix bug with memoized binary search's `found` state by @jridgewell in 589574e10881c6ea1d9266d98294a862a1eb1ebb

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.6...v0.3.7

# [0.3.6] - 2022-04-20

## Bug Fixes

- Fix bug with memoized binary search's `found` state by @jridgewell in 5596de1a88acf0a6796c2860d0677580868c180b

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.5...v0.3.6

# [0.3.5] - 2022-04-20

- Add `generatedPositionFor` API by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/1
- Support sectioned sourcemaps with AnyMap by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/3
- chore: correct typo by @SimenB in https://github.com/jridgewell/trace-mapping/pull/2

## New Contributors

- @SimenB made their first contribution in https://github.com/jridgewell/trace-mapping/pull/2

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.4...v0.3.5
