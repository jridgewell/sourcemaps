module.exports = {
  'node-option': [
    'import=tsx',
    ...(process.argv.indexOf('--inspect-brk') > 0 ? ['inspect-brk'] : []),
  ],
  reporter: 'min',
  spec: ['test/**/test.ts', 'test/**/*.test.ts'],
  'watch-files': ['src/**/*.ts', 'test/**/test.ts', 'test/**/*.test.ts'],
};
