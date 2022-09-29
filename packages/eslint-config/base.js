require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'prettier',
    require.resolve('./rules/common'),
  ],
};
