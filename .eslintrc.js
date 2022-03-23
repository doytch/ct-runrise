module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:import/typescript',
    'prettier', // Disables stuff that Prettier already handles
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: ['react', '@typescript-eslint'],
  rules: {
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'no-console': 0,
    'no-unused-vars': [2, { argsIgnorePattern: '^_' }],
    'prefer-destructuring': 0,
    'react/function-component-definition': 0,
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.tsx'] }],
    'react/jsx-sort-props': 2,
    'react/no-unused-prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
  },
  settings: {
    // The typescript stuff does a variety of things but mostly we have it so that
    // the import/no-unresolved doesn't complain when we import from paths like `~/path/in/app`
    // that are supported via tsconfig.json's compilerOptions.paths setting.
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
  },
};
