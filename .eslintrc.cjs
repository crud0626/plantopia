module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'aribnb/hooks',
    'airbnb-typescript',
    'next',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-case-declarations': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
