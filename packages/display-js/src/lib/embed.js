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

function isDisplayLoaded() {
  return window.__NfiniteDisplay && typeof window.__NfiniteDisplay.render === 'function'
}

function renderWebComponent({ initialProps, element, customElementName }) {
  const webComponentElement = element.querySelector(customElementName)

  window.__NfiniteDisplay.render({
    selector: generateSelectorFromElement(webComponentElement),
    initialProps,
  })
}

/**
 * Create an embed of the js script from oEmbed data inside an element.
 *
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */
export function createEmbedJS({ customElementName, html: initialHtml }, element, initialProps) {
  const html = initialHtml
    .replace(
      'https://display-test.nfinite.app/dynamic-display-model.island.umd.js',
      'http://localhost:5173/integration/dynamic-display-model.island.umd.js',
    )
    .replace(
      'https://display-test.nfinite.app/dynamic-display.island.umd.js',
      'http://localhost:5173/integration/dynamic-display.island.umd.js',
    )

  if (!element) {
    throw new HubstairsError('An element must be provided', 'TypeError')
  }

  if (element.getAttribute('data-hubstairs-initialized') !== null) {
    return element.querySelector(customElementName)
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
      if (!isDisplayLoaded()) {
        existingScript.addEventListener('load', () => {
          renderWebComponent({ initialProps, element, customElementName })
        })
      }
      return
    }

    // We recreate the script to inject it in the head
    const newScriptEl = document.createElement('script')

    // Render when the script is loaded
    newScriptEl.addEventListener('load', () => {
      renderWebComponent({ initialProps, element, customElementName })
    })

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

  if (isDisplayLoaded()) {
    renderWebComponent({ initialProps, element, customElementName })
  }

  const webComponentElement = element.querySelector(customElementName)
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
        throw new HubstairsError(`There was an error fetching the embed code from Hubstairs ${err.response.status}.`)
      })
  } catch (e) {
    return Promise.reject(e)
  }
}
