# [0.3.10] - 2025-07-01

- Optimize UMD wrapper: https://github.com/jridgewell/sourcemaps/commit/557ca37
- Reorder subpath exports to improve import usage: #35

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/source-map/0.3.9...source-map/0.3.10

# [0.3.9] - 2025-06-30

- Update UMD Wrapper to fix webpack build issue: #33
- Add `getOwnPropertyDescriptors` polyfill to support Node v6: #34

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/source-map/0.3.8...source-map/0.3.9

# [0.3.8] - 2025-06-30

- Remove `require(esm)` support to fix bug with Node v22: https://github.com/jridgewell/sourcemaps/commit/e95784217661cdd44c3c1bd5b3c42bbb8a24b69c

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/source-map/0.3.7...source-map/0.3.8

# [0.3.7] - 2025-06-29

- Fix package types for CJS and ESM imports: https://github.com/jridgewell/sourcemaps/commit/a924ed32ebfa27e49bc0ff4196118e791eaff22d
- Add `module-sync` exports type for [require(esm)](https://joyeecheung.github.io/blog/2024/03/18/require-esm-in-node-js/): https://github.com/jridgewell/sourcemaps/commit/3836f6c8aee41d47119a642c7f88042b1a8ed239
- Add type declaration source maps to assist go-to-definition: https://github.com/jridgewell/sourcemaps/commit/9a0266518d2877047da27cbaf3290a4e6e3cb556
- fix: remove extra comma to fix build: #24 (thanks @benmccann)

**Full Changelog**: https://github.com/jridgewell/sourcemaps/compare/source-map/0.3.6...source-map/0.3.7

# [0.3.6] - 2024-03-12

- Revert "move bundled dependencies to devDependencies" by @sandersn in https://github.com/jridgewell/source-map/pull/7
- Add missing source-map methods by @onigoetz in https://github.com/jridgewell/source-map/pull/2

## New Contributors

- @sandersn made their first contribution in https://github.com/jridgewell/source-map/pull/7
- @onigoetz made their first contribution in https://github.com/jridgewell/source-map/pull/2

**Full Changelog**: https://github.com/jridgewell/source-map/compare/v0.3.4...v0.3.6
