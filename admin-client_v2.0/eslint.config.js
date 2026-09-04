import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 
      import: importPlugin,
      "react-refresh": reactRefresh,
      "react-hooks": reactHooks,
    },
    settings: {
      "import/resolver": { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      // порядок импортов: сначала внешнее, затем слои сверху вниз, затем локальное
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            { pattern: "@/app/**", group: "internal", position: "before" },
            { pattern: "@/pages/**", group: "internal", position: "before" },
            { pattern: "@/widgets/**", group: "internal", position: "before" },
            { pattern: "@/features/**", group: "internal", position: "before" },
            { pattern: "@/entities/**", group: "internal", position: "before" },
            { pattern: "@/shared/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["src/entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/app/*", "@/pages/*", "@/widgets/*", "@/features/*", "@/entities/*"],
          message: "Слой entities может импортировать только из shared",
        }],
      }],
    },
  },
  {
    files: ["src/widgets/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/app/*", "@/pages/*", "@/widgets/*"],
          message: "Слой widgets может импортировать только из features, entities, shared",
        }],
      }],
    },
  },
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/app/*", "@/pages/*"],
          message: "Слой pages не может импортировать из слоя app, а также запрещены кросс-импорты между разными страницами напрямую",
        }],
      }],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/app/*/*"],
          message: "Слой app может импортировать из всех слоев, но импорты внутри самого app должны идти строго через Public API папок/слайсов",
        }],
      }],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/app/*", "@/pages/*", "@/widgets/*", "@/features/*"],
          message: "Слой features может импортировать только из entities и shared",
        }],
      }],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/app/*", "@/pages/*", "@/widgets/*", "@/features/*", "@/entities/*"],
          message: "Слой shared не знает о предметной области",
        }],
      }],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/entities/*/*", "@/features/*/*", "@/widgets/*/*", "@/pages/*/*"],
          message: "Импортируй через входную точку слайса, а не напрямую из его файлов",
        }],
      }],
    }
  }
);
