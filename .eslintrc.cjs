module.exports = {
  extends: ['@theguild'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-unused-vars': 'off', // TODO: check with typescript compiler
    '@typescript-eslint/no-empty-function': 'off',
    'no-empty': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'import/extensions': 'off',
  },
};
