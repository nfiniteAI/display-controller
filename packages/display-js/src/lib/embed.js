/**
 * @module lib/embed
 */

import { isHubstairsUrl, getHubstairsUrl, kebabToCamel, HubstairsError } from './functions'
import { logger } from './logger'
import { fetchURL, HTTPError } from './fetch'

const oEmbedParameters = [
  'displayid',
  'url',
  'productcode',
  'responsive',
  'display-url',
  'oembed-url',
  'language',
  'token',
  'no-cache',
]

/**
 * Get the 'data-hubstairs'-prefixed attributes from an element as an object.
 *
 * @param {HTMLElement} element The element.
 * @param {Object} [defaults={}] The default values to use.
 * @return {Object<string, string>}
 */
export function getOEmbedParameters(element, defaults = {}) {
  const params = { ...defaults }
  for (const param of oEmbedParameters) {
    const value = element.getAttribute(`data-hubstairs-${param}`)
    const camelParam = kebabToCamel(param)
    if (value || value === '') {
      params[camelParam] = value === '' ? 1 : value
    }
  }
  return params
}

/**
 * Create an embed from oEmbed data inside an element.
 *
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */
export function createEmbed({ html }, element) {
  if (!element) {
    throw new HubstairsError('An element must be provided', 'TypeError')
  }

  if (element.getAttribute('data-hubstairs-initialized') !== null) {
    return element.querySelector('iframe')
  }

  const div = document.createElement('div')
  div.innerHTML = html

  div.firstChild.style.display = 'none' // show it only when ready
  element.appendChild(div.firstChild)
  element.setAttribute('data-hubstairs-initialized', 'true')

  return element.querySelector('iframe')
}

/**
 * Make an oEmbed call for the specified URL.
 *
 * @param {string} displayUrl The nfinite.app url for the display.
 * @param {Object} [params] Parameters to pass to oEmbed.
 * @return {Promise}
 */
export function getOEmbedData({ url, displayid, displayUrl, oembedUrl, ...params } = {}) {
  try {
    const fullDisplayUrl = getHubstairsUrl({ url, displayid, displayUrl })

    let fullOembedUrl = `${oembedUrl || 'https://my.nfinite.app/api/oembed'}?url=${encodeURIComponent(fullDisplayUrl)}`

    for (const param in params) {
      if (Object.prototype.hasOwnProperty.call(params, param)) {
        fullOembedUrl += `&${param}=${encodeURIComponent(params[param])}`
      }
    }
    if (!params.height && !params.width && !params.responsive) {
      fullOembedUrl += `&responsive=1`
    }

    return fetchURL(fullOembedUrl)
      .then(res => res.data)
      .catch(err => {
        if (err instanceof HTTPError) {
          if (err.response.status === 404) {
            throw new HubstairsError(`“${fullDisplayUrl}” was not found.`)
          } else if (err.response.status === 403) {
            throw new HubstairsError(`“${fullDisplayUrl}” is not embeddable.`)
          }
        }
        throw new HubstairsError(`There was an error fetching the embed code from Hubstairs ${status}.`)
      })
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Initialize all embeds within a specific element
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function initializeEmbeds(parent = document) {
  const elements = [].slice.call(parent.querySelectorAll('[data-hubstairs-displayid], [data-hubstairs-url]'))

  const handleError = error => {
    logger.error(`There was an error creating an embed`, error)
  }

  elements.forEach(element => {
    try {
      // Skip any that have data-hubstairs-defer
      if (element.getAttribute('data-hubstairs-defer') !== null) {
        return
      }

      const params = getOEmbedParameters(element)

      getOEmbedData(params)
        .then(data => {
          return createEmbed(data, element)
        })
        .catch(handleError)
    } catch (error) {
      handleError(error)
    }
  })
}

/**
 * Resize embeds when messaged by the display.
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function resizeEmbeds(parent = document) {
  // Prevent execution if users include the display script multiple times.
  if (window.HubstairsDisplayResizeEmbeds_) {
    return
  }
  window.HubstairsDisplayResizeEmbeds_ = true

  const onMessage = event => {
    if (!isHubstairsUrl(event.origin)) {
      return
    }

    // 'spacechange' is fired only on embeds with cards
    if (!event.data || event.data.event !== 'spacechange') {
      return
    }

    const iframes = parent.querySelectorAll('iframe')

    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow !== event.source) {
        continue
      }

      // Change padding-bottom of the enclosing div to accommodate
      // card carousel without distorting aspect ratio
      const space = iframes[i].parentElement
      space.style.paddingBottom = `${event.data.data[0].bottom}px`

      break
    }
  }

  window.addEventListener('message', onMessage)
}
