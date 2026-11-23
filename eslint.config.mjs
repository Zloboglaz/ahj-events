export default [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-unreachable': 'error',
      'no-undef': 'error',
      'no-constant-condition': 'error',
      'no-duplicate-case': 'error',
      'constructor-super': 'error',
    },
  },
  {
    files: ['src/**/*.test.js'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
];
