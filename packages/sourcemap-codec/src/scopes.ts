import { StringReader, StringWriter } from './strings';
import { comma, decodeInteger, decodeSign, encodeInteger, encodeSign } from './vlq';

let ORIG_EMPTY = 'A'.charCodeAt(0);
let ORIG_START = 'B'.charCodeAt(0);
let ORIG_END = 'C'.charCodeAt(0);
let ORIG_VARS = 'D'.charCodeAt(0);
let GEN_START = 'E'.charCodeAt(0);
let GEN_END = 'F'.charCodeAt(0);
let GEN_BINDS = 'G'.charCodeAt(0);
let GEN_SUB_BIND = 'H'.charCodeAt(0);
let GEN_CALLSITE = 'I'.charCodeAt(0);
let UNSET = -1;

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

export type OriginalScopeNameless = [Source, Flags, Line, Column, Line, Column];
export type OriginalScopeNamed = [Source, Flags, Line, Column, Line, Column, Name];
export type OriginalScope = Mix<
  OriginalScopeNameless,
  OriginalScopeNamed,
  {
    kind: Kind;
    vars: Var[];
  }
>;

export type GeneratedRangeDefinitionless = [Flags, Line, Column, Line, Column];
export type GeneratedRangeDefinitioned = [Flags, Line, Column, Line, Column, Definition];
export type GeneratedRange = Mix<
  GeneratedRangeDefinitionless,
  GeneratedRangeDefinitioned,
  {
    callsite: CallSite | null;
    bindings: Binding[];
  }
>;
export type CallSite = [SourcesIndex, Line, Column];
type BindingInit = [Name];
type BindingSubBinding = [Name, Line, Column];
export type Binding = [BindingInit, ...BindingSubBinding[]];

type ScopeState = [Source, Line, Column, Name, Kind, Var];
type RangeState = [Line, Column, Definition];

export function decodeScopes(input: string): Scopes {
  let reader = new StringReader(input);
  let scopes: Scopes['originalScopes'] = [];
  let ranges: Scopes['generatedRanges'] = [];

  let scopeState: ScopeState = [0, 0, 0, 0, 0, 0];
  let rangeState: RangeState = [0, 0, 0];

  let scopeStack = [];
  let rangeStack = [];
  let lastRange;

  while (!reader.done()) {
    let tag = reader.next();
    switch (tag) {
      case ORIG_EMPTY:
        scopeState[0]++;
        scopes.push(null);
        break;

      case ORIG_START: {
        scopeState[1] = scopeState[2] = 0;
        let scope = decodeOriginalScope(reader, scopeState);
        scopeStack.push(scope);
        scopes.push(scope);
        break;
      }

      case ORIG_END:
        decodeOriginalScopeEnd(reader, scopeStack.pop()!, scopeState);
        if (scopeStack.length === 0) scopeState[0]++;
        break;

      case GEN_START: {
        let range = decodeGeneratedRange(reader, rangeState);
        lastRange = range;
        ranges.push(range);
        rangeStack.push(range);
        break;
      }

      case GEN_SUB_BIND:
        decodeGeneratedRangeSubBinding(reader, lastRange!);
        break;

      case GEN_END:
        decodeGeneratedRangeEnd(reader, lastRange!, rangeState);
        lastRange = rangeStack.pop();
        break;

      default: {
        let index = reader.indexOf(',');
        reader.pos = index + 1;
      }
    }
  }

  return { originalScopes: scopes, generatedRanges: ranges };
}

function decodeOriginalScope(reader: StringReader, state: ScopeState): OriginalScope {
  let source = state[0];
  let flags = decodeInteger(reader);

  let l = decodeInteger(reader);
  let c = decodeInteger(reader);
  let startLine = (state[1] += l);
  let startColumn = l > 0 ? (state[2] = c) : (state[2] += c);

  let name = flags & 0b0001 ? (state[3] += decodeSign(decodeInteger(reader))) : UNSET;
  let kind = flags & 0b0010 ? (state[4] += decodeSign(decodeInteger(reader))) : UNSET;

  let scope = (
    name === UNSET
      ? ([source, flags, startLine, startColumn, 0, 0] satisfies OriginalScopeNameless)
      : ([source, flags, startLine, startColumn, 0, 0, name] satisfies OriginalScopeNamed)
  ) as OriginalScope;

  if (kind !== UNSET) scope.kind = kind;

  // Eat the next comma, we're guaranteed at least an end token follows.
  reader.next();

  if (reader.peek() === ORIG_VARS) {
    reader.pos++;
    let end = reader.indexOf(',');
    let vars: Var[] = (scope.vars = []);
    while (reader.pos < end) {
      vars.push((state[5] += decodeSign(decodeInteger(reader))));
    }
    // Eat the comma.
    reader.next();
  }

  return scope;
}

