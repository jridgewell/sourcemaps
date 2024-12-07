import { SetArray, get, put, pop, remove } from '../src/set-array';
import { strict as assert } from 'assert';

describe('SetArray', () => {
  describe('get()', () => {
    it('returns undefined if not present', () => {
      const array = new SetArray();

      assert.equal(get(array, 'test'), undefined);
      assert.equal(get(array, 'foo'), undefined);

      put(array, 'test');
      assert.equal(get(array, 'test'), 0);

      assert.equal(get(array, 'foo'), undefined);
      put(array, 'foo');
      assert.equal(get(array, 'foo'), 1);

      assert.deepEqual(array.array, ['test', 'foo']);
    });
  });

  describe('put()', () => {
    it('puts string in if not present', () => {
      const array = new SetArray();

      put(array, 'test');
      assert.deepEqual(array.array, ['test']);
      put(array, 'test');
      assert.deepEqual(array.array, ['test']);

      put(array, 'foo');
      assert.deepEqual(array.array, ['test', 'foo']);
      put(array, 'bar');
      assert.deepEqual(array.array, ['test', 'foo', 'bar']);

      put(array, 'bar');
      assert.deepEqual(array.array, ['test', 'foo', 'bar']);
      put(array, 'foo');
      assert.deepEqual(array.array, ['test', 'foo', 'bar']);
    });

    it('returns index of string in array', () => {
      const array = new SetArray();

      assert.equal(put(array, 'test'), 0);
      assert.equal(put(array, 'foo'), 1);
      assert.equal(put(array, 'bar'), 2);
    });

    it('returns original index of string in array', () => {
      const array = new SetArray();

      put(array, 'test');
      put(array, 'foo');
      put(array, 'bar');

      assert.equal(put(array, 'test'), 0);
      assert.equal(put(array, 'foo'), 1);
      assert.equal(put(array, 'bar'), 2);
    });

    it('handles empty string', () => {
      const array = new SetArray();

      assert.equal(put(array, ''), 0);
      assert.equal(put(array, ''), 0);
      assert.deepEqual(array.array, ['']);
    });
  });

  describe('pop()', () => {
    it('removes last item from array', () => {
      const array = new SetArray();

      put(array, 'test');
      put(array, 'foo');
      put(array, 'bar');

      pop(array);
      assert.deepEqual(array.array, ['test', 'foo']);
      pop(array);
      assert.deepEqual(array.array, ['test']);
      pop(array);
      assert.deepEqual(array.array, []);
    });

    it('unsets the key', () => {
      const array = new SetArray();

      put(array, 'test');
      pop(array);
      assert.equal(get(array, 'test'), undefined);
    });

    it('putting afterwards writes to array at old index', () => {
      const array = new SetArray();

      put(array, 'test');
      pop(array);
      put(array, 'foo');
      assert.deepEqual(array.array, ['foo']);
    });

    it('getting after put gets old key ', () => {
      const array = new SetArray();

      put(array, 'test');
      pop(array);
      put(array, 'foo');
      assert.equal(get(array, 'foo'), 0);
    });
  });

  describe('remove()', () => {
    it('removes item from array', () => {
      const array = new SetArray();

      put(array, 'test');
      put(array, 'foo');
      put(array, 'bar');

      remove(array, 'foo');
      assert.deepEqual(array.array, ['test', 'bar']);
      remove(array, 'bar');
      assert.deepEqual(array.array, ['test']);
      remove(array, 'test');
      assert.deepEqual(array.array, []);
    });

    it('unsets the key', () => {
      const array = new SetArray();

      put(array, 'test');
      remove(array, 'test');
      assert.equal(get(array, 'test'), undefined);
    });

    it('updates indexes of following keys', () => {
      const array = new SetArray();

      put(array, 'test');
      put(array, 'foo');
      put(array, 'bar');

      remove(array, 'foo');
      assert.equal(get(array, 'test'), 0);
      assert.equal(get(array, 'bar'), 1);
    });

    it('putting afterwards writes to array at old index', () => {
      const array = new SetArray();

      put(array, 'test');
      remove(array, 'test');
      put(array, 'foo');
      assert.deepEqual(array.array, ['foo']);
    });

    it('getting after put gets old key ', () => {
      const array = new SetArray();

      put(array, 'test');
      remove(array, 'test');
      put(array, 'foo');
      assert.equal(get(array, 'foo'), 0);
    });
  });
});
