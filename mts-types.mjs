import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';

const packagePath = process.cwd();
const typesDir = `${packagePath}/types`;

const from = /\bfrom (['"])(\.[^'"]*)\1;/g;
const tsExt = /\.ts(\.map)?$/;

for (const file of readdirSync(typesDir)) {
  if (!file.endsWith('.d.ts') && !file.endsWith('.d.ts.map')) continue;

  const path = `${typesDir}/${file}`;
  const contents = readFileSync(path, 'utf8');

  const cts = contents.replace(from, 'from $1$2.cts$1;');
  const mts = contents.replace(from, 'from $1$2.mts$1;');

  unlinkSync(path);
  writeFileSync(path.replace(tsExt, `.cts$1`), cts);
  writeFileSync(path.replace(tsExt, `.mts$1`), mts);
}
