const resolve = require('../..');
const assert = require('assert');

describe('readme', () => {
  const _any_ = 'https://foo/';
  const _rest_ = 'foo';
  describe('table 0', () => {
    it('input = `https://example.com`, base = _any_', () => {
      const input = `https://example.com`;
      const base = _any_;
      const expected = `https://example.com/`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `//example.com`, base = `https://base.com/`', () => {
      const input = `//example.com`;
      const base = `https://base.com/`;
      const expected = `https://example.com/`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `//example.com`, base = _rest_', () => {
      const input = `//example.com`;
      const base = _rest_;
      const expected = `//example.com/`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `/example`, base = `https://base.com/`', () => {
      const input = `/example`;
      const base = `https://base.com/`;
      const expected = `https://base.com/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `/example`, base = `//base.com/`', () => {
      const input = `/example`;
      const base = `//base.com/`;
      const expected = `//base.com/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `/example`, base = _rest_', () => {
      const input = `/example`;
      const base = _rest_;
      const expected = `/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `https://base.com/dir/`', () => {
      const input = `example`;
      const base = `https://base.com/dir/`;
      const expected = `https://base.com/dir/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `https://base.com/file`', () => {
      const input = `example`;
      const base = `https://base.com/file`;
      const expected = `https://base.com/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `//base.com/dir/`', () => {
      const input = `example`;
      const base = `//base.com/dir/`;
      const expected = `//base.com/dir/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `//base.com/file`', () => {
      const input = `example`;
      const base = `//base.com/file`;
      const expected = `//base.com/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `/base/dir/`', () => {
      const input = `example`;
      const base = `/base/dir/`;
      const expected = `/base/dir/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `/base/file`', () => {
      const input = `example`;
      const base = `/base/file`;
      const expected = `/base/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `base/dir/`', () => {
      const input = `example`;
      const base = `base/dir/`;
      const expected = `base/dir/example`;

      assert.strictEqual(resolve(input, base), expected);
    });

    it('input = `example`, base = `base/file`', () => {
      const input = `example`;
      const base = `base/file`;
      const expected = `base/example`;

      assert.strictEqual(resolve(input, base), expected);
    });
  });
});
