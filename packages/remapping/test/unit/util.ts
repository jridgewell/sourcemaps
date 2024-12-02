import assert from 'node:assert/strict';

function match(received: object, expected: object, path: string[]) {
  for (const key in expected) {
    const value = (expected as any)[key];
    if (value && typeof value === 'object') {
      match((received as any)[key], value, path.concat(key));
    } else {
      assert.equal((received as any)[key], value, path.join('.'));
    }
  }
}

export function assertMatchObject(received: object | null, expected: object) {
  if (received === null) assert.equal(received, expected);
  return match(received as object, expected, []);
}
