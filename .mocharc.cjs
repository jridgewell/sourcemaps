const { parseArgs } = require('node:util');
const {
  values,
  positionals,
} = parseArgs({
  strict: false,
  options: {
    'inspect-brk': { type: 'boolean' },
  },
});

module.exports = {
  'node-option': [
    'import=tsx',
    values['inspect-brk'] ? 'inspect-brk' : '',
  ].filter(Boolean),
  reporter: 'spec',
  spec: positionals.length ? positionals : ['test/**/test.ts', 'test/**/*.test.ts'],
  'watch-files': ['src/**/*.ts', 'test/**'],
};