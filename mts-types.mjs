import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';

const packagePath = process.cwd();
const typesDir = `${packagePath}/types`;

function rename(path, ext) {
  return path.replace(/\.ts(\.map)?$/, `.${ext}$1`);
}

const from = /\bfrom (['"])(\.[^'"]*)\1;/g;
for (const file of readdirSync(typesDir)) {
  if (!file.endsWith('.d.ts') && !file.endsWith('.d.ts.map')) continue;

  const path = `${typesDir}/${file}`;
  const contents = readFileSync(path, 'utf8');

  const cts = contents.replace(/^export default/gm, 'export =').replace(from, 'from $1$2.cts$1;');
  const mts = contents.replace(from, 'from $1$2.mts$1;');

  unlinkSync(path);
  writeFileSync(rename(path, 'cts'), cts);
  writeFileSync(rename(path, 'mts'), mts);
}
