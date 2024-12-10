const resolve = require('../..');
const assert = require('assert');

describe('with relative path base', () => {
  describe(`base = "file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = 'file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file');
      });
    });
  });

  describe(`base = "dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/');
      });
    });
  });

  describe(`base = "dir/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'dir/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'dir/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'dir/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'dir/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'dir/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'dir/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'dir/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'dir/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'dir/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'dir/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'dir/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'dir/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'dir/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'dir/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'dir/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'dir/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'dir/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'dir/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'dir/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'dir/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'dir/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'dir/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'dir/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'dir/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'dir/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'dir/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'dir/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'dir/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'dir/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'dir/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'dir/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'dir/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'dir/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'dir/file');
      });
    });
  });

  describe(`base = "deep/dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'deep/dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'deep/dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'deep/dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'deep/dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'deep/dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'deep/dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'deep/dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'deep/dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'deep/dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'deep/dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'deep/dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'deep/dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'deep/dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'deep/dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'deep/dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'deep/dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'deep/dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'deep/dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'deep/dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'deep/dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'deep/dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'deep/dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'deep/dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'deep/dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'deep/dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'deep/dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'deep/dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'deep/dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });

      it('normalizes input path', () => {
        const base = 'deep/dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'deep/dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'deep/dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'deep/dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'deep/dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'deep/dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'deep/dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'deep/dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'deep/dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'deep/dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'deep/dir/');
      });
    });
  });

  describe(`base = "./file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = './file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './file');
      });
    });
  });

  describe(`base = "./dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('normalizes input path', () => {
        const base = './dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './dir/');
      });
    });
  });

  describe(`base = "./deep/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './deep/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './deep/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './deep/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './deep/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './deep/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './deep/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './deep/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './deep/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './deep/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './deep/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './deep/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './deep/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './deep/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './deep/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './deep/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './deep/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './deep/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './deep/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './deep/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './deep/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './deep/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './deep/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('normalizes input path', () => {
        const base = './deep/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './deep/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './deep/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './deep/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './deep/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './deep/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './deep/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './deep/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/file');
      });
    });
  });

  describe(`base = "./deep/dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './deep/dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './deep/dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './deep/dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './deep/dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './deep/dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './deep/dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './deep/dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './deep/dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './deep/dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './deep/dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './deep/dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './deep/dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './deep/dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './deep/dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './deep/dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './deep/dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './deep/dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './deep/dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './deep/dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './deep/dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './deep/dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './deep/dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });

      it('normalizes input path', () => {
        const base = './deep/dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './deep/dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './deep/dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './deep/dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './deep/dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './deep/dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './deep/dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './deep/dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './deep/dir/');
      });
    });
  });

  describe(`base = "../file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../file');
      });
    });
  });

  describe(`base = "../dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../dir/');
      });
    });
  });

  describe(`base = "../deep/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../deep/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../deep/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../deep/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../deep/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../deep/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../deep/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../deep/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../deep/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../deep/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../deep/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../deep/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../deep/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../deep/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../deep/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../deep/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../deep/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../deep/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../deep/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../deep/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../deep/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../deep/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../deep/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../deep/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../deep/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../deep/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../deep/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../deep/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/file');
      });
    });
  });

  describe(`base = "../deep/dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../deep/dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../deep/dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../deep/dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../deep/dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../deep/dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../deep/dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../deep/dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../deep/dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../deep/dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../deep/dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../deep/dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../deep/dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../deep/dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../deep/dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../deep/dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../deep/dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../deep/dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../deep/dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../deep/dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../deep/dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../deep/dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../deep/dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../deep/dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../deep/dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../deep/dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../deep/dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../deep/dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../deep/dir/');
      });
    });
  });

  describe(`base = ".."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..');
      });
    });
  });

  describe(`base = "../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..');
      });
    });
  });

  describe(`base = "dir/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'dir/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'dir/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'dir/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'dir/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'dir/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'dir/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'dir/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'dir/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'dir/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'dir/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'dir/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'dir/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'dir/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'dir/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'dir/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'dir/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'dir/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'dir/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'dir/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'dir/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'dir/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'dir/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'dir/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'dir/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'dir/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'dir/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = 'dir/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'dir/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'dir/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'dir/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'dir/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'dir/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'dir/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'dir/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'dir/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'dir/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '.');
      });
    });
  });

  describe(`base = "deep/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'deep/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'deep/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'deep/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'deep/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'deep/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'deep/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'deep/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'deep/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'deep/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'deep/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'deep/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'deep/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'deep/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'deep/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'deep/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'deep/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'deep/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'deep/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'deep/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'deep/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'deep/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'deep/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'deep/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'deep/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'deep/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'deep/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'deep/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'deep/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = 'deep/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'deep/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'deep/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'deep/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'deep/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'deep/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'deep/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'deep/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'deep/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'deep/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '.');
      });
    });
  });

  describe(`base = "./.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = './..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..');
      });
    });
  });

  describe(`base = "./../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = './../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..');
      });
    });
  });

  describe(`base = "./deep/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './deep/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './deep/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './deep/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './deep/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './deep/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './deep/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './deep/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './deep/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './deep/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './deep/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './deep/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './deep/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './deep/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './deep/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './deep/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './deep/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './deep/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './deep/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './deep/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './deep/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './deep/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './deep/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = './deep/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './deep/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './deep/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './deep/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './deep/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './deep/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './deep/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './deep/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '.');
      });
    });
  });

  describe(`base = "./deep/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = './deep/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = './deep/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = './deep/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = './deep/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = './deep/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = './deep/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = './deep/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = './deep/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = './deep/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = './deep/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = './deep/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = './deep/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = './deep/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = './deep/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = './deep/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = './deep/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = './deep/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = './deep/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = './deep/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = './deep/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = './deep/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = './deep/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = './deep/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = './deep/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = './deep/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = './deep/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = './deep/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = './deep/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = './deep/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = './deep/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = './deep/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = './deep/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = './deep/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = './deep/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '.');
      });
    });
  });

  describe(`base = "../.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..');
      });
    });
  });

  describe(`base = "../../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../..');
      });
    });
  });

  describe(`base = "../deep/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../deep/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../deep/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../deep/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../deep/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../deep/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../deep/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../deep/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../deep/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../deep/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../deep/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../deep/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../deep/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../deep/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../deep/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../deep/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../deep/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../deep/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../deep/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../deep/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../deep/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../deep/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../deep/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../deep/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../deep/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../deep/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../deep/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../deep/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..');
      });
    });
  });

  describe(`base = "../deep/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '../deep/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '../deep/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '../deep/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '../deep/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '../deep/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '../deep/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '../deep/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '../deep/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '../deep/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '../deep/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '../deep/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '../deep/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '../deep/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '../deep/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '../deep/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '../deep/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '../deep/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '../deep/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '../deep/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '../deep/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '../deep/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '../deep/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '../deep/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '../deep/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../..?input');
      });

      it('normalizes input path', () => {
        const base = '../deep/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '../deep/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '../deep/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '../deep/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '../deep/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '../deep/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '../deep/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '../deep/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '../deep/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '..');
      });
    });
  });

  describe(`base = "file?baseQuery"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file?baseQuery';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'file?baseQuery';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'file?baseQuery';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'file?baseQuery';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'file?baseQuery';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'file?baseQuery';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'file?baseQuery';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'file?baseQuery';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'file?baseQuery';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'file?baseQuery';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'file?baseQuery';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file?baseQuery';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'file?baseQuery';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'file?baseQuery';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'file?baseQuery';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'file?baseQuery';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file?baseQuery';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'file?baseQuery';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'file?baseQuery';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file?baseQuery';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file?baseQuery';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file?baseQuery';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'file?baseQuery';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'file?baseQuery';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'file?baseQuery';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'file?baseQuery';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'file?baseQuery';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file?baseQuery';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file?baseQuery';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'file?baseQuery';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'file?baseQuery';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'file?baseQuery';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'file?baseQuery';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'file?baseQuery';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'file?baseQuery';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?baseQuery');
      });
    });
  });

  describe(`base = "file?baseQuery#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'file?baseQuery#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?baseQuery#baseHash');
      });
    });
  });

  describe(`base = "file#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = 'file#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = 'file#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = 'file#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = 'file#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = 'file#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = 'file#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = 'file#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = 'file#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = 'file#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = 'file#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = 'file#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = 'file#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = 'file#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = 'file#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = 'file#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = 'file#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = 'file#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = 'file#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = 'file#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = 'file#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = 'file#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = 'file#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = 'file#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = 'file#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = 'file#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = 'file#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = 'file#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = 'file#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = 'file#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = 'file#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = 'file#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = 'file#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = 'file#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = 'file#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file#baseHash');
      });
    });
  });
});
