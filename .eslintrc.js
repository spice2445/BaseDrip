module.exports = {
    env: {
      browser: true,
      es2021: true,
      jest: true
    },
    extends: [
      'airbnb',
      "prettier",
      'plugin:react-hooks/recommended',
      'plugin:react/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:boundaries/recommended',],
    settings: {
      'import/resolver': { typescript: {} },
      'boundaries/elements': [
        { type: 'app', pattern: 'app/*' },
        { type: 'processes', pattern: 'processes/*' },
        { type: 'pages', pattern: 'pages/*' },
        { type: 'widgets', pattern: 'widgets/*' },
        { type: 'features', pattern: 'features/*' },
        { type: 'entities', pattern: 'entities/*' },
        { type: 'shared', pattern: 'shared/*' }
      ],
      'boundaries/ignore': ['**/*.test.*']
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: ['react', '@typescript-eslint', "prettier"],
    rules: {
      'react/jsx-indent': [2, 2],
      'react/jsx-indent-props': [2, 2],
      indent: [2, 2],
      'react/jsx-filename-extension': [
        2,
        { extensions: ['.js', '.jsx', '.tsx'] }
      ],
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'no-unused-vars': 'warn',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'warn',
      'react/function-component-definition': 'off',
      'no-shadow': 'off',
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-underscore-dangle': 'off',
      'color-named': 'off',
      semi: ['warn', 'always'],
      'no-console': 'warn',
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      'prefer-const': 'error',
      'max-len': ['error', { code: 120 }],
      'comma-dangle': ['error', 'never'],
      'i18next/no-literal-string': ['error', { markupOnly: true }],
      'linebreak-style': 0,
      'react/jsx-max-props-per-line': ['error', { maximum: 3 }],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          pathGroups: [
            { group: 'internal', position: 'after', pattern: '~/processes/**' },
            { group: 'internal', position: 'after', pattern: '~/pages/**' },
            { group: 'internal', position: 'after', pattern: '~/widgets/**' },
            { group: 'internal', position: 'after', pattern: '~/features/**' },
            { group: 'internal', position: 'after', pattern: '~/entities/**' },
            { group: 'internal', position: 'after', pattern: '~/shared/**' }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index']
        }
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/app/**'] },
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/processes/*/**'] },
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/pages/*/**'] },
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/widgets/*/**'] },
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/features/*/**'] },
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/entities/*/**'] },
            { message: 'Private imports are prohibited, use public imports instead', group: ['~/shared/*/*/**'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/app'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/processes'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/pages'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/widgets'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/features'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/entities'] },
            { message: 'Prefer absolute imports instead of relatives (for root modules)', group: ['../**/shared'] }
          ]
        }
      ],
      'boundaries/element-types': [
        'warn',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['processes', 'pages', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'processes', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] }
          ]
        }
      ]
    },
    overrides: [
      { files: ['**/*.test.*', '**/*.stories.*'], rules: { 'boundaries/element-types': 'off' } },
      { files: ['**/*.js'], rules: { 'no-restricted-imports': 'off' } },
      { files: ['src/shared/ui/**/*.tsx', '**/*.stories.*'], rules: { 'react/jsx-props-no-spreading': 'off' } },
      { files: ['src/pages/**/*.ts', 'src/pages/*.tsx'], rules: { 'no-return-await': 'off' } },
      { files: ['src/app/providers/**/*.*'], rules: { 'react/display-name': 'off' } },
      { files: ['src/app/types/global.d.ts'], rules: { 'no-unused-vars': 'off' } }
    ],
    globals: {
      __IS_DEV__: true,
      JSX: true
    }
  };