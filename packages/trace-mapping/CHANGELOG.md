# [0.3.25] - 2024-03-02

## What's Changed

- Support `TraceMap` instances in `SectionedSourceMap`'s `sections` field: https://github.com/jridgewell/trace-mapping/commit/8d8fc353673c9dbd6b03d68c09430dc28880095a

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.24...v0.3.25

# [0.3.24] - 2024-03-01

## What's Changed

- Add `ignoreList` (and `x_google_ignoreList`) support: https://github.com/jridgewell/trace-mapping/commit/1027ce6bfc068dc71cc16861d2e09b155fee9293

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.23...v0.3.24

# [0.3.23] - 2024-02-24

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.22...v0.3.23

# [0.3.22] - 2024-01-19

## What's Changed

- Specify all exported types to unbreak TS v4.\* by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/34

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.21...v0.3.22

# [0.3.21] - 2024-01-12

## What's Changed

- Use `export type *` by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/32

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.20...v0.3.21

# [0.3.20] - 2023-10-17

## What's Changed

- Fix handling of sectioned source maps missing 'names' array by @RandomByte in https://github.com/jridgewell/trace-mapping/pull/29

## New Contributors

- @RandomByte made their first contribution in https://github.com/jridgewell/trace-mapping/pull/29

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.19...v0.3.20

# [0.3.19] - 2023-08-07

## What's Changed

- Unpins the `@jridgewell/resolve-uri` and `@jridgewell/sourcemap-codec` dependencies so they can be de-duped.

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.16...v0.3.17

# [0.3.18] - 2023-04-07

## What's Changed

- fix: add "types" field to package.json by @dominikg in https://github.com/jridgewell/trace-mapping/pull/24

## New Contributors

- @dominikg made their first contribution in https://github.com/jridgewell/trace-mapping/pull/24

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.17...v0.3.18

# [0.3.17] - 2022-10-14

## What's Changed

- Add support for bias in allGeneratedPositionsFor by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/23

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.16...v0.3.17

# [0.3.16] - 2022-10-08

## What's Changed

- Add `allGeneratedPositionsFor` by @connor4312 in https://github.com/jridgewell/trace-mapping/pull/19
- Be more permissive with readonly input types by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/20

## New Contributors

- @connor4312 made their first contribution in https://github.com/jridgewell/trace-mapping/pull/19

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.15...v0.3.16

# [0.3.15] - 2022-08-11

## What's Changed

- Fix presortedDecodedMap to only copy sourcemap fields by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/15

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.14...v0.3.15

# [0.3.14] - 2022-06-26

## Internal

- [Fix built sources paths](https://github.com/jridgewell/trace-mapping/commit/6a465b166913ae3eb3f444be3afcd09113a5b34e)
- [fix "exports" for node 13.0-13.6](https://github.com/jridgewell/trace-mapping/commit/8b887ef4c0b3156f5eae04d501f055f44c516bd8)

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.13...v0.3.14

# [0.3.13] - 2022-05-11

## What's Changed

- Always normalize `resolvedSources` by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/10

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.12...v0.3.13

# [0.3.12] - 2022-05-11

## Changes

- [Return unfrozen objects from originalPositionFor/generatedPositionFor](https://github.com/jridgewell/trace-mapping/commit/5dabccfa2d5a0a00a598efd83dc88eebcd5aa529)

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.11...v0.3.12

# [0.3.11] - 2022-05-10

## What's Changed

- Add sourceContentFor API by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/8

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.10...v0.3.11

# [0.3.10] - 2022-05-05

## What's Changed

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

## Internal Changes

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

## What's Changed

- Add `generatedPositionFor` API by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/1
- Support sectioned sourcemaps with AnyMap by @jridgewell in https://github.com/jridgewell/trace-mapping/pull/3
- chore: correct typo by @SimenB in https://github.com/jridgewell/trace-mapping/pull/2

## New Contributors

- @SimenB made their first contribution in https://github.com/jridgewell/trace-mapping/pull/2

**Full Changelog**: https://github.com/jridgewell/trace-mapping/compare/v0.3.4...v0.3.5
