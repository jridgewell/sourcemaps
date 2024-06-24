import {
  comma,
  decodeInteger,
  encodeInteger,
  hasMoreVlq,
  indexOf,
  maybeFlush,
  posOut,
  write,
  td,
  resetPos,
} from './vlq';

type Line = number;
type Column = number;
type Kind = number;
type Name = number;
type Var = number;
type SourcesIndex = number;
type ScopesIndex = number;

export type OriginalScope =
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: Kind;
      length: 5;
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: Kind;
      5: Name;
      length: 6;
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: Kind;
      vars: Var[];
      length: 5;
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: Kind;
      5: Name;
      vars: Var[];
      length: 6;
    };

const NO_NAME = -1;
// const NO_SCOPE = -1;

export function decodeOriginalScopes(input: string): OriginalScope[] {
  let line = 0;
  let namesIndex = 0;
  const scopes: OriginalScope[] = [];
  const stack: OriginalScope[] = [];

  for (let i = 0; i < input.length; i = posOut + 1) {
    line = decodeInteger(input, i, line);
    const column = decodeInteger(input, posOut, 0);

    if (!hasMoreVlq(input, posOut, input.length)) {
      const last = stack.pop()!;
      last[2] = line;
      last[3] = column;
      continue;
    }

    const kind = decodeInteger(input, posOut, 0);
    const fields = decodeInteger(input, posOut, 0);
    const name = fields & 0b1 ? decodeInteger(input, posOut, namesIndex) : NO_NAME;
    const scope: OriginalScope =
      name === NO_NAME ? [line, column, 0, 0, kind] : [line, column, 0, 0, kind, name];
    scopes.push(scope);
    stack.push(scope);

    const index = indexOf(input, ',', posOut);
    if (posOut < index) {
      const vars: Var[] = [];
      (scope as any).vars = vars;
      while (posOut < index) {
        const varsIndex = decodeInteger(input, posOut, 0);
        vars.push(varsIndex);
      }
    }
  }

  return scopes;
}

export function encodeOriginalScopes(scopes: OriginalScope[]): string {
  let out = '';
  if (scopes.length === 0) return out;

  const bufLength = 1024 * 16;
  const subLength = bufLength - (7 * 6 + 1);
  const buf = new Uint8Array(bufLength);
  const sub = buf.subarray(0, subLength);
  resetPos();

  const endStack: number[] = [];
  let lastEndLine = scopes[0][2] + 1;
  let lastEndColumn = scopes[0][3];
  let line = 0;
  let namesIndex = 0;

  for (let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const { 0: startLine, 1: startColumn, 2: endLine, 3: endColumn, 4: kind } = scope;
    const name = scope.length === 6 ? scope[5] : NO_NAME;
    const vars = 'vars' in scope ? scope.vars! : [];

    out = maybeFlush(out, buf, posOut, buf, bufLength);
    if (i > 0) write(buf, posOut, comma);

    while (startLine > lastEndLine || (startLine === lastEndLine && startColumn >= lastEndColumn)) {
      out = maybeFlush(out, sub, posOut, buf, subLength);

      line = encodeInteger(buf, posOut, lastEndLine, line);
      encodeInteger(buf, posOut, lastEndColumn, 0);
      write(buf, posOut, comma);

      lastEndColumn = endStack.pop()!;
      lastEndLine = endStack.pop()!;
    }

    line = encodeInteger(buf, posOut, startLine, line);
    encodeInteger(buf, posOut, startColumn, 0);
    endStack.push(lastEndLine);
    endStack.push(lastEndColumn);
    lastEndLine = endLine;
    lastEndColumn = endColumn;

    encodeInteger(buf, posOut, kind, 0);
    encodeInteger(buf, posOut, name === NO_NAME ? 0 : 1, 0);
    if (name !== NO_NAME) namesIndex = encodeInteger(buf, posOut, name, namesIndex);

    for (const v of vars) {
      out = maybeFlush(out, sub, posOut, buf, subLength);
      encodeInteger(buf, posOut, v, 0);
    }
  }
  while (endStack.length > 0) {
    out = maybeFlush(out, sub, posOut, buf, subLength);

    write(buf, posOut, comma);
    line = encodeInteger(buf, posOut, lastEndLine, line);
    encodeInteger(buf, posOut, lastEndColumn, 0);

    lastEndColumn = endStack.pop()!;
    lastEndLine = endStack.pop()!;
  }

  return out + td.decode(buf.subarray(0, posOut));
}

export type GeneratedRange =
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: SourcesIndex;
      5: ScopesIndex;
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: SourcesIndex;
      5: ScopesIndex;
      callsite: CallSite;
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: SourcesIndex;
      5: ScopesIndex;
      bindings: ExpressionBinding[];
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: SourcesIndex;
      5: ScopesIndex;
      callsite: CallSite;
      bindings: ExpressionBinding[];
    };
export type CallSite = [SourcesIndex, Line, Column];
export type ExpressionBinding = [Name] | [Name, Line, Column];

export function decodeGeneratedRanges(input: string): GeneratedRange[] {
  return [];
}

export function encodeGeneratedRanges(ranges: GeneratedRange[]): string {
  return '';
}
