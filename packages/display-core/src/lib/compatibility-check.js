import { isNode } from './functions'

const arrayIndexOfSupport = typeof Array.prototype.indexOf !== 'undefined'
const postMessageSupport = typeof window !== 'undefined' && typeof window.postMessage !== 'undefined'
const promiseSupport = typeof window !== 'undefined' && typeof window.Promise !== 'undefined'
const fetchSupport = typeof window !== 'undefined' && typeof window.fetch !== 'undefined'
const weakMapSupport = typeof window !== 'undefined' && typeof window.WeakMap !== 'undefined'

if (!isNode && (!arrayIndexOfSupport || !postMessageSupport || !promiseSupport || !fetchSupport || !weakMapSupport)) {
  throw new Error('Sorry, the Hubstairs Display API is not available in this browser.')
}
