/// <reference path="../../decoding-tests/scopes/scopes.d.ts" />

/* eslint-env node, mocha */

import {
  decodeScopes,
  encodeScopes,
  type GeneratedRange,
  type OriginalScope,
  type Scopes,
} from '../src/scopes';
import { resolve } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert/strict';

function fromSpec(golden: string, names: string[]): Scopes {
  const record: SourceMapRecord = JSON.parse(golden);
  function convertOriginalScope(x: OriginalScopeRecord, source: number): OriginalScope[] {
    const flags = 0;
    const startLine = x.start.line;
    const startColumn = x.start.column;
    const endLine = x.end.line;
    const endColumn = x.end.column;
    const name = x.name ? names.indexOf(x.name) : null;

    const scope = (
      name == null
        ? [source, flags, startLine, startColumn, endLine, endColumn]
        : [source, flags, startLine, startColumn, endLine, endColumn, name]
    ) as OriginalScope;

    if (x.kind) scope.kind = names.indexOf(x.kind);
    if (x.variables?.length) scope.vars = x.variables.map((y) => names.indexOf(y));
    return [scope, ...x.children.flatMap((y) => convertOriginalScope(y, source))];
  }
  function convertGeneratedRange(x: GeneratedRangeRecord): GeneratedRange[] {
    const flags = 0;
    const startLine = x.start.line;
    const startColumn = x.start.column;
    const endLine = x.end.line;
    const endColumn = x.end.column;
    const definition = x.definitionIndex;

    const range = (
      definition == null
        ? [flags, startLine, startColumn, endLine, endColumn]
        : [flags, startLine, startColumn, endLine, endColumn, definition]
    ) as GeneratedRange;

    return [range, ...x.children.flatMap(convertGeneratedRange)];
  }

  return {
    originalScopes: record.sources.flatMap((x, i) => {
      return x.scope && convertOriginalScope(x.scope, i);
    }),
    generatedRanges: record.ranges.flatMap(convertGeneratedRange),
  };
}

describe('scopes proposal', () => {
  const dir = resolve('../decoding-tests/scopes');
  for (const f of readdirSync(dir)) {
    const file = `${dir}/${f}`;
    if (!file.endsWith('.map')) continue;

    describe(f, () => {
      const map = JSON.parse(readFileSync(file, 'utf8'));
      const golden = fromSpec(readFileSync(`${file}.golden`, 'utf8'), map.names);

      it('decode', () => {
        const decoded = decodeScopes(map.scopes);
        assert.deepEqual(decoded.originalScopes, golden.originalScopes, 'original scopes');
        assert.deepEqual(decoded.generatedRanges, golden.generatedRanges, 'generated ranges');
      });

      it('encode', () => {
        const encoded = encodeScopes(golden);
        assert.equal(encoded, map.scopes);
      });
    });
  }
});
