/**
 * @module lib/postmessage
 */

import { getCallbacks, removeCallback, shiftCallbacks } from './callbacks'
import { log } from './log'

/**
 * Parse a message received from postMessage.
 *
 * @param {*} data The data received from postMessage.
 * @return {object}
 */
export function parseMessageData(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {
      // If the message cannot be parsed, throw the error as a warning
      log.warn(error)
      return {}
    }
  }

  return data
}

/**
 * Post a message to the specified target.
 *
 * @param {Display} display The display object to use.
 * @param {string} method The API method to call.
 * @param {object} params The parameters to send to the display.
 * @return {void}
 */
export function postMessage(display, method, params) {
  if (!display.element.contentWindow || !display.element.contentWindow.postMessage) {
    return
  }

  let message = {
    method,
  }

  if (params !== undefined) {
    message.value = params
  }

  // IE 8 and 9 do not support passing messages, so stringify them
  const ieVersion = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, '$1'))
  if (ieVersion >= 8 && ieVersion < 10) {
    message = JSON.stringify(message)
  }

  display.element.contentWindow.postMessage(message, display.origin)
}

/**
 * Parse the data received from a message event.
 *
 * @param {Display} display The display that received the message.
 * @param {(Object|string)} data The message data. Strings will be parsed into JSON.
 * @return {void}
 */
export function processData(display, data) {
  data = parseMessageData(data)
  let callbacks = []
  let param

  if (data.event) {
    if (data.event === 'error') {
      const promises = getCallbacks(display, data.data.method)

      promises.forEach(promise => {
        const error = new Error(data.data.message)
        error.name = data.data.name

        promise.reject(error)
        removeCallback(display, data.data.method, promise)
      })
    }

    callbacks = getCallbacks(display, `event:${data.event}`)
    param = data.data
  } else if (data.method) {
    const callback = shiftCallbacks(display, data.method)

    if (callback) {
      callbacks.push(callback)
      param = data.value
    }
  }

  callbacks.forEach(callback => {
    try {
      if (typeof callback === 'function') {
        callback.call(display, param)
        return
      }

      callback.resolve(param)
    } catch (e) {
      // empty
    }
  })
}
