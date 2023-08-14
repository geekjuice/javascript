require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'airbnb',
    'next/core-web-vitals',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'prettier',
    require.resolve('./rules/common'),
    require.resolve('./rules/esm'),
    require.resolve('./rules/typescript'),
    require.resolve('./rules/web'),
  ],
};
