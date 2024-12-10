const resolve = require('../..');
const assert = require('assert');

describe('with absolute path base', () => {
  describe(`base = "/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });
    });
  });

  describe(`base = "/root"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root');
      });
    });
  });

  describe(`base = "/root/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/');
      });
    });
  });

  describe(`base = "/root/file"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/file';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/file';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/file';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root/file';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root/file';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root/file';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root/file';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root/file';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root/file';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root/file';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root/file';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root/file';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root/file';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/file';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root/file';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root/file';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root/file';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root/file';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root/file';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/file';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root/file';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root/file';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/file';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/file';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/file';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root/file';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root/file';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root/file';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root/file';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root/file';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root/file';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/file';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/file';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root/file';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root/file';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root/file';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root/file';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root/file';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/file?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root/file';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/file#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root/file';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/file');
      });
    });
  });

  describe(`base = "/root/dir/"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/dir/';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root/dir/';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root/dir/';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root/dir/';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root/dir/';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root/dir/';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root/dir/';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root/dir/';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root/dir/';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root/dir/';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root/dir/';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/dir/';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root/dir/';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root/dir/';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root/dir/';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root/dir/';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root/dir/';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/dir/';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root/dir/';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root/dir/';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/dir/';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/dir/';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/dir/';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root/dir/';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root/dir/';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root/dir/';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root/dir/';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root/dir/';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root/dir/';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/dir/';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/dir/';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root/dir/';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root/dir/';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root/dir/';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root/dir/';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root/dir/';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root/dir/';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root/dir/';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root/dir/');
      });
    });
  });

  describe(`base = "/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });
    });
  });

  describe(`base = "/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });
    });
  });

  describe(`base = "/root/.."`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/..';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/..';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/..';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root/..';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root/..';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root/..';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root/..';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root/..';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root/..';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root/..';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root/..';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root/..';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root/..';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/..';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root/..';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root/..';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root/..';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root/..';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root/..';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/..';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root/..';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root/..';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/..';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/..';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/..';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root/..';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root/..';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root/..';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root/..';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root/..';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root/..';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/..';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/..';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root/..';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root/..';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root/..';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root/..';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root/..';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root/..';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root/..';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });
    });
  });

  describe(`base = "/root/../"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/../';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/../';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/../';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root/../';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root/../';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root/../';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root/../';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root/../';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root/../';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root/../';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root/../';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root/../';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root/../';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/../';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root/../';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root/../';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root/../';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root/../';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root/../';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root/../';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root/../';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root/../';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root/../';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/../';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/../';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root/../';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root/../';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root/../';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root/../';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root/../';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root/../';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root/../';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root/../';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root/../';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root/../';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root/../';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root/../';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root/../';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root/../';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root/../';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });
    });
  });

  describe(`base = "/root?baseQuery"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root?baseQuery';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root?baseQuery';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root?baseQuery';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root?baseQuery';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root?baseQuery';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root?baseQuery';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root?baseQuery';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root?baseQuery';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root?baseQuery';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root?baseQuery';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root?baseQuery';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root?baseQuery';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root?baseQuery';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root?baseQuery';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root?baseQuery';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root?baseQuery';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root?baseQuery';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root?baseQuery';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root?baseQuery';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root?baseQuery';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root?baseQuery';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root?baseQuery';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root?baseQuery';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root?baseQuery';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root?baseQuery';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root?baseQuery';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root?baseQuery';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root?baseQuery';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root?baseQuery';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root?baseQuery';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root?baseQuery';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root?baseQuery';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root?baseQuery';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root?baseQuery';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root?baseQuery';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?baseQuery');
      });
    });
  });

  describe(`base = "/root?baseQuery#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?baseQuery#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root?baseQuery#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?baseQuery#baseHash');
      });
    });
  });

  describe(`base = "/root#baseHash"`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root#baseHash';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '/root#baseHash';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '/root#baseHash';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '/root#baseHash';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '/root#baseHash';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '/root#baseHash';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '/root#baseHash';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '/root#baseHash';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '/root#baseHash';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '/root#baseHash';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '/root#baseHash';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root#baseHash';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '/root#baseHash';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '/root#baseHash';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '/root#baseHash';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '/root#baseHash';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '/root#baseHash';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '/root#baseHash';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '/root#baseHash';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '/root#baseHash';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '/root#baseHash';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root#baseHash';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root#baseHash';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '/root#baseHash';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '/root#baseHash';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '/root#baseHash';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '/root#baseHash';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '/root#baseHash';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes input path', () => {
        const base = '/root#baseHash';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '/root#baseHash';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '/root#baseHash';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '/root#baseHash';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '/root#baseHash';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '/root#baseHash';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '/root#baseHash';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '/root#baseHash';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '/root#baseHash';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '/root#baseHash';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/root#baseHash');
      });
    });
  });
});
