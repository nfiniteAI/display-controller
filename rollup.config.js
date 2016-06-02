/* eslint-env node */
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const pkg = require('./package.json');

const name = `${pkg.name} v${pkg.version}`;
const copyright = `(c) ${new Date().getFullYear()} Vimeo`;
const url = `https://github.com/${pkg.repository}`;
const banner = `/*! ${name} | ${copyright} | ${pkg.license} License | ${url} */`;

export default {
    entry: 'src/player.js',
    format: 'umd',
    moduleName: 'Vimeo.Player',
    sourceMap: true,
    plugins: [
        nodeResolve(),
        commonjs(),
        babel(),
        uglify({
            output: {
                preamble: banner
            }
        })
    ]
};
