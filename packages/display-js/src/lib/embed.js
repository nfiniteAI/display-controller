/**
 * @module lib/embed
 */

import { getHubstairsUrl, HubstairsError } from './functions'
import { fetchURL, HTTPError } from './fetch'

/**
 * Create an embed of the iframe from oEmbed data inside an element.
 *
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */
export function createEmbedIframe({ html }, element) {
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

function generateSelectorFromElement(webComponentElement) {
  // it's a little ugly but we are trying to generate a selector from the element
  // the best way to do that seems to generate a selector from the data attributes
  return `${webComponentElement.tagName}${webComponentElement
    .getAttributeNames()
    .map(name => `[${name}="${webComponentElement.getAttribute(name)}"]`)
    .join('')}`
}

/**
 * Create an embed of the js script from oEmbed data inside an element.
 *
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */
export function createEmbedJS({ displayType, html }, element) {
  if (!element) {
    throw new HubstairsError('An element must be provided', 'TypeError')
  }

  const webComponentSelector = displayType === 'MODEL_AR' ? 'dynamic-display-model-island' : 'dynamic-display-island'

  if (element.getAttribute('data-hubstairs-initialized') !== null) {
    return element.querySelector(webComponentSelector)
  }

  const div = document.createElement('div')
  div.innerHTML = html

  // We want to execute the loaded script so we have to replace the script tags by a new created one
  Array.from(div.querySelectorAll('script')).forEach(oldScriptEl => {
    // We remove from the integration the script
    oldScriptEl.remove()

    // We check if the script is already loaded
    const existingScript = document.querySelector(`script[data-hubstairs-script]`)

    if (existingScript) {
      return
    }

    // We recreate the script to inject it in the head
    const newScriptEl = document.createElement('script')
    Array.from(oldScriptEl.attributes).forEach(attr => {
      newScriptEl.setAttribute(attr.name, attr.value)
    })

    newScriptEl.setAttribute('data-hubstairs-script', '')

    const scriptText = document.createTextNode(oldScriptEl.innerHTML)
    newScriptEl.appendChild(scriptText)
    document.querySelector('head').append(newScriptEl)
  })

  div.firstChild.style.display = 'none' // show it only when ready
  element.appendChild(div.firstChild)
  element.setAttribute('data-hubstairs-initialized', 'true')

  const webComponentElement = element.querySelector(webComponentSelector)

  if (window.__NfiniteDisplay && typeof window.__NfiniteDisplay.render === 'function') {
    window.__NfiniteDisplay.render({
      selector: generateSelectorFromElement(webComponentElement),
    })
  }

  return webComponentElement
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

    let fullOembedUrl = `${oembedUrl || 'https://display.nfinite.app/api/oembed'}?url=${encodeURIComponent(
      fullDisplayUrl,
    )}`

    for (const param in params) {
      if (Object.prototype.hasOwnProperty.call(params, param)) {
        const value = params[param]
        fullOembedUrl += `&${param}=${encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)}`
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
        throw new HubstairsError(`There was an error fetching the embed code from Hubstairs ${err.response.status}.`)
      })
  } catch (e) {
    return Promise.reject(e)
  }
}
