import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const input = './src/index.js'

const name = `${pkg.name} v${pkg.version}`
const copyright = `(c) ${new Date().getFullYear()} Hubstairs`
const url = 'https://www.hubstairs.com'
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
        runtimeHelpers: true,
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
    plugins: [babel({ runtimeHelpers: true, plugins: ['@babel/plugin-transform-runtime'] }), resolve(), filesize()],
  },
]
