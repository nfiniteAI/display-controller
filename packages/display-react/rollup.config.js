import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const input = './src/index.js'

const name = `${pkg.name} v${pkg.version}`
const copyright = `(c) ${new Date().getFullYear()} Nfinite`
const url = 'https://nfinite.app'
const banner = `/*! ${name} | ${copyright} | ${pkg.license} License | ${url} */`

const globalName = 'Hubstairs.DisplayReact'

export default [
  {
    input,
    output: {
      file: pkg.module,
      sourcemap: true,
      format: 'es',
      banner,
    },
    external: ['react', 'react-proptypes'],
    plugins: [
      babel({
        babelHelpers: 'runtime',
        presets: [['@babel/preset-env', { targets: { esmodules: true } }]],
      }),
      resolve(),
      filesize(),
    ],
  },
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      banner,
    },
    external: ['react', 'react-proptypes'],
    plugins: [babel({ babelHelpers: 'runtime', plugins: ['@babel/plugin-transform-runtime'] }), resolve(), filesize()],
  },
]
