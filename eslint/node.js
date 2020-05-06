module.exports = {
  extends: ['plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'node/no-missing-import': 'off',
        'node/no-missing-require': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
  ],
};
