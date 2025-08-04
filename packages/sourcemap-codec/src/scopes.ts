import { StringReader, StringWriter } from './strings';
import {
  comma,
  decodeInteger,
  decodeSign,
  encodeInteger,
  encodeSign,
  hasMoreVlq,
  semicolon,
} from './vlq';

const EMPTY: any[] = [];
const ORIG_START = 'B'.charCodeAt(0);
const ORIG_END = 'C'.charCodeAt(0);
const ORIG_VARS = 'D'.charCodeAt(0);
const GEN_START = 'E'.charCodeAt(0);
const GEN_END = 'F'.charCodeAt(0);
const GEN_BINDS = 'G'.charCodeAt(0);
const GEN_SUB_BIND = 'H'.charCodeAt(0);
const GEN_CALLSITE = 'I'.charCodeAt(0);
const UNSET = -1;

type Source = number;
type Line = number;
type Column = number;
type Kind = number;
type Name = number;
type Var = number;
type SourcesIndex = number;
type Definition = number;
type Flags = number;
type Mix<A, B, O> = (A & O) | (B & O);

export interface Scopes {
  originalScopes: Array<OriginalScope | null>;
  generatedRanges: GeneratedRange[];
}

export type OriginalScope = Mix<
  [Source, Line, Column, Line, Column],
  [Source, Line, Column, Line, Column, Name],
  {
    flags: Flags;
    kind: Kind;
    vars: Var[];
  }
>;

export type GeneratedRange = Mix<
  [Source, Line, Column, Line, Column],
  [Source, Line, Column, Line, Column, Definition],
  {
    flags: Flags;
    callsite: CallSite | null;
    bindings: Binding[];
  }
>;
export type CallSite = [SourcesIndex, Line, Column];
type Binding = BindingExpressionRange[];
export type BindingExpressionRange = [Name] | [Name, Line, Column];

type OriginalState = [Source, Line, Column, Name, Kind, Var];
type RangeState = [Source, Line, Column, Definition];

export function decodeScopes(input: string): Scopes {}

export function encodeScopes(scopes: Scopes): string {
  const { originalScopes, generatedRanges } = scopes;
  const writer = new StringWriter();

  const originalState: OriginalState = [0, 0, 0, 0, 0];
  for (let i = 0; i < originalScopes.length; ) {
    i = encodeOriginalScope(writer, originalScopes, i, originalState);
  }

  const rangeState: RangeState = [0];
  for (let i = 0; i < generatedRanges.length; ) {
    i = encodeGeneratedRange(writer, generatedRanges, i, rangeState);
  }

  return writer.flush();
}

function encodeOriginalScope(
  writer: StringWriter,
  scopes: Array<OriginalScope | null>,
  index: number,
  state: OriginalState,
): number {
  const scope = scopes[index];
  if (writer.pos > 0) writer.write(comma);

  if (scope == null) return index + 1;
  const {
    0: _index,
    1: startLine,
    2: startColumn,
    3: endLine,
    4: endColumn,
    flags,
    kind,
    vars,
  } = scope;

  writer.write(ORIG_START);

  encodeInteger(
    writer,
    flags | (scope.length === 6 ? 0b0001 : 0b0000) | (kind > UNSET ? 0b0010 : 0b0000),
  );

  const relativeStartLine = startLine - state[0];
  encodeInteger(writer, relativeStartLine);
  state[0] = startLine;
  if (relativeStartLine > 0) state[1] = 0;

  const relativeStartColumn = startColumn - state[1];
  encodeInteger(writer, relativeStartColumn);
  state[1] = startColumn;

  if (scope.length === 6) {
    const name = scope[5];
    const relativeName = name - state[2];
    encodeInteger(writer, encodeSign(relativeName));
    state[2] = name;
  }

  if (kind > UNSET) {
    const relativeKind = kind - state[3];
    encodeInteger(writer, encodeSign(relativeKind));
    state[3] = kind;
  }

  if (vars.length > 0) {
    writer.write(comma);
    writer.write(ORIG_VARS);
    for (const v of vars) {
      const relativeVar = v - state[4];
      encodeInteger(writer, encodeSign(relativeVar));
      state[4] = v;
    }
  }

  for (index++; index < scopes.length; ) {
    const next = scopes[index];
    // Null scope can only happen at the root, so it can't be nested.
    if (next == null) break;
    const { 0: l, 1: c } = next;
    if (l > endLine || (l === endLine && c >= endColumn)) {
      break;
    }
    index = encodeOriginalScope(writer, scopes, index, state);
  }

  const relativeEndLine = endLine - state[0];
  encodeInteger(writer, relativeEndLine);
  state[0] = endLine;
  if (relativeEndLine > 0) state[1] = 0;

  const relativeEndColumn = endColumn - state[1];
  encodeInteger(writer, relativeEndColumn);
  state[1] = endColumn;

  return index;
}

function encodeGeneratedRange(
  writer: StringWriter,
  ranges: GeneratedRange[],
  index: number,
  state: RangeState,
): number {
  const range = ranges[index];
  const {
    0: _index,
    1: startLine,
    2: startColumn,
    3: endLine,
    4: endColumn,
    flags,
    callsite,
    bindings,
  } = range;
  if (writer.pos > 0) writer.write(comma);

  writer.write(GEN_START);

  const relativeStartLine = startLine - state[1];
  encodeInteger(
    writer,
    flags | (relativeStartLine > 0 ? 0b0001 : 0b000) | (range.length === 6 ? 0b0010 : 0b0000),
  );

  if (relativeStartLine > 0) {
    encodeInteger(writer, relativeStartLine);
    state[1] = startLine;
    state[2] = 0;
  }

  const relativeStartColumn = startColumn - state[2];
  encodeInteger(writer, relativeStartColumn);
  state[2] = startColumn;

  if (range.length === 6) {
    const definition = range[5];
    const relativeDefinition = definition - state[3];
    encodeInteger(writer, encodeSign(relativeDefinition));
    state[3] = definition;
  }
}
