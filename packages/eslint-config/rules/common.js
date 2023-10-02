module.exports = {
  rules: {
    // core
    'default-param-last': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: [],
      },
    ],

    // import
    'import/no-deprecated': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-namespace': 'error',
    'import/order': 'off',
    'import/prefer-default-export': 'off',

    // perfectionist
    'perfectionist/sort-objects': [
      'error',
      {
        'partition-by-comment': true,
        type: 'natural',
      },
    ],

    // prettier
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',

    // unicorn
    'unicorn/consistent-destructuring': 'off',
    'unicorn/filename-case': [
      'warn',
      {
        cases: {
          camelCase: false,
          kebabCase: true,
          pascalCase: true,
          snakeCase: false,
        },
      },
    ],
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/no-useless-switch-case': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-object-from-entries': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
};
