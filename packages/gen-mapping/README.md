# @jridgewell/gen-mapping

> TODO

TODO

## Installation

```sh
npm install @jridgewell/gen-mapping
```

## Usage

```js
import { SetArray, get, put } from '@jridgewell/gen-mapping';

const sa = new SetArray();

let index = put(sa, 'first');
assert.strictEqual(index, 0);

index = put(sa, 'second');
assert.strictEqual(index, 1);

assert.deepEqual(sa.array, [ 'first', 'second' ]);

index = get(sa, 'first');
assert.strictEqual(index, 0);
```
