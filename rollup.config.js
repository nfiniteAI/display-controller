import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
// import { uglify } from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const globalName = 'Hubstairs.Controller'
const input = './src/player.js'

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: 'umd',
      name: globalName,
      sourcemap: true,
    },
    plugins: [babel(), resolve(), filesize()],
  },
  {
    input,
    output: {
      file: pkg.module,
      sourcemap: true,
      format: 'esm',
    },
    plugins: [
      babel({
        presets: [['@babel/preset-env', { targets: { esmodules: true } }]],
      }),
      resolve(),
      filesize(),
    ],
  },
  // {
  //   input,
  //   output: {
  //     file: 'build/player.min.js',
  //     format: 'umd',
  //     name: globalName,
  //     sourcemap: true,
  //   },
  //   plugins: [babel(), resolve(), uglify(), filesize()],
  // },
]
