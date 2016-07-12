/**
 * @module lib/embed
 */

import { isVimeoUrl, getVimeoUrl } from './functions';

const oEmbedParameters = [
    'id',
    'url',
    'width',
    'maxwidth',
    'height',
    'maxheight',
    'portrait',
    'title',
    'byline',
    'color',
    'autoplay',
    'autopause',
    'loop',
    'responsive'
];

/**
 * Get the 'data-vimeo'-prefixed attributes from an element as an object.
 *
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {HTMLElement} element The element.
 * @param {Object} [defaults={}] The default values to use.
 * @return {Object<string, string>}
 */
export function getOEmbedParameters(element, defaults = {}) {
    for (const param of oEmbedParameters) {
        const value = element.getAttribute(`data-vimeo-${param}`);

        if (value || value === '') {
            defaults[param] = value === '' ? 1 : value;
        }
    }

    return defaults;
}

/**
 * Make an oEmbed call for the specified URL.
 *
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {string} videoUrl The vimeo.com url for the video.
 * @param {Object} [params] Parameters to pass to oEmbed.
 * @return {Promise}
 */
export function getOEmbedData(videoUrl, params = {}) {
    return new Promise((resolve, reject) => {
        if (!isVimeoUrl(videoUrl)) {
            throw new TypeError(`“${videoUrl}” is not a vimeo.com url.`);
        }

        let url = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`;

        for (const param in params) {
            if (params.hasOwnProperty(param)) {
                url += `&${param}=${encodeURIComponent(params[param])}`;
            }
        }

        const xhr = 'XDomainRequest' in window ? new XDomainRequest() : new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onload = function() {
            if (xhr.status === 404) {
                reject(new Error(`“${videoUrl}” was not found.`));
                return;
            }

            if (xhr.status === 403) {
                reject(new Error(`“${videoUrl}” is not embeddable.`));
                return;
            }

            try {
                const json = JSON.parse(xhr.responseText);
                resolve(json);
            }
            catch (error) {
                reject(error);
            }
        };

        xhr.onerror = function() {
            const status = xhr.status ? ` (${xhr.status})` : '';
            reject(new Error(`There was an error fetching the embed code from Vimeo${status}.`));
        };

        xhr.send();
    });
}

/**
 * Create an embed from oEmbed data inside an element.
 *
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */
export function createEmbed({ html }, element) {
    if (!element) {
        throw new TypeError('An element must be provided');
    }

    if (element.getAttribute('data-vimeo-initialized') !== null) {
        return element.querySelector('iframe');
    }

    const div = document.createElement('div');
    div.innerHTML = html;

    const iframe = div.firstChild;

    element.appendChild(iframe);
    element.setAttribute('data-vimeo-initialized', 'true');

    return iframe;
}

/**
 * Initialize all embeds within a specific element
 *
 * @author Brad Dougherty <brad@vimeo.com>
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */
export function initializeEmbeds(parent = document) {
    const elements = [].slice.call(parent.querySelectorAll('[data-vimeo-id], [data-vimeo-url]'));

    const handleError = (error) => {
        if ('console' in window && console.error) {
            console.error(`There was an error creating an embed: ${error}`);
        }
    };

    for (const element of elements) {
        try {
            // Skip any that have data-vimeo-defer
            if (element.getAttribute('data-vimeo-defer') !== null) {
                continue;
            }

            const params = getOEmbedParameters(element);
            const url = getVimeoUrl(params);

            getOEmbedData(url, params).then((data) => {
                return createEmbed(data, element);
            }).catch(handleError);
        }
        catch (error) {
            handleError(error);
        }
    }
}
