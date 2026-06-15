import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier/recommended'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts', '.github/**'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
  },
]
