import {
  comma,
  decodeInteger,
  encodeInteger,
  hasMoreVlq,
  indexOf,
  maybeWrite,
  posOut,
  semicolon,
  td,
} from './vlq';

type Line = number;
type Column = number;
type Kind = number;
type Name = number;
type Var = number;

type OriginalScope =
  | [Line, Column, Line, Column, Kind, Name]
  | [Line, Column, Line, Column, Kind, Name, Var]
  | [Line, Column, Line, Column, Kind, Name, Var, Var]
  | [Line, Column, Line, Column, Kind, Name, Var, Var, Var]
  | [Line, Column, Line, Column, Kind, Name, Var, Var, Var, Var]
  | [Line, Column, Line, Column, Kind, Name, Var, Var, Var, Var, Var];

const NO_NAME = -1;

export function decodeOriginalScopes(input: string): OriginalScope[] {
  let line = 0;
  let column = 0;
  let namesIndex = 0;
  let varsIndex = 0;
  const scopes: OriginalScope[] = [];
  const stack: OriginalScope[] = [];

  for (let i = 0; i < input.length; i = posOut + 1) {
    line = decodeInteger(input, i, line);
    column = decodeInteger(input, posOut, column);

    if (!hasMoreVlq(input, posOut, length)) {
      const last = stack.pop()!;
      last[2] = line;
      last[3] = column;
      continue;
    }

    const kind = decodeInteger(input, posOut, 0);
    const fields = decodeInteger(input, posOut, 0);
    const name = fields & 0b1 ? decodeInteger(input, posOut, namesIndex) : NO_NAME;
    const scope: OriginalScope = [line, column, 0, 0, kind, name];
    stack.push(scope);

    const index = indexOf(input, ',', posOut);
    while (posOut < index) {
      varsIndex = decodeInteger(input, posOut, varsIndex);
      scope.push(varsIndex);
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
  let pos = 0;

  const endStack: number[] = [0, 0];
  let { 2: lastEndLine, 3: lastEndColumn } = scopes[scopes.length - 1];
  let line = 0;
  let column = 0;
  let namesIndex = 0;
  let varsIndex = 0;

  for (let i = 0; i < scopes.length; i++, pos = posOut) {
    const scope = scopes[i];
    const { 0: startLine, 1: startColumn, 2: endLine, 3: endColumn, 4: name } = scope;

    out = maybeWrite(out, buf, pos, buf, bufLength);
    pos = posOut;
    if (i > 0) buf[pos++] = semicolon;

    while (startLine > lastEndLine || (startLine === lastEndLine && startColumn >= lastEndColumn)) {
      out = maybeWrite(out, sub, pos, buf, subLength);

      line = encodeInteger(buf, posOut, lastEndLine, line);
      column = encodeInteger(buf, posOut, lastEndColumn, column);
      pos = posOut;
      buf[pos++] = comma;

      lastEndColumn = endStack.pop()!;
      lastEndLine = endStack.pop()!;
    }

    line = encodeInteger(buf, pos, startLine, line);
    column = encodeInteger(buf, posOut, startColumn, column);
    endStack.push(endLine);
    endStack.push(endColumn);
    lastEndLine = endLine;
    lastEndColumn = endColumn;

    encodeInteger(buf, posOut, name === NO_NAME ? 0 : 1, 0);
    if (name !== NO_NAME) namesIndex = encodeInteger(buf, posOut, name, namesIndex);

    for (let j = 5; j < scope.length; j++) {
      out = maybeWrite(out, sub, pos, buf, subLength);
      varsIndex = encodeInteger(buf, posOut, scope[j], varsIndex);
    }
  }
  while (endStack.length > 0) {}
}
