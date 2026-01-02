import js from "@eslint/js";
import { importX } from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "**/lib/*", "**/bin/*"]),
  {
    files: ["**/*.{js,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "func-style": "error",
      "prefer-template": "error",
      "no-restricted-imports": ["error", { patterns: ["..*"] }],
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/incompatible-library": "off", // https://github.com/react-hook-form/react-hook-form/issues/11910
      /**
       * The `react-hooks/refs` rule seems to have a number of false positives that are more
       * confusing than useful.
       *
       * 1. We get a false positive when passing a ref as props to manipulate the DOM, as in this docs
       *    example:
       *    https://react.dev/learn/manipulating-the-dom-with-refs#example-focusing-a-text-input.
       *    This false positive can be worked around with syntax:
       *    https://github.com/facebook/react/issues/34775#issuecomment-351297622
       * 2. We also get a false positive from doing things like `const onSubmitHandler =
       *    props.handleSubmit(onSubmit, onError);`, where onError contains
       *    `errorSummaryRef.current?.focus();`. React compiler complains that we're read the ref,
       *    and that refs should also be used in event handlers. But that's exactly what we're
       *    doing: We're passing onError to be wrapped around to return an event handler. But the
       *    rule does not recognize this.
       */
      "react-hooks/refs": "off",
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        { allowNullableString: true, allowNumber: false },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },
  {
    plugins: {
      "import-x": importX,
    },
    extends: ["import-x/flat/recommended", "import-x/flat/typescript"],
    rules: { "import-x/no-named-as-default-member": "off" },
  },
]);
