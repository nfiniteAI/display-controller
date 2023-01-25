/**
 * @module lib/embed
 */

import { getHubstairsUrl, HubstairsError } from './functions'
import { fetchURL, HTTPError } from './fetch'

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
        throw new HubstairsError(`There was an error fetching the embed code from Hubstairs ${status}.`)
      })
  } catch (e) {
    return Promise.reject(e)
  }
}
