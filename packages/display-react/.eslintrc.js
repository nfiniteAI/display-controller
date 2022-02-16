const { peerDependencies } = require('./package.json')

module.exports = {
  root: true,
  extends: ['../../.eslintrc.js', 'react-app', 'plugin:react/recommended'],
  plugins: ['react'],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  rules: {
    'react/destructuring-assignment': ['error', 'always', { ignoreClassFields: true }],
    'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
    'import/no-unresolved': ['error', { commonjs: true, amd: true, ignore: Object.keys(peerDependencies) }],
    'react/prop-types': ['warn', { skipUndeclared: true }],
    // TODO remove if they fix it https://github.com/yannickcr/eslint-plugin-react/issues/2133
    'react/display-name': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
