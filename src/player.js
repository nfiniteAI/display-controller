import './lib/compatibility-check'

import { storeCallback, getCallbacks, removeCallback, swapCallbacks } from './lib/callbacks'
import { getMethodName, isDomElement, isVimeoUrl, getVimeoUrl, isNode } from './lib/functions'
import { getOEmbedParameters, getOEmbedData, createEmbed, initializeEmbeds, resizeEmbeds } from './lib/embed'
import { parseMessageData, postMessage, processData } from './lib/postmessage'
import { log } from './lib/log'

const playerMap = new WeakMap()
const readyMap = new WeakMap()

class Player {
  /**
   * Create a Player.
   *
   * @param {(HTMLIFrameElement|HTMLElement|string|jQuery)} element A reference to the Vimeo
   *        player iframe, and id, or a jQuery object.
   * @param {object} [options] oEmbed parameters to use when creating an embed in the element.
   * @return {Player}
   */
  constructor(element, options = {}) {
    /* global jQuery */
    if (window.jQuery && element instanceof jQuery) {
      if (element.length > 1) {
        log.warn('A jQuery object with multiple elements was passed, using the first element.')
      }

      element = element[0]
    }

    // Find an element by ID
    if (typeof document !== 'undefined' && typeof element === 'string') {
      element = document.getElementById(element)
    }

    // Not an element!
    if (!isDomElement(element)) {
      throw new TypeError('You must pass either a valid element or a valid id.')
    }

    const win = element.ownerDocument.defaultView

    // Already initialized an embed in this div, so grab the iframe
    if (element.nodeName !== 'IFRAME') {
      const iframe = element.querySelector('iframe')

      if (iframe) {
        element = iframe
      }
    }

    // iframe url is not a Vimeo url
    if (element.nodeName === 'IFRAME' && !isVimeoUrl(element.getAttribute('src') || '')) {
      throw new Error('The player element passed isn’t a Vimeo embed.')
    }

    // If there is already a player object in the map, return that
    if (playerMap.has(element)) {
      return playerMap.get(element)
    }

    this.element = element
    this.origin = '*'

    const readyPromise = new Promise((resolve, reject) => {
      const onMessage = event => {
        if (!isVimeoUrl(event.origin) || this.element.contentWindow !== event.source) {
          return
        }

        if (this.origin === '*') {
          this.origin = event.origin
        }

        const data = parseMessageData(event.data)
        const isError = data && data.event === 'error'
        const isReadyError = isError && data.data && data.data.method === 'ready'

        if (isReadyError) {
          const error = new Error(data.data.message)
          error.name = data.data.name
          reject(error)
          return
        }

        const isReadyEvent = data && data.event === 'ready'
        const isPingResponse = data && data.method === 'ping'

        if (isReadyEvent || isPingResponse) {
          this.element.setAttribute('data-ready', 'true')
          resolve()
          return
        }

        processData(this, data)
      }

      if (win.addEventListener) {
        win.addEventListener('message', onMessage, false)
      } else if (win.attachEvent) {
        win.attachEvent('onmessage', onMessage)
      }

      if (this.element.nodeName !== 'IFRAME') {
        const params = getOEmbedParameters(element, options)
        const url = getVimeoUrl(params)

        getOEmbedData(url, params)
          .then(data => {
            const iframe = createEmbed(data, element)
            // Overwrite element with the new iframe,
            // but store reference to the original element
            this.element = iframe
            this._originalElement = element

            swapCallbacks(element, iframe)
            playerMap.set(this.element, this)

            return data
          })
          .catch(reject)
      }
    })

    // Store a copy of this Player in the map
    readyMap.set(this, readyPromise)
    playerMap.set(this.element, this)

    // Send a ping to the iframe so the ready promise will be resolved if
    // the player is already ready.
    if (this.element.nodeName === 'IFRAME') {
      postMessage(this, 'ping')
    }

    return this
  }

  /**
   * Get a promise for a method.
   *
   * @param {string} name The API method to call.
   * @param {Object} [args={}] Arguments to send via postMessage.
   * @return {Promise}
   */
  callMethod(name, args = {}) {
    return new Promise((resolve, reject) => {
      // We are storing the resolve/reject handlers to call later, so we
      // can’t return here.
      return this.ready()
        .then(() => {
          storeCallback(this, name, {
            resolve,
            reject,
          })

          postMessage(this, name, args)
        })
        .catch(reject)
    })
  }

  /**
   * Get a promise for the value of a player property.
   *
   * @param {string} name The property name
   * @return {Promise}
   */
  get(name) {
    return new Promise((resolve, reject) => {
      name = getMethodName(name, 'get')

      // We are storing the resolve/reject handlers to call later, so we
      // can’t return here.
      return this.ready()
        .then(() => {
          storeCallback(this, name, {
            resolve,
            reject,
          })

          postMessage(this, name)
        })
        .catch(reject)
    })
  }

