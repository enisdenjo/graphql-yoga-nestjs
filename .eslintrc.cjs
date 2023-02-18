/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  extends: ['@theguild'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-unused-vars': 'off', // TODO: check with typescript compiler
    '@typescript-eslint/no-empty-function': 'off',
    'no-empty': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'import/extensions': 'off',
    'import/no-default-export': 'off',
    'no-undef': 'off', // this is typescripts responsibility
  },
};
module.exports = config;
