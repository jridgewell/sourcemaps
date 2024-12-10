const resolve = require('../..');
const assert = require('assert');

describe('with protocol relative base', () => {
  describe(`base = "//foo.com"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });
    });
  });

  describe(`base = "//foo.com/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });
    });
  });

  describe(`base = "//foo.com/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file');
      });
    });
  });

  describe(`base = "//foo.com/dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/');
      });
    });
  });

  describe(`base = "//foo.com/dir/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/dir/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/dir/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/dir/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/dir/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/dir/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/dir/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/dir/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/dir/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/dir/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/dir/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/dir/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/dir/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/dir/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/dir/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/dir/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/dir/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/dir/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/dir/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/dir/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/dir/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/dir/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/dir/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/dir/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/dir/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/dir/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/dir/file');
      });
    });
  });

  describe(`base = "//foo.com/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });
    });
  });

  describe(`base = "//foo.com/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });
    });
  });

  describe(`base = "//foo.com/dir/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/dir/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/dir/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/dir/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/dir/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/dir/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/dir/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/dir/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/dir/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/dir/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/dir/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/dir/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/dir/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/dir/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/dir/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/dir/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/dir/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/dir/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/dir/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/dir/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/dir/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/dir/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/dir/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/dir/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/dir/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/dir/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/dir/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/dir/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/dir/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/dir/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });
    });
  });

  describe(`base = "//foo.com/file?baseQuery"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/file?baseQuery';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?baseQuery');
      });
    });
  });

  describe(`base = "//foo.com/file?baseQuery#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/file?baseQuery#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?baseQuery#baseHash');
      });
    });
  });

  describe(`base = "//foo.com/file#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//foo.com/file#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//foo.com/file#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//foo.com/file#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/?input');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//foo.com/file#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//foo.com/file#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//foo.com/file#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//foo.com/file#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//foo.com/file#baseHash');
      });
    });
  });

  describe(`base = "//g"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });
    });
  });

  describe(`base = "//g/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });
    });
  });

  describe(`base = "//g/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file');
      });
    });
  });

  describe(`base = "//g/dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/');
      });
    });
  });

  describe(`base = "//g/dir/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/dir/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/dir/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/dir/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/dir/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/dir/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/dir/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/dir/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/dir/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/dir/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/dir/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/dir/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/dir/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/dir/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/dir/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/dir/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/dir/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/dir/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/dir/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/dir/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/dir/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/dir/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/dir/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/dir/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/dir/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/dir/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/dir/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/dir/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/dir/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/dir/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/dir/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/dir/file');
      });
    });
  });

  describe(`base = "//g/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });
    });
  });

  describe(`base = "//g/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });
    });
  });

  describe(`base = "//g/dir/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/dir/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/dir/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/dir/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/dir/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/dir/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/dir/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/dir/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/dir/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/dir/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/dir/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/dir/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/dir/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/dir/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/dir/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/dir/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/dir/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/dir/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/dir/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/dir/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/dir/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/dir/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/dir/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/dir/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/dir/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/dir/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/dir/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/dir/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/dir/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/dir/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/dir/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/dir/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/dir/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/dir/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/dir/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });
    });
  });

  describe(`base = "//g/file?baseQuery"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file?baseQuery';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/file?baseQuery';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/file?baseQuery';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/file?baseQuery';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/file?baseQuery';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/file?baseQuery';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file?baseQuery';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/file?baseQuery';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/file?baseQuery';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/file?baseQuery';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/file?baseQuery';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file?baseQuery';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/file?baseQuery';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/file?baseQuery';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file?baseQuery';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file?baseQuery';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file?baseQuery';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/file?baseQuery';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/file?baseQuery';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/file?baseQuery';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/file?baseQuery';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/file?baseQuery';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file?baseQuery';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file?baseQuery';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/file?baseQuery';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/file?baseQuery';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/file?baseQuery';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file?baseQuery';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file?baseQuery';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/file?baseQuery';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?baseQuery');
      });
    });
  });

  describe(`base = "//g/file?baseQuery#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/file?baseQuery#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?baseQuery#baseHash');
      });
    });
  });

  describe(`base = "//g/file#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '//g/file#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '//g/file#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '//g/file#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '//g/file#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '//g/file#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '//g/file#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '//g/file#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '//g/file#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '//g/file#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '//g/file#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '//g/file#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '//g/file#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '//g/file#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/');
      });

      it('normalizes input path', () => {
        const base = '//g/file#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '//g/file#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '//g/file#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '//g/file#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '//g/file#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '//g/file#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '//g/file#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '//g/file#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '//g/file#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '//g/file#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '//g/file#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/?input');
      });

      it('normalizes input path', () => {
        const base = '//g/file#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '//g/file#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '//g/file#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '//g/file#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '//g/file#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '//g/file#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '//g/file#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '//g/file#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '//g/file#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//g/file#baseHash');
      });
    });
  });
});
