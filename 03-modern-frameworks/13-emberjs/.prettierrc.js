'use strict';

module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  semi: true,
  bracketSpacing: true,
  endOfLine: 'lf',
  tabWidth: 2,
  overrides: [
    {
      files: '*.hbs',
      options: {
        singleQuote: false,
      },
    },
  ],
};
