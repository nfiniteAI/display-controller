/* eslint-disable no-console */

const prefix = '[Hubstairs controller]'

export const log = {
  error: (...args) => console.error(prefix, ...args),
  warn: (...args) => console.warn(prefix, ...args),
  info: (...args) => console.info(prefix, ...args),
  log: (...args) => console.log(prefix, ...args),
}
