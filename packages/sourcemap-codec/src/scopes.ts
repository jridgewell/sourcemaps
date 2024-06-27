import { StringReader, StringWriter } from './strings';
import { comma, decodeInteger, encodeInteger, hasMoreVlq, semicolon } from './vlq';

type Line = number;
type Column = number;
type Kind = number;
type Name = number;
type Var = number;
type SourcesIndex = number;
type ScopesIndex = number;

type Mix<A, B, O> = (A & O) | (B & O);

export type OriginalScope = Mix<
  [Line, Column, Line, Column, Kind],
  [Line, Column, Line, Column, Kind, Name],
  { vars?: Var[] }
>;

export type GeneratedRange = Mix<
  [Line, Column, Line, Column],
  [Line, Column, Line, Column, SourcesIndex, ScopesIndex],
  {
    callsite?: CallSite;
    bindings?: ExpressionBinding[][];
    isScope?: boolean;
  }
>;
export type CallSite = [SourcesIndex, Line, Column];
export type ExpressionBinding = [Name] | [Name, Line, Column];

export function decodeOriginalScopes(input: string): OriginalScope[] {
  const { length } = input;
  const reader = new StringReader(input);
  const scopes: OriginalScope[] = [];
  const stack: OriginalScope[] = [];
  let line = 0;

  for (; reader.pos < length; reader.pos++) {
    line = decodeInteger(reader, line);
    const column = decodeInteger(reader, 0);

    if (!hasMoreVlq(reader, length)) {
      const last = stack.pop()!;
      last[2] = line;
      last[3] = column;
      continue;
    }

    const kind = decodeInteger(reader, 0);
    const fields = decodeInteger(reader, 0);
    const hasName = fields & 0b0001;
    const scope: OriginalScope = hasName
      ? [line, column, 0, 0, kind, decodeInteger(reader, 0)]
      : [line, column, 0, 0, kind];
    scopes.push(scope);
    stack.push(scope);

    if (hasMoreVlq(reader, length)) {
      const vars: Var[] = [];
      scope.vars = vars;
      do {
        const varsIndex = decodeInteger(reader, 0);
        vars.push(varsIndex);
      } while (hasMoreVlq(reader, length));
    }
  }

  return scopes;
}

export function encodeOriginalScopes(scopes: OriginalScope[]): string {
  if (scopes.length === 0) return '';

  const writer = new StringWriter();
  const endStack: number[] = [];
  let lastEndLine = scopes[0][2] + 1;
  let lastEndColumn = scopes[0][3];
  let line = 0;

  for (let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    const { 0: startLine, 1: startColumn, 2: endLine, 3: endColumn, 4: kind } = scope;
    const vars = 'vars' in scope ? scope.vars! : [];

    if (i > 0) writer.write(comma);

    while (startLine > lastEndLine || (startLine === lastEndLine && startColumn >= lastEndColumn)) {
      line = encodeInteger(writer, lastEndLine, line);
      encodeInteger(writer, lastEndColumn, 0);
      writer.write(comma);

      lastEndColumn = endStack.pop()!;
      lastEndLine = endStack.pop()!;
    }

    line = encodeInteger(writer, startLine, line);
    encodeInteger(writer, startColumn, 0);
    endStack.push(lastEndLine);
    endStack.push(lastEndColumn);
    lastEndLine = endLine;
    lastEndColumn = endColumn;

    encodeInteger(writer, kind, 0);

    const fields = scope.length === 6 ? 0b0001 : 0;
    encodeInteger(writer, fields, 0);
    if (scope.length === 6) encodeInteger(writer, scope[5], 0);

    for (const v of vars) {
      encodeInteger(writer, v, 0);
    }
  }

  while (endStack.length > 0) {
    writer.write(comma);
    line = encodeInteger(writer, lastEndLine, line);
    encodeInteger(writer, lastEndColumn, 0);

    lastEndColumn = endStack.pop()!;
    lastEndLine = endStack.pop()!;
  }

  return writer.flush();
}

export function decodeGeneratedRanges(input: string): GeneratedRange[] {
  const reader = new StringReader(input);
  const ranges: GeneratedRange[] = [];
  const stack: GeneratedRange[] = [];

  let genLine = 0;
  let genColumn = 0;
  let definitionSourcesIndex = 0;
  let definitionScopeIndex = 0;
  let callsiteSourcesIndex = 0;
  let callsiteLine = 0;
  let callsiteColumn = 0;
  let bindingLine = 0;
  let bindingColumn = 0;

  do {
    const semi = reader.indexOf(';');
    genColumn = 0;

    for (; reader.pos < semi; reader.pos++) {
      genColumn = decodeInteger(reader, genColumn);

      if (!hasMoreVlq(reader, semi)) {
        const range = stack.pop()!;
        range[2] = genLine;
        range[3] = genColumn;
        continue;
      }

      const fields = decodeInteger(reader, 0);
      const hasDefinition = fields & 0b0001;
      const hasCallsite = fields & 0b0010;
      const isScope = fields & 0b0100;

      let range: GeneratedRange;
      if (hasDefinition) {
        const defSourcesIndex = decodeInteger(reader, definitionSourcesIndex);
        definitionScopeIndex = decodeInteger(
          reader,
          definitionSourcesIndex === defSourcesIndex ? definitionScopeIndex : 0,
        );

        definitionSourcesIndex = defSourcesIndex;
        range = [genLine, genColumn, 0, 0, defSourcesIndex, definitionScopeIndex];
      } else {
        range = [genLine, genColumn, 0, 0];
      }

      if (hasCallsite) {
        const prevCsi = callsiteSourcesIndex;
        const prevLine = callsiteLine;
        callsiteSourcesIndex = decodeInteger(reader, callsiteSourcesIndex);
        const sameSource = prevCsi === callsiteSourcesIndex;
        callsiteLine = decodeInteger(reader, sameSource ? callsiteLine : 0);
        callsiteColumn = decodeInteger(
          reader,
          sameSource && prevLine === callsiteLine ? callsiteColumn : 0,
        );

        range.callsite = [callsiteSourcesIndex, callsiteLine, callsiteColumn];
      }

      if (isScope) {
        range.isScope = true;
      }

      if (hasMoreVlq(reader, semi)) {
        const bindings: ExpressionBinding[][] = [];
        range.bindings = bindings;
        do {
          bindingLine = genLine;
          bindingColumn = genColumn;
          const expressionsCount = decodeInteger(reader, 0);
          let expressionRanges: ExpressionBinding[];
          if (expressionsCount < -1) {
            expressionRanges = [[decodeInteger(reader, 0)]];
            for (let i = -1; i > expressionsCount; i--) {
              const prevBl = bindingLine;
              bindingLine = decodeInteger(reader, bindingLine);
              bindingColumn = decodeInteger(reader, bindingLine === prevBl ? bindingColumn : 0);
              const expression = decodeInteger(reader, 0);
              expressionRanges.push([expression, bindingLine, bindingColumn]);
            }
          } else {
            expressionRanges = [[expressionsCount]];
          }
          bindings.push(expressionRanges);
        } while (hasMoreVlq(reader, semi));
      }

      ranges.push(range);
      stack.push(range);
    }

    genLine++;
    reader.pos = semi + 1;
  } while (reader.hasMore());

  return ranges;
}

