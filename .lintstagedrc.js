module.exports = {
  '*.{js,mjs,ts,tsx}': ['eslint --fix --quiet', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
};
