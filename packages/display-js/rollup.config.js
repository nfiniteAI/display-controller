import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json';

import { terser } from 'rollup-plugin-terser'

import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const globalName = 'Hubstairs.Controller'
const input = './src/index.js'

const name = `${pkg.name} v${pkg.version}`
const copyright = `(c) ${new Date().getFullYear()} Hubstairs`
const url = 'https://www.hubstairs.com'
const banner = `/*! ${name} | ${copyright} | ${pkg.license} License | ${url} */`

export default [
  {
    input,
    output: {
      file: pkg.module,
      sourcemap: true,
      format: 'es',
      banner,
    },
    plugins: [
      json(),
      babel({
        babelHelpers: 'bundled',
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
      format: 'umd',
      name: globalName,
      sourcemap: true,
      banner,
    },
    plugins: [
      json(),
      babel({ babelHelpers: 'bundled' }),
      resolve(),
      filesize({ showGzippedSize: false, showMinifiedSize: false }),
    ],
  },
  {
    input,
    output: {
      file: pkg.main.replace('.js', '.min.js'),
      format: 'umd',
      name: globalName,
      sourcemap: true,
      banner,
    },
    plugins: [
      json(),
      babel({ babelHelpers: 'bundled' }),
      resolve(),
      terser(),
      filesize({ showBrotliSize: true, showMinifiedSize: false }),
    ],
  },
]
