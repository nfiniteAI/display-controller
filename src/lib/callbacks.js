/**
 * @module lib/callbacks
 */

export const callbackMap = new WeakMap()

/**
 * Store a callback for a method or event for a display.
 *
 * @param {Display} display The display object.
 * @param {string} name The method or event name.
 * @param {(function(this:Display, *): void|{resolve: function, reject: function})} callback
 *        The callback to call or an object with resolve and reject functions for a promise.
 * @return {void}
 */
export function storeCallback(display, name, callback) {
  const displayCallbacks = callbackMap.get(display.element) || {}

  if (!(name in displayCallbacks)) {
    displayCallbacks[name] = []
  }

  displayCallbacks[name].push(callback)
  callbackMap.set(display.element, displayCallbacks)
}

/**
 * Get the callbacks for a display and event or method.
 *
 * @param {Display} display The display object.
 * @param {string} name The method or event name
 * @return {function[]}
 */
export function getCallbacks(display, name) {
  const displayCallbacks = callbackMap.get(display.element) || {}
  return displayCallbacks[name] || []
}

/**
 * Remove a stored callback for a method or event for a display.
 *
 * @param {Display} display The display object.
 * @param {string} name The method or event name
 * @param {function} [callback] The specific callback to remove.
 * @return {boolean} Was this the last callback?
 */
export function removeCallback(display, name, callback) {
  const displayCallbacks = callbackMap.get(display.element) || {}

  if (!displayCallbacks[name]) {
    return true
  }

  // If no callback is passed, remove all callbacks for the event
  if (!callback) {
    displayCallbacks[name] = []
    callbackMap.set(display.element, displayCallbacks)

    return true
  }

  const index = displayCallbacks[name].indexOf(callback)

  if (index !== -1) {
    displayCallbacks[name].splice(index, 1)
  }

  callbackMap.set(display.element, displayCallbacks)
  return displayCallbacks[name] && displayCallbacks[name].length === 0
}

/**
 * Return the first stored callback for a display and event or method.
 *
 * @param {Display} display The display object.
 * @param {string} name The method or event name.
 * @return {function} The callback, or false if there were none
 */
export function shiftCallbacks(display, name) {
  const displayCallbacks = getCallbacks(display, name)

  if (displayCallbacks.length < 1) {
    return false
  }

  const callback = displayCallbacks.shift()
  removeCallback(display, name, callback)
  return callback
}

/**
 * Move callbacks associated with an element to another element.
 *
 * @param {HTMLElement} oldElement The old element.
 * @param {HTMLElement} newElement The new element.
 * @return {void}
 */
export function swapCallbacks(oldElement, newElement) {
  const displayCallbacks = callbackMap.get(oldElement)

  callbackMap.set(newElement, displayCallbacks)
  callbackMap.delete(oldElement)
}
