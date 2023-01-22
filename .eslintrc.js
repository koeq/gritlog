// TODO: this was copied from another repository and needs to be cleaned up
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "security"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:security/recommended",
    "plugin:react-hooks/recommended",

    // Enables the config from eslint-config-prettier, which turns off some
    // ESLint rules that conflict with Prettier.
    "prettier",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>/@types` directory even it doesn't contain any source code
      },
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    complexity: "error",
    "no-bitwise": "error",
    "import/default": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-named-as-default-member": "error",
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        "newlines-between": "never",
        warnOnUnassignedImports: true,
        groups: [["builtin", "external"]],
        pathGroupsExcludedImportTypes: ["type"],
      },
    ],
    // 'import/order' does not care about the order of the imported members in
    // an import statement. For that we need 'sort-imports':
    "sort-imports": [
      "error",
      { ignoreDeclarationSort: true, ignoreMemberSort: false },
    ],
    "react/display-name": "error",
    "react/no-danger": "error",
    "react/no-find-dom-node": "error",
    "react/react-in-jsx-scope": "off",
    // disable temporarily. We did not have this before and I don't think it should prevent our migration to eslint.give me a few recommendations for workout tracking apps consisting of only one word 
    "security/detect-object-injection": "off",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-inferrable-types": [
      "error",
      { ignoreParameters: true, ignoreProperties: false },
    ],
    "@typescript-eslint/ban-types": [
      "error",
      { types: { "{}": false, object: false }, extendDefaults: true },
    ],
  },
  reportUnusedDisableDirectives: true,
};