  /**
   * Get a promise for setting the value of a player property.
   *
   * @param {string} name The API method to call.
   * @param {mixed} value The value to set.
   * @return {Promise}
   */
  set(name, value) {
    return new Promise((resolve, reject) => {
      name = getMethodName(name, 'set')

      if (value === undefined || value === null) {
        throw new TypeError('There must be a value to set.')
      }

      // We are storing the resolve/reject handlers to call later, so we
      // can’t return here.
      return this.ready()
        .then(() => {
          storeCallback(this, name, {
            resolve,
            reject,
          })

          postMessage(this, name, value)
        })
        .catch(reject)
    })
  }

  /**
   * Add an event listener for the specified event. Will call the
   * callback with a single parameter, `data`, that contains the data for
   * that event.
   *
   * @param {string} eventName The name of the event.
   * @param {function(*)} callback The function to call when the event fires.
   * @return {void}
   */
  on(eventName, callback) {
    if (!eventName) {
      throw new TypeError('You must pass an event name.')
    }

    if (!callback) {
      throw new TypeError('You must pass a callback function.')
    }

    if (typeof callback !== 'function') {
      throw new TypeError('The callback must be a function.')
    }

    const callbacks = getCallbacks(this, `event:${eventName}`)
    if (callbacks.length === 0) {
      this.callMethod('addEventListener', eventName).catch(() => {
        // Ignore the error. There will be an error event fired that
        // will trigger the error callback if they are listening.
      })
    }

    storeCallback(this, `event:${eventName}`, callback)
  }

  /**
   * Remove an event listener for the specified event. Will remove all
   * listeners for that event if a `callback` isn’t passed, or only that
   * specific callback if it is passed.
   *
   * @param {string} eventName The name of the event.
   * @param {function} [callback] The specific callback to remove.
   * @return {void}
   */
  off(eventName, callback) {
    if (!eventName) {
      throw new TypeError('You must pass an event name.')
    }

    if (callback && typeof callback !== 'function') {
      throw new TypeError('The callback must be a function.')
    }

    const lastCallback = removeCallback(this, `event:${eventName}`, callback)

    // If there are no callbacks left, remove the listener
    if (lastCallback) {
      this.callMethod('removeEventListener', eventName).catch(() => {
        // Ignore the error. There will be an error event fired that
        // will trigger the error callback if they are listening.
      })
    }
  }

  /**
   * A promise to perform an action when the Player is ready.
   *
   * @todo document errors
   * @promise LoadVideoPromise
   * @fulfill {void}
   */
  /**
   * Trigger a function when the player iframe has initialized. You do not
   * need to wait for `ready` to trigger to begin adding event listeners
   * or calling other methods.
   *
   * @return {ReadyPromise}
   */
  ready() {
    const readyPromise =
      readyMap.get(this) ||
      new Promise((resolve, reject) => {
        reject(new Error('Unknown player. Probably unloaded.'))
      })
    return Promise.resolve(readyPromise)
  }

  /**
   * Cleanup the player and remove it from the DOM
   *
   * It won't be usable and a new one should be constructed
   *  in order to do any operations.
   *
   * @return {Promise}
   */
  destroy() {
    return new Promise(resolve => {
      readyMap.delete(this)
      playerMap.delete(this.element)
      if (this._originalElement) {
        playerMap.delete(this._originalElement)
        this._originalElement.removeAttribute('data-vimeo-initialized')
      }
      if (this.element && this.element.nodeName === 'IFRAME' && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
      resolve()
    })
  }

  /**
   * A representation of a cue point.
   *
   * @typedef {Object} HubstairsProduct
   * @property {productCode} string Identifier for the product.
   */
  /**
   * A promise to get the products displayed.
   *
   * @promise GetProductssPromise
   * @fulfill {HubstairsProduct[]} The products displayed.
   * @reject {Error} Cannot get the list of products
   */
  /**
   * Get an array of the cue points added to the video.
   *
   * @return {getProductPromise}
   */
  getProducts() {
    return this.get('products')
  }

  /**
   * A promise to display the next scene
   *
   * @promise NextScenePromise
   * @fulfill {void} The next scene is displayed.
   * @reject {nextSceneError} No next scene available
   */
  /**
   * Display the nextScene if it's available
   *
   * @return {NextScenePromise}
   */
  nextScene() {
    return this.callMethod('nextScene')
  }

  /**
   * A promise to set dynamically the configuration.
   *
   * @promise SetConfigPromise
   * @fulfill {void} The configuration is set.
   * @reject {configError} Error while setting configuration
   */
  /**
   * Update the configuration
   *
   * @param {Config} config
   * @return {SetConfigPromise}
   */
  setConfig(config) {
    return this.set('config', config)
  }
}

// Setup embed only if this is not a node environment
if (!isNode) {
  initializeEmbeds()
  resizeEmbeds()
}

export default Player
