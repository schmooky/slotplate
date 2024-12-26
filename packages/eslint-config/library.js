const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "airbnb",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
    "eslint-config-turbo"
  ],
  plugins: ["only-warn", "@typescript-eslint", "react", "react-hooks", "import", "prettier"],
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    }
  },
  settings: {

  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser

  parserOptions: {
    project: "./tsconfig.lint.json",
    ecmaVersion: "latest", // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      js: true,
      jsx: true,
      ts: true,
      tsx: true,
    },
  },

  rules: {
    "prettier/prettier": "warn", // УБРАТЬ
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-use-before-define": ["error"],
    "object-curly-newline": [
      "error",
      {
        multiline: true,
        consistent: true,
      },
    ],
    "no-use-before-define": 0,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx", ".tsx", ".ts"],
      },
    ],
    "max-len": [
      "error",
      {
        code: 400,
      },
    ],
    "react/prop-types": 0,
    "import/extensions": 0,
    "import/no-named-as-default": 0,
    "import/prefer-default-export": 0,
    "import/no-unresolved": 0,
    "no-console": 2,
    "consistent-return": 0,
    "no-plusplus": 0,
    "no-underscore-dangle": 0,
    "import/no-mutable-exports": 0,
    "max-classes-per-file": 0,
    "linebreak-style": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "import/order": 0,
    "react/no-unknown-property": 1,
    // "prettier/prettier": "error",
    semi: [0, "never"],
    "no-shadow": [0, "never"],
    "implicit-arrow-linebreak": 0,
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    'no-unused-vars': "off",
    '@typescript-eslint/no-unused-vars': "off",
    "max-len": ["error", {
      "ignoreTemplateLiterals": true,
      "ignoreStrings": true,
      "ignoreComments": true,
      "ignoreTrailingComments": false,
    }],
    "quotes": ["error", "double"]
  },
};