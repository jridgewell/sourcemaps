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
  decodeFirstOctet,
  semicolon,
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
      vars?: Var[];
      length: 5;
    }
  | {
      0: Line;
      1: Column;
      2: Line;
      3: Column;
      4: Kind;
      5: Name;
      vars?: Var[];
      length: 6;
    };

const NO_NAME = -1;
const NO_SOURCE = -1;

export function decodeOriginalScopes(input: string): OriginalScope[] {
  let line = 0;
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
    const name = fields & 0b0001 ? decodeInteger(input, posOut, 0) : NO_NAME;
    const scope: OriginalScope =
      name === NO_NAME ? [line, column, 0, 0, kind] : [line, column, 0, 0, kind, name];
    scopes.push(scope);
    stack.push(scope);

    const index = indexOf(input, ',', posOut);
    if (posOut < index) {
      const vars: Var[] = [];
      scope.vars = vars;
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

    const fields = name === NO_NAME ? 0 : 1;
    encodeInteger(buf, posOut, fields, 0);
    if (name !== NO_NAME) encodeInteger(buf, posOut, name, 0);

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

// type OptionalFields<T> = {
// [K in keyof T]: K extends number ? T[K] : never;
// } & {
// [K in keyof T]: K extends string ? T[K] : never;
// };
export type GeneratedRange = {
  0: Line;
  1: Column;
  2: Line;
  3: Column;
  4: SourcesIndex;
  5: ScopesIndex;
  callsite?: CallSite;
  bindings?: ExpressionBinding[][];
  isScope?: boolean;
};
export type CallSite = [SourcesIndex, Line, Column];
export type ExpressionBinding = [Name] | [Name, Line, Column];

export function decodeGeneratedRanges(input: string): GeneratedRange[] {
  let genLine = 0;
  let genColumn = 0;
  let definitionSourcesIndex = 0;
  let definitionScopeIndex = 0;
  let callsiteSourcesIndex = 0;
  let callsiteLine = 0;
  let callsiteColumn = 0;
  let bindingLine = 0;
  let bindingColumn = 0;

  const ranges: GeneratedRange[] = [];
  const stack: GeneratedRange[] = [];
  let index = 0;
  do {
    const semi = indexOf(input, ';', index);
    genColumn = 0;

    for (let i = index; i < semi; i = posOut + 1) {
      genColumn = decodeInteger(input, i, genColumn);
      if (hasMoreVlq(input, posOut, semi)) {
        const fields = decodeInteger(input, posOut, 0);
        let defSourcesIndex = NO_SOURCE;
        let defScopeIndex = NO_SOURCE;

        if (fields & 0b0001) {
          defSourcesIndex = decodeInteger(input, posOut, definitionSourcesIndex);
          if (definitionSourcesIndex !== defSourcesIndex) {
            definitionScopeIndex = 0;
            definitionSourcesIndex = defSourcesIndex;
          }
          defScopeIndex = definitionScopeIndex = decodeInteger(input, posOut, definitionScopeIndex);
        }

        const range: GeneratedRange = [genLine, genColumn, 0, 0, defSourcesIndex, defScopeIndex];

        if (fields & 0b0010) {
          const callSourcesIndex = decodeInteger(input, posOut, callsiteSourcesIndex);
          const sameSource = callSourcesIndex === callsiteSourcesIndex;
          const callLine = decodeInteger(input, posOut, sameSource ? callsiteLine : 0);
          const sameLine = sameSource && callLine === callsiteLine;
          callsiteColumn = decodeInteger(input, posOut, sameLine ? callsiteColumn : 0);

          callsiteSourcesIndex = callSourcesIndex;
          callsiteLine = callLine;
          range.callsite = [callsiteSourcesIndex, callsiteLine, callsiteColumn];
        }
        if (fields & 0b0100) {
          range.isScope = true;
        }

        if (hasMoreVlq(input, posOut, semi)) {
          const bindings: ExpressionBinding[][] = [];
          range.bindings = bindings;
          do {
            bindingLine = genLine;
            bindingColumn = genColumn;
            let name = decodeInteger(input, posOut, 0);
            const hasExpressions = decodeFirstOctet(input, posOut);
            const binding: ExpressionBinding[] = [[name]];
            bindings.push(binding);
            if (hasExpressions < -1) {
              const expressionsCount = decodeInteger(input, posOut, 0);
              for (let i = -1; i > expressionsCount; i--) {
                const prevBindingLine = bindingLine;
                bindingLine = decodeInteger(input, posOut, bindingLine);
                bindingColumn = decodeInteger(
                  input,
                  posOut,
                  bindingLine === prevBindingLine ? bindingColumn : 0,
                );
                name = decodeInteger(input, posOut, 0);
              }
              binding.push([name, bindingLine, bindingColumn] as ExpressionBinding);
            }
          } while (hasMoreVlq(input, posOut, semi));
        }

        ranges.push(range);
        stack.push(range);
      } else {
        const range = stack.pop()!;
        range[2] = genLine;
        range[3] = genColumn;
      }
    }

    genLine++;
    index = semi + 1;
  } while (index <= input.length);

  return ranges;
}

export function encodeGeneratedRanges(ranges: GeneratedRange[]): string {
  let out = '';
  if (ranges.length === 0) return out;

  const bufLength = 1024 * 16;
  const subLength = bufLength - (7 * 7 + 1);
  const buf = new Uint8Array(bufLength);
  const sub = buf.subarray(0, subLength);
  resetPos();

  const endStack: number[] = [];
  let lastEndLine = ranges[0][2] + 1;
  let lastEndColumn = ranges[0][3];
  let line = 0;
  let genColumn = 0;
  let definitionSourcesIndex = 0;
  let definitionScopeIndex = 0;
  let callsiteSourcesIndex = 0;
  let callsiteLine = 0;
  let callsiteColumn = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const {
      0: startLine,
      1: startColumn,
      2: endLine,
      3: endColumn,
      4: defSourcesIndex,
      5: defScopeIndex,
    } = range;
    const isScope = 'isScope' in range && range.isScope;
    const hasCallsite = 'callsite' in range;
    const hasBindings = 'bindings' in range;

    while (startLine > lastEndLine || (startLine === lastEndLine && startColumn >= lastEndColumn)) {
      if (line < lastEndLine) {
        out = catchupLine(out, buf, bufLength, line, lastEndLine);
        line = lastEndLine;
        genColumn = 0;
      } else {
        out = maybeFlush(out, buf, posOut, buf, bufLength);
        write(buf, posOut, comma);
      }
      out = maybeFlush(out, sub, posOut, buf, subLength);
      genColumn = encodeInteger(buf, posOut, lastEndColumn, genColumn);

      lastEndColumn = endStack.pop()!;
      lastEndLine = endStack.pop()!;
    }
    if (line < startLine) {
      out = catchupLine(out, buf, bufLength, line, startLine);
      line = startLine;
      genColumn = 0;
    } else if (i > 0) {
      out = maybeFlush(out, buf, posOut, buf, bufLength);
      write(buf, posOut, comma);
    }

    out = maybeFlush(out, sub, posOut, buf, subLength);
    genColumn = encodeInteger(buf, posOut, range[1], genColumn);
    endStack.push(lastEndLine);
    endStack.push(lastEndColumn);
    lastEndLine = endLine;
    lastEndColumn = endColumn;

    const fields =
      (defSourcesIndex === NO_SOURCE ? 0 : 0b0001) |
      (hasCallsite ? 0b0010 : 0) |
      (isScope ? 0b0100 : 0);
    encodeInteger(buf, posOut, fields, 0);

    if (defSourcesIndex !== NO_SOURCE) {
      if (defSourcesIndex !== definitionSourcesIndex) definitionScopeIndex = 0;
      definitionSourcesIndex = encodeInteger(buf, posOut, defSourcesIndex, definitionSourcesIndex);
      definitionScopeIndex = encodeInteger(buf, posOut, defScopeIndex, definitionScopeIndex);
    }

    if (hasCallsite) {
      const { 0: callSourcesIndex, 1: callLine, 2: callColumn } = range.callsite!;
      if (callSourcesIndex !== callsiteSourcesIndex) {
        callsiteLine = 0;
        callsiteColumn = 0;
      } else if (callLine !== callsiteLine) {
        callsiteColumn = 0;
      }
      callsiteSourcesIndex = encodeInteger(buf, posOut, callSourcesIndex, callsiteSourcesIndex);
      callsiteLine = encodeInteger(buf, posOut, callLine, callsiteLine);
      callsiteColumn = encodeInteger(buf, posOut, callColumn, callsiteColumn);
    }

    if (hasBindings) {
      for (const binding of range.bindings!) {
        out = maybeFlush(out, sub, posOut, buf, subLength);
        encodeInteger(buf, posOut, binding[0][0], 0);
        if (binding.length > 1) {
          encodeInteger(buf, posOut, -binding.length, 0);
          let bindingStartLine = startLine;
          let bindingStartColumn = startColumn;
          for (let i = 1; i < binding.length; i++) {
            out = maybeFlush(out, sub, posOut, buf, subLength);
            const expression = binding[i];
            bindingStartLine = encodeInteger(buf, posOut, expression[1]!, bindingStartLine);
            bindingStartColumn = encodeInteger(buf, posOut, expression[2]!, bindingStartColumn);
            encodeInteger(buf, posOut, expression[0]!, 0);
          }
        }
      }
    }
  }
  while (endStack.length > 0) {
    if (line < lastEndLine) {
      out = catchupLine(out, buf, bufLength, line, lastEndLine);
      line = lastEndLine;
      genColumn = 0;
    } else {
      out = maybeFlush(out, buf, posOut, buf, bufLength);
      write(buf, posOut, comma);
    }
    out = maybeFlush(out, sub, posOut, buf, subLength);
    genColumn = encodeInteger(buf, posOut, lastEndColumn, genColumn);

    lastEndColumn = endStack.pop()!;
    lastEndLine = endStack.pop()!;
  }

  return out + td.decode(buf.subarray(0, posOut));
}

function catchupLine(
  build: string,
  buf: Uint8Array,
  bufLength: number,
  lastLine: number,
  line: number,
) {
  do {
    build = maybeFlush(build, buf, posOut, buf, bufLength);
    write(buf, posOut, semicolon);
  } while (++lastLine < line);
  return build;
}
