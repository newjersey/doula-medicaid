import { FlatCompat } from "@eslint/eslintrc";
import { flatConfigs as importXFlatConfigs } from "eslint-plugin-import-x";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript", // seems to already contain typescript-eslint
  ),
  importXFlatConfigs.recommended,
  importXFlatConfigs.typescript,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "prefer-template": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        { allowNullableBoolean: true, allowNullableString: true, allowNumber: false },
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
];

export default eslintConfig;
