/*module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
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
*/
/*
module.exports = {
  // https://github.com/prettier/eslint-config-prettier
  //extends: ['plugin:prettier/recommended'],
  root: true,
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    'eslint:recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
};*/

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    /*,
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:vue/essential',
    'plugin:vue/recommended',*/
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    'max-len': [
      2,
      180,
      4,
      {
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
        ignoreStrings: true,
      },
    ],
    /*'prettier/prettier': 'error',*/
  },
};
