module.exports = {
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],

      extends: 'plugin:@typescript-eslint/recommended',

      parser: '@typescript-eslint/parser',

      plugins: ['@typescript-eslint'],

      rules: {
        // overrides
        'no-loop-func': 'off',
        '@typescript-eslint/no-loop-func': 'error',

        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',

        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false,
            enforceForJSX: false,
          },
        ],

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',

        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          {
            enums: true,
            functions: true,
            classes: true,
            typedefs: true,
            variables: true,
          },
        ],

        // react
        'react/prop-types': 'off',
      },
    },
  ],
};
