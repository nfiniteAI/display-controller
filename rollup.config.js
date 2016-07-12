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
    dest: 'dist/player.min.js',
    format: 'umd',
    moduleName: 'Vimeo.Player',
    plugins: [
        babel(),
        commonjs(),
        nodeResolve({
            jsnext: true
        }),
        uglify({
            output: {
                preamble: banner
            },
            mangle: {
                except: ['Player']
            }
        })
    ]
};