function decodeOriginalScopeEnd(reader: StringReader, scope: OriginalScope, state: ScopeState) {
  let l = decodeInteger(reader);
  let c = decodeInteger(reader);
  let endLine = (state[1] += l);
  let endColumn = l > 0 ? (state[2] = c) : (state[2] += c);

  scope[4] = endLine;
  scope[5] = endColumn;

  // Eat the comma.
  reader.next();
}

function decodeGeneratedRange(reader: StringReader, state: RangeState): GeneratedRange {
  let flags = decodeInteger(reader);

  let l = flags & 0b0001 ? decodeInteger(reader) : 0;
  let c = decodeInteger(reader);
  let startLine = (state[0] += l);
  let startColumn = l > 0 ? (state[1] = c) : (state[1] += c);

  let definition = flags & 0b0010 ? (state[2] += decodeSign(decodeInteger(reader))) : UNSET;

  let range = (
    definition === UNSET
      ? ([flags, startLine, startColumn, 0, 0] satisfies GeneratedRangeDefinitionless)
      : ([flags, startLine, startColumn, 0, 0, definition] satisfies GeneratedRangeDefinitioned)
  ) as GeneratedRange;

  // Eat the next comma, we're guaranteed at least an end token follows.
  reader.next();

  if (reader.peek() === GEN_BINDS) {
    reader.pos++;
    let end = reader.indexOf(',');
    let bindings: Binding[] = (range.bindings = []);
    while (reader.pos < end) {
      let expression = decodeInteger(reader) - 1;
      let b = [expression] satisfies BindingInit;
      bindings.push([b]);
    }
    // Eat the comma.
    reader.next();
  }

  if (reader.peek() === GEN_CALLSITE) {
    reader.pos++;
    let source = decodeInteger(reader);
    let line = decodeInteger(reader);
    let column = decodeInteger(reader);
    range.callsite = [source, line, column];

    // Eat the comma.
    reader.next();
  }

  return range;
}

function decodeGeneratedRangeSubBinding(reader: StringReader, range: GeneratedRange) {
  let fromLine = range[1];
  let fromColumn = range[2];

  let index = decodeInteger(reader);
  let binds = range.bindings[index];
  let end = reader.indexOf(',');
  while (reader.pos < end) {
    let l = decodeInteger(reader);
    let c = decodeInteger(reader);
    let line = (fromLine += l);
    let column = l > 0 ? (fromColumn = c) : (fromColumn += c);
    let expression = decodeInteger(reader) - 1;
    let b = [expression, line, column] satisfies BindingSubBinding;
    binds.push(b);
  }

  // Eat the comma.
  reader.next();
}

function decodeGeneratedRangeEnd(reader: StringReader, range: GeneratedRange, state: RangeState) {
  let first = decodeInteger(reader);
  let l = 0;
  let c = first;
  if (reader.peek() !== comma) {
    l = first;
    c = decodeInteger(reader);
  }
  let endLine = (state[0] += l);
  let endColumn = l > 0 ? (state[1] = c) : (state[1] += c);

  range[3] = endLine;
  range[4] = endColumn;

  // Eat the comma.
  reader.next();
}

export function encodeScopes(scopes: Scopes): string {
  let { originalScopes, generatedRanges } = scopes;
  let writer = new StringWriter();

  let scopeState: ScopeState = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < originalScopes.length; ) {
    i = encodeOriginalScope(writer, originalScopes, i, scopeState);
  }

  let rangeState: RangeState = [0, 0, 0];
  for (let i = 0; i < generatedRanges.length; ) {
    i = encodeGeneratedRange(writer, generatedRanges, i, rangeState);
  }

  return writer.flush();
}

