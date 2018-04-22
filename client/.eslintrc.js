module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:vue/essential',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    indent: 'off',
    'vue/script-indent': [
      'warn',
      2,
      {
        baseIndent: 1,
      },
    ],
  },
};
