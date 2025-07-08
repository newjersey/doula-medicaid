import { FlatCompat } from "@eslint/eslintrc";
import { flatConfigs as importXFlatConfigs } from "eslint-plugin-import-x";
import { dirname } from "path";
import { configs as tseslintConfigs } from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  importXFlatConfigs.recommended,
  importXFlatConfigs.typescript,
  ...tseslintConfigs.recommendedTypeChecked,
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
      "func-style": "error",
      "prefer-template": "error",
      "react-hooks/exhaustive-deps": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-floating-promises": "off",
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
];

export default eslintConfig;
