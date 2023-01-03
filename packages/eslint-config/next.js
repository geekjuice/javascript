require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'next/core-web-vitals',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'prettier',
    require.resolve('./rules/common'),
    require.resolve('./rules/web'),
    require.resolve('./rules/esm'),
  ],
};
