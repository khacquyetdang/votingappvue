module.exports = {
  extends: 'standard',
  rules: {
    semi: [2, 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always',
        objects: 'always',
        imports: 'always',
        exports: 'always',
        functions: 'never',
      },
    ],
  },
};
