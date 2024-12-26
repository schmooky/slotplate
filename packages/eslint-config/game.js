module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: ".",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  ignorePatterns: ["vite.config.js", "postcss.config.js"],
  rules: {
    "no-console": "error",
    "prefer-const": "warn",
    semi: "off",
    camelcase: "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase", "UPPER_CASE"],
      },
      {
        selector: "import",
        format: ["PascalCase"],
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
      },
      {
        selector: "property",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "property",
        modifiers: ["protected"],
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "property",
        modifiers: ["static"],
        format: ["UPPER_CASE"],
      },
      {
        selector: "property",
        modifiers: ["private", "static"],
        format: ["UPPER_CASE"],
      },
      {
        selector: "parameter",
        format: ["camelCase"],
      },
      {
        selector: "parameterProperty",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "require",
      },
      {
        selector: "parameterProperty",
        modifiers: ["protected"],
        format: ["camelCase"],
        leadingUnderscore: "require",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enum",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["PascalCase"],
      },
    ],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      {
        assertionStyle: "as",
      },
    ],
    "no-unused-vars": "off",
  },
};
