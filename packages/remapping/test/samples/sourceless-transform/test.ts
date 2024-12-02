import remapping, { type SourceMapLoader } from '../../../src/remapping';
import sinon from 'sinon';
import assert from 'node:assert/strict';

describe('source-less transform', () => {
  const original: any = {
    version: '3',
    sources: ['source.ts'],
    names: [],
    mappings: 'AAAA',
    sourcesContent: ['// hello'],
  };
  const minified: any = {
    version: '3',
    sources: [],
    names: [],
    mappings: '',
  };

  it('remapping with loader generates empty sourcemap', () => {
    let called = false;
    const loader = sinon.fake(() => {
      if (called) return null;
      called = true;
      return original;
    });
    const remapped = remapping(minified, loader);

    assert.equal(loader.callCount, 0);
    assert.equal(remapped.sources.length, 0);
    assert.equal(remapped.mappings, '');
  });

  it('remapping with array shorthand generates empty sourcemap', () => {
    const loader = sinon.fake((() => null) as SourceMapLoader);
    const remapped = remapping([minified, original], loader);

    assert.equal(loader.callCount, 1);
    assert(loader.calledWith('source.ts', sinon.match.any));
    assert.equal(remapped.sources.length, 0);
    assert.equal(remapped.mappings, '');
  });
});