function encodeOriginalScope(
  writer: StringWriter,
  scopes: Array<OriginalScope | null>,
  index: number,
  state: ScopeState,
): number {
  let scope = scopes[index];
  if (writer.pos > 0) writer.write(comma);

  if (scope == null) {
    writer.write(ORIG_EMPTY);
    return index + 1;
  }

  let {
    0: source,
    1: flags,
    2: startLine,
    3: startColumn,
    4: endLine,
    5: endColumn,
    kind,
    vars,
  } = scope;

  writer.write(ORIG_START);

  encodeInteger(writer, flags);

  let l = startLine - state[1];
  encodeInteger(writer, l);
  state[1] = startLine;

  let c = startColumn - (l > 0 ? 0 : state[2]);
  encodeInteger(writer, c);
  state[2] = startColumn;

  if (scope.length === 7) {
    let name = scope[6];
    let n = name - state[3];
    encodeInteger(writer, encodeSign(n));
    state[3] = n;
  }

  if (kind !== undefined) {
    let k = kind - state[4];
    encodeInteger(writer, encodeSign(k));
    state[4] = kind;
  }

  if (vars !== undefined) {
    writer.write(comma);
    writer.write(ORIG_VARS);
    for (let name of vars) {
      let v = name - state[5];
      encodeInteger(writer, encodeSign(v));
      state[5] = name;
    }
  }

  for (index++; index < scopes.length; ) {
    let next = scopes[index];
    // Null scope can only happen at the root, so it can't be nested.
    if (next == null) break;
    let { 0: s, 1: l, 2: c } = next;
    if (s !== source || l > endLine || (l === endLine && c >= endColumn)) {
      break;
    }
    index = encodeOriginalScope(writer, scopes, index, state);
  }

  writer.write(comma);
  writer.write(ORIG_END);

  l = endLine - state[1];
  encodeInteger(writer, l);
  state[1] = endLine;

  c = endColumn - (l > 0 ? 0 : state[2]);
  encodeInteger(writer, c);
  state[2] = endColumn;

  return index;
}

function encodeGeneratedRange(
  writer: StringWriter,
  ranges: GeneratedRange[],
  index: number,
  state: RangeState,
): number {
  let range = ranges[index];
  let {
    0: flags,
    1: startLine,
    2: startColumn,
    3: endLine,
    4: endColumn,
    callsite,
    bindings,
  } = range;
  if (writer.pos > 0) writer.write(comma);

  writer.write(GEN_START);
  encodeInteger(writer, flags);

  let l = startLine - state[1];
  if (l > 0) {
    encodeInteger(writer, l);
    state[0] = startLine;
  }

  let c = startColumn - (l > 0 ? 0 : state[1]);
  encodeInteger(writer, c);
  state[1] = startColumn;

  if (range.length === 6) {
    let definition = range[5];
    let d = definition - state[2];
    encodeInteger(writer, encodeSign(d));
    state[2] = definition;
  }

  if (bindings) {
    writer.write(comma);
    writer.write(GEN_BINDS);

    for (let i = 0; i < bindings.length; i++) {
      let binds = bindings[i];
      let b = binds[0];
      let expression = b[0];
      encodeInteger(writer, expression + 1);
    }
  }

  if (callsite) {
    writer.write(comma);
    writer.write(GEN_CALLSITE);
    encodeInteger(writer, callsite[0]);
    encodeInteger(writer, callsite[1]);
    encodeInteger(writer, callsite[2]);
  }

  if (bindings) {
    for (let binds of bindings) {
      let fromLine = startLine;
      let fromColumn = startColumn;
      if (binds.length > 1) {
        writer.write(comma);
        writer.write(GEN_SUB_BIND);
      }
      for (let i = 1; i < binds.length; i++) {
        let b = binds[i] as unknown as BindingSubBinding;
        let { 0: expression, 1: line, 2: column } = b;

        let l = line - fromLine;
        encodeInteger(writer, l);
        fromLine = line;

        let c = column - (l > 0 ? 0 : fromColumn);
        encodeInteger(writer, c);
        fromColumn = c;

        encodeInteger(writer, expression + 1);
      }
    }
  }

  for (index++; index < ranges.length; ) {
    let { 0: l, 1: c } = ranges[index];
    if (l > endLine || (l === endLine && c >= endColumn)) {
      break;
    }
    index = encodeGeneratedRange(writer, ranges, index, state);
  }

  writer.write(comma);
  writer.write(GEN_END);

  l = endLine - state[0];
  if (l > 0) {
    encodeInteger(writer, l);
    state[0] = endLine;
  }

  c = endColumn - (l > 0 ? 0 : state[1]);
  encodeInteger(writer, c);
  state[1] = endColumn;

  return index;
}
