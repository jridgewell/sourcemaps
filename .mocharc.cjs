module.exports = {
  'node-option': [
    'import=tsx',
    process.argv.includes('--inspect-brk') ? 'inspect-brk' : '',
  ].filter(Boolean),
  reporter: 'min',
  spec: ['test/**/test.ts', 'test/**/*.test.ts'],
  'watch-files': ['src/**/*.ts', 'test/**/test.ts', 'test/**/*.test.ts'],
};