import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    plugins: {
      prettier,
      "@typescript-eslint": typescriptEslint,
      "react-hooks": reactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript version
        sourceType: "module",
      },
    },

    rules: {
      // TypeScript recommended rules
      ...typescriptEslint.configs.recommended.rules,

      // React Hooks recommended rules
      ...reactHooks.configs.recommended.rules,

      // Custom rules
      "prettier/prettier": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "inline-type-imports",
        },
      ],
    },

    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
];
