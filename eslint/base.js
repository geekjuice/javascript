module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    es2020: true,
    jest: true,
  },
  rules: {
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-implicit-coercion': 'error',
    'no-param-reassign': ['error', { props: true }],
    'no-use-before-define': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
      },
    },
  ],
};
