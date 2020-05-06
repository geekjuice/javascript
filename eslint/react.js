module.exports = {
  extends: ['plugin:react/recommended', 'prettier/react'],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 'off',
  },
};
