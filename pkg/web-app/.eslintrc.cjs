/* eslint-disable no-process-env */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:react/recommended'],
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      globals: {
        JSX: true,
      },
      parser: '@typescript-eslint/parser',
      rules: {
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
        '@typescript-eslint/explicit-function-return-type': 'off',

        // https://eslint.org/docs/latest/rules/no-unused-vars
        '@typescript-eslint/no-unused-vars': 'error',
        'no-unused-vars': 'off',
      },
    },
  ],
  parserOptions: { requireConfigFile: false },
  plugins: ['import', 'react', 'react-hooks', 'sort-destructure-keys', '@typescript-eslint'],
  rules: {
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
    '@typescript-eslint/explicit-function-return-type': 'off',

    // https://typescript-eslint.io/rules/member-ordering/
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: {
          memberTypes: ['signature', 'method', 'constructor', 'field'],
          order: 'alphabetically-case-insensitive',
        },
      },
    ],

    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
    'import/first': 'warn',
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md
    'import/no-duplicates': 'error',

    // https://eslint.org/docs/rules/linebreak-style
    'linebreak-style': ['error', 'unix'],

    // https://eslint.org/docs/rules/no-case-declarations
    'no-case-declarations': 'warn',

    // https://eslint.org/docs/rules/no-console
    'no-console': 'off',

    // https://eslint.org/docs/rules/no-empty
    'no-empty': 'warn',

    // https://eslint.org/docs/rules/no-empty-pattern
    'no-empty-pattern': 'warn',

    // https://eslint.org/docs/rules/no-extra-boolean-cast
    'no-extra-boolean-cast': 'warn',

    // https://eslint.org/docs/rules/no-inner-declarations
    'no-inner-declarations': 'warn',

    // https://eslint.org/docs/rules/no-multiple-empty-lines
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],

    // https://eslint.org/docs/latest/rules/no-process-env
    'no-process-env': 'error',

    // https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'warn',

    // https://eslint.org/docs/rules/no-restricted-globals
    'no-restricted-globals': [
      'error',
      {
        message: 'Use local parameter instead',
        name: 'event',
      },
      {
        message: 'Use hook useLocation instead of global location object',
        name: 'location',
      },
    ],

    // https://eslint.org/docs/rules/no-self-assign
    'no-self-assign': 'warn',

    // https://eslint.org/docs/rules/no-undef
    'no-undef': 'error',

    // https://eslint.org/docs/latest/rules/no-unused-expressions
    'no-unused-expressions': 'error',

    // https://eslint.org/docs/rules/no-unused-vars
    'no-unused-vars': 'warn',

    // https://eslint.org/docs/rules/no-useless-escape
    'no-useless-escape': 'warn',

    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: false,
        ignoreCase: true,
        noSortAlphabetically: false,
        reservedFirst: false,
        shorthandFirst: false,
        shorthandLast: false,
      },
    ],

    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/prop-types': 'off',

    // https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#advanced-configuration
    'react-hooks/exhaustive-deps': 'warn',

    'react/react-in-jsx-scope': 'off',
    // https://reactjs.org/docs/hooks-rules.html
    'react-hooks/rules-of-hooks': 'error',

    // https://github.com/mthadley/eslint-plugin-sort-destructure-keys
    'sort-destructure-keys/sort-destructure-keys': ['error', { caseSensitive: false }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
