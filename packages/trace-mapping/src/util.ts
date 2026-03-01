/**
 * A helper for exhaustive type checking. We don't want to actually do anything,
 * we just want TS to tell us if we've missed a type branch.
 */
export function assertExhaustive(_value: never): void {}

/**
 * Parses a source map if it is a string, otherwise returns it as is.
 */
export function parse<T>(map: T): Exclude<T, string> {
  return typeof map === 'string' ? JSON.parse(map) : (map as Exclude<T, string>);
}
