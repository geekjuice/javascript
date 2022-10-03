module.exports = {
  env: {
    browser: true,
  },

  rules: {
    // jsx-a11y
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/no-redundant-roles': 'warn',

    // react
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/state-in-constructor': 'off',

    // react-hooks
    'react-hooks/exhaustive-deps': 'warn',

    // unicorn
    'unicorn/prefer-dom-node-text-content': 'off',
  },
};
