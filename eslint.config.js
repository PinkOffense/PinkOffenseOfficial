// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Project conventions (intentionally using short class names)
      "@angular-eslint/component-class-suffix": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      // Security rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      // Best practices
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Template security
      "@angular-eslint/template/no-duplicate-attributes": "error",
      "@angular-eslint/template/no-positive-tabindex": "error",
    },
  }
);
