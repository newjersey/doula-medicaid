import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const a = "test";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    rules: {
      "func-style": "error",
      "prefer-template": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/incompatible-library": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-floating-promises": "off",
      // "@typescript-eslint/prefer-nullish-coalescing": "error",
      // "@typescript-eslint/strict-boolean-expressions": [
      //   "error",
      //   { allowNullableString: true, allowNumber: false },
      // ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "no-restricted-imports": ["error", { patterns: ["..*"] }],
    },
  },
  {
    // plugins: {
    //   // @ts-expect-error https://github.com/typescript-eslint/typescript-eslint/issues/11543
    //   "import-x": importX, // https://github.com/un-ts/eslint-plugin-import-x/issues/421
    // },
    // extends: ["import-x/flat/recommended", "import-x/flat/typescript"],
  },
  {
    // files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    // rules: {
    //   "func-style": "error",
    //   "prefer-template": "error",
    //   "react-hooks/exhaustive-deps": "error",
    //   "@typescript-eslint/no-unused-vars": [
    //     "error",
    //     {
    //       argsIgnorePattern: "^_",
    //       varsIgnorePattern: "^_",
    //     },
    //   ],
    //   "react-refresh/only-export-components": "off",
    //   "@typescript-eslint/no-floating-promises": "off",
    //   // "@typescript-eslint/prefer-nullish-coalescing": "error",
    //   // "@typescript-eslint/strict-boolean-expressions": [
    //   //   "error",
    //   //   { allowNullableString: true, allowNumber: false },
    //   // ],
    //   "@typescript-eslint/consistent-type-imports": [
    //     "error",
    //     {
    //       disallowTypeAnnotations: true,
    //       prefer: "type-imports",
    //       fixStyle: "separate-type-imports",
    //     },
    //   ],
    //   "no-restricted-imports": ["error", { patterns: ["..*"] }],
    // },
  },
]);

const b = "test";
