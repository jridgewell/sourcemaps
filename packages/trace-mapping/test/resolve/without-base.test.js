const resolve = require('../..');
const assert = require('assert');

describe('without base', () => {
  describe(`base = undefined`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = undefined;
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = undefined;
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = undefined;
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = undefined;
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = undefined;
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = undefined;
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = undefined;
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = undefined;
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = undefined;
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = undefined;
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = undefined;
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = undefined;
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = undefined;
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = undefined;
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = undefined;
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = undefined;
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = undefined;
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = undefined;
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = undefined;
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = undefined;
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = undefined;
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = undefined;
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = undefined;
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = undefined;
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = undefined;
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = undefined;
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = undefined;
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = undefined;
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = undefined;
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = undefined;
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = undefined;
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = undefined;
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = undefined;
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = undefined;
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = undefined;
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = undefined;
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = undefined;
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = undefined;
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = undefined;
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = undefined;
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = undefined;
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = undefined;
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = undefined;
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = undefined;
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = undefined;
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = undefined;
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = undefined;
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = undefined;
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = undefined;
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = undefined;
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = undefined;
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = undefined;
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = undefined;
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = undefined;
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '');
      });
    });
  });

  describe(`base = ""`, () => {
    describe('with absolute input', () => {
      it('returns input', () => {
        const base = '';
        const input = 'https://absolute.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('returns input with query', () => {
        const base = '';
        const input = 'https://absolute.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '';
        const input = 'https://absolute.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '';
        const input = 'https://absolute.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '';
        const input = 'https://absolute.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '';
        const input = 'https://absolute.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '';
        const input = 'https://absolute.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '';
        const input = 'https://absolute.com/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '';
        const input = 'https://absolute.com/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'https://absolute.com/main.js.map');
      });

      it('normalizes file protocol 1', () => {
        const base = '';
        const input = 'file:///root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 2', () => {
        const base = '';
        const input = 'file://root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map');
      });

      it('normalizes file protocol 2.5', () => {
        const base = '';
        const input = 'file://root';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/');
      });

      it('normalizes file protocol 3', () => {
        const base = '';
        const input = 'file:/root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 4', () => {
        const base = '';
        const input = 'file:root/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map');
      });

      it('normalizes file protocol 1 with query', () => {
        const base = '';
        const input = 'file:///root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 2 with query', () => {
        const base = '';
        const input = 'file://root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/main.js.map?input');
      });

      it('normalizes file protocol 2.5 with query', () => {
        const base = '';
        const input = 'file://root?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file://root/?input');
      });

      it('normalizes file protocol 3 with query', () => {
        const base = '';
        const input = 'file:/root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });

      it('normalizes file protocol 4 with query', () => {
        const base = '';
        const input = 'file:root/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'file:///root/main.js.map?input');
      });
    });

    describe('with protocol relative input', () => {
      it('resolves relative to the base protocol', () => {
        const base = '';
        const input = '//protocol-relative.com/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('resolves relative to the base protocol with query', () => {
        const base = '';
        const input = '//protocol-relative.com/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map?input');
      });

      it('normalizes input path', () => {
        const base = '';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map');
      });

      it('normalizes input path with query', () => {
        const base = '';
        const input = '//protocol-relative.com/foo/./bar/../main.js.map?input!webpack://foo/./bar';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/foo/main.js.map?input!webpack://foo/./bar');
      });

      it('normalizes pathless input', () => {
        const base = '';
        const input = '//protocol-relative.com';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/');
      });

      it('normalizes pathless input with query', () => {
        const base = '';
        const input = '//protocol-relative.com?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/?input');
      });

      it('normalizes current directory', () => {
        const base = '';
        const input = '//protocol-relative.com/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '';
        const input = '//protocol-relative.com/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '';
        const input = '//protocol-relative.com/foo/../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '//protocol-relative.com/main.js.map');
      });
    });

    describe('with absolute path input', () => {
      it('remains absolute path', () => {
        const base = '';
        const input = '/assets/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map');
      });

      it('remains absolute path with query', () => {
        const base = '';
        const input = '/assets/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/assets/main.js.map?input');
      });

      it('trims to root', () => {
        const base = '';
        const input = '/';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/');
      });

      it('normalizes input path', () => {
        const base = '';
        const input = '/foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/foo/main.js.map');
      });

      it('normalizes current directory', () => {
        const base = '';
        const input = '/./main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors', () => {
        const base = '';
        const input = '/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });

      it('normalizes too many parent accessors with query 1', () => {
        const base = '';
        const input = '/../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors with query 2', () => {
        const base = '';
        const input = '/../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/?input');
      });

      it('normalizes too many parent accessors, late', () => {
        const base = '';
        const input = '/foo/../../../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '/main.js.map');
      });
    });

    describe('with leading dot relative input', () => {
      it('resolves relative to current directory', () => {
        const base = '';
        const input = './bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '';
        const input = './bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './bar/main.js.map?input');
      });

      it('resolves relative to parent directory', () => {
        const base = '';
        const input = '../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map');
      });

      it('resolves relative to parent directory with query', () => {
        const base = '';
        const input = '../bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory', () => {
        const base = '';
        const input = '../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../../bar/main.js.map');
      });

      it('resolves relative to parent multiple directory with query 1', () => {
        const base = '';
        const input = '../../../?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('resolves relative to parent multiple directory with query 2', () => {
        const base = '';
        const input = '../../..?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../..?input');
      });

      it('normalizes input path', () => {
        const base = '';
        const input = './foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, './foo/main.js.map');
      });
    });

    describe('with relative path input', () => {
      it('resolves relative to current directory', () => {
        const base = '';
        const input = 'bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map');
      });

      it('resolves relative to current directory with query', () => {
        const base = '';
        const input = 'bar/main.js.map?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'bar/main.js.map?input');
      });

      it('resolves relative to parent multiple directory, later', () => {
        const base = '';
        const input = 'foo/../../../bar/main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '../../bar/main.js.map');
      });

      it('normalizes input path', () => {
        const base = '';
        const input = 'foo/./bar/../main.js.map';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'foo/main.js.map');
      });

      it('resolves node_module scope as path', () => {
        const base = '';
        const input = 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, 'node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });

      it('resolves package scope as path', () => {
        const base = '';
        const input = '@babel/runtime/helpers/esm/arrayLikeToArray.js';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '@babel/runtime/helpers/esm/arrayLikeToArray.js');
      });
    });

    describe('with query input', () => {
      it('resolves relative to path', () => {
        const base = '';
        const input = '?input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '?input');
      });
    });

    describe('with hash input', () => {
      it('resolves relative to path', () => {
        const base = '';
        const input = '#input';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '#input');
      });
    });

    describe('empty input', () => {
      it('normalizes base', () => {
        const base = '';
        const input = '';
        const resolved = resolve(input, base);
        assert.strictEqual(resolved, '');
      });
    });
  });
});
