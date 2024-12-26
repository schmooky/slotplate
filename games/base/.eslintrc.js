/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',

  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    '@eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
  ],

  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },

  globals: {
    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
  },

  rules: {
    'no-console': 0,
    'comma-dangle': 0,
    semi: 0,
    indent: 0,
    'import/no-unresolved': 0,
    'linebreak-style': 0,
    'import/prefer-default-export': 0,
    'unicorn/filename-case': 0,
    'object-curly-newline': 0,
    'import/extensions': 0,
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/no-throw-literal': 0,
    'jsdoc/require-jsdoc': 0,
    'no-param-reassign': 0,
    'no-async-promise-executor': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'unicorn/no-null': 0,
    'unicorn/no-invalid-remove-event-listener': 0,
    'unicorn/number-literal-case': 0,
    'space-before-function-paren': 0,
    'max-len': 'off',
    'implicit-arrow-linebreak': 0,
    'unicorn/numeric-separators-style': 0,
    '@typescript-eslint/no-misused-new': 0,
    'import/no-extraneous-dependencies': 0,
    'unicorn/no-array-for-each': 0,
    'sonarjs/cognitive-complexity': 0,
    '@typescript-eslint/indent': 0,
    'react/display-name': 0,
    'function-paren-newline': 0,
    'no-confusing-arrow': 0,
  },
};
