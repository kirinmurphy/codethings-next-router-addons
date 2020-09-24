module.exports = {
  "env": {
    "browser": true,
    "es2020": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "testing-library",
    "jest-dom"
  ],
  "rules": {
    'indent': ['error', 2],
    'no-extra-boolean-cast': "off",
    'react/prop-types': "off"
  }
};