export function encodeGeneratedRanges(ranges: GeneratedRange[]): string {
  if (ranges.length === 0) return '';

  const writer = new StringWriter();
  const endStack: number[] = [];
  let lastEndLine = ranges[0][2] + 1;
  let lastEndColumn = ranges[0][3];
  let line = 0;
  let genColumn = 0;
  let relDefSourcesIndex = 0;
  let relDefScopeIndex = 0;
  let relCallSourcesIndex = 0;
  let relCallLine = 0;
  let relCallColumn = 0;
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const { 0: startLine, 1: startColumn, 2: endLine, 3: endColumn } = range;
    const isScope = 'isScope' in range && range.isScope;
    const hasCallsite = 'callsite' in range;
    const bindings = 'bindings' in range ? range.bindings! : [];

    while (startLine > lastEndLine || (startLine === lastEndLine && startColumn >= lastEndColumn)) {
      if (line < lastEndLine) {
        catchupLine(writer, line, lastEndLine);
        line = lastEndLine;
        genColumn = 0;
      } else {
        writer.write(comma);
      }
      genColumn = encodeInteger(writer, lastEndColumn, genColumn);

      lastEndColumn = endStack.pop()!;
      lastEndLine = endStack.pop()!;
    }

    if (line < startLine) {
      catchupLine(writer, line, startLine);
      line = startLine;
      genColumn = 0;
    } else if (i > 0) {
      writer.write(comma);
    }

    genColumn = encodeInteger(writer, range[1], genColumn);
    endStack.push(lastEndLine);
    endStack.push(lastEndColumn);
    lastEndLine = endLine;
    lastEndColumn = endColumn;

    const fields =
      (range.length === 6 ? 0b0001 : 0) | (hasCallsite ? 0b0010 : 0) | (isScope ? 0b0100 : 0);
    encodeInteger(writer, fields, 0);

    if (range.length === 6) {
      const { 4: sourcesIndex, 5: scopesIndex } = range;
      if (sourcesIndex !== relDefSourcesIndex) {
        relDefScopeIndex = 0;
      }
      relDefSourcesIndex = encodeInteger(writer, sourcesIndex, relDefSourcesIndex);
      relDefScopeIndex = encodeInteger(writer, scopesIndex, relDefScopeIndex);
    }

    if (hasCallsite) {
      const { 0: sourcesIndex, 1: callLine, 2: callColumn } = range.callsite!;
      if (sourcesIndex !== relCallSourcesIndex) {
        relCallLine = 0;
        relCallColumn = 0;
      } else if (callLine !== relCallLine) {
        relCallColumn = 0;
      }
      relCallSourcesIndex = encodeInteger(writer, sourcesIndex, relCallSourcesIndex);
      relCallLine = encodeInteger(writer, callLine, relCallLine);
      relCallColumn = encodeInteger(writer, callColumn, relCallColumn);
    }

    for (const binding of bindings) {
      if (binding.length > 1) encodeInteger(writer, -binding.length, 0);
      const expression = binding[0][0];
      encodeInteger(writer, expression, 0);
      let bindingStartLine = startLine;
      let bindingStartColumn = startColumn;
      for (let i = 1; i < binding.length; i++) {
        const expRange = binding[i];
        bindingStartLine = encodeInteger(writer, expRange[1]!, bindingStartLine);
        bindingStartColumn = encodeInteger(writer, expRange[2]!, bindingStartColumn);
        encodeInteger(writer, expRange[0]!, 0);
      }
    }
  }

  while (endStack.length > 0) {
    if (line < lastEndLine) {
      catchupLine(writer, line, lastEndLine);
      line = lastEndLine;
      genColumn = 0;
    } else {
      writer.write(comma);
    }
    genColumn = encodeInteger(writer, lastEndColumn, genColumn);

    lastEndColumn = endStack.pop()!;
    lastEndLine = endStack.pop()!;
  }

  return writer.flush();
}

function catchupLine(writer: StringWriter, lastLine: number, line: number) {
  do {
    writer.write(semicolon);
  } while (++lastLine < line);
}
