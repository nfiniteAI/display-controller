/*global html*/

import jestMock from 'jest-fetch-mock'
import { getOEmbedParameters, getOEmbedData, createEmbed, initializeEmbeds, resizeEmbeds } from './embed'
import { HubstairsError } from './functions'

jestMock.enableMocks()

const headers = {
  accept: 'application/json',
}

const mockOEmbedResponse = {
  version: '1.0',
  type: 'rich',
  width: 200,
  height: 160,
  maxheight: 1000,
  title: 'My title',
  maxwidth: 1250,
  url: 'https://display.hubstairs.com/my-video',
  html: `<iframe
width="200px"
height="160px"
src="https://display.hubstairs.com/my-video"
frameborder="0"
allow="autoplay; fullscreen; vr"
allowvr
allowfullscreen
mozallowfullscreen="true"
webkitallowfullscreen="true"
>
</iframe>`,
  provider_name: 'Hubstairs',
  provider_url: 'http://www.hubstairs.com/',
}

const mockOEmbedResponseResponsive = {
  version: '1.0',
  type: 'rich',
  maxwidth: 1250,
  maxheight: 1000,
  width: 1250,
  height: 1000,
  title: 'My title',
  url: 'https://display.hubstairs.com/v1/my-video',
  html: `<div style="padding:125% 0 0 0;position:relative;">
<iframe
style="position:absolute;top:0;left:0;width:100%;height:100%;"
src="https://display.hubstairs.com/v1/my-video"
frameborder="0"
allow="autoplay; fullscreen; vr"
allowvr
allowfullscreen
mozallowfullscreen="true"
webkitallowfullscreen="true"
>
</iframe>
</div>`,
  provider_name: 'Hubstairs',
  provider_url: 'http://www.hubstairs.com/',
}

beforeEach(() => {
  fetch.resetMocks()
})

describe('getOEmbedParameters', () => {
  test('retrieves the params from data attributes', () => {
    const el = html` <div data-hubstairs-displayid="5e417dbac5d2651adbe509ec" data-hubstairs-productcode="1234"></div> `
    expect(getOEmbedParameters(el)).toEqual({
      displayid: '5e417dbac5d2651adbe509ec',
      productcode: '1234',
    })
  })

  test('converts to camel case all the kebab case attributes', () => {
    const el = html` <div data-hubstairs-displayid="5e417dbac5d2651adbe509ec" data-hubstairs-display-url="gui"></div> `
    expect(getOEmbedParameters(el)).toEqual({
      displayid: '5e417dbac5d2651adbe509ec',
      displayUrl: 'gui',
    })
  })

  test('builds off of a defaults object', () => {
    const el = html` <div data-hubstairs-displayid="5e417dbac5d2651adbe509ec" data-hubstairs-productcode="1234"></div> `
    expect(getOEmbedParameters(el, { loop: true })).toEqual({
      displayid: '5e417dbac5d2651adbe509ec',
      productcode: '1234',
      loop: true,
    })
  })
})

describe('getOEmbedData', () => {
  test('doesn’t operate on non-Hubstairs urls', async () => {
    await expect(getOEmbedData({ url: 'https://nothubstairs.com' })).rejects.toThrowError(HubstairsError)
  })

  test('returns a json oembed response', async () => {
    expect.assertions(2)
    fetch.mockResponse(JSON.stringify(mockOEmbedResponse), { status: 200 })
    const result = await getOEmbedData({ url: 'https://display.hubstairs.com/v1/1234' })
    expect(typeof result).toBe('object')
    expect(result.type).toBe('rich')
  })
})

describe('createEmbed', () => {
  test('throws if there’s no element', () => {
    expect(() => {
      createEmbed({ html: 'html' })
    }).toThrowError(HubstairsError)
  })

  test('returns the already-initialized iframe', () => {
    const container = html` <div data-hubstairs-initialized></div> `
    const iframe = html` <iframe src="https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec"></iframe> `
    container.appendChild(iframe)
    expect(createEmbed({ html: 'html' }, container)).toEqual(iframe)
  })

  test('creates an iframe from the oembed data', () => {
    const container = html` <div></div> `
    const markup = '<iframe src="https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec"></iframe>'

    const embed = createEmbed({ html: markup }, container)
    expect(container.getAttribute('data-hubstairs-initialized')).toBe('true')
    expect(embed.outerHTML).toEqual(
      html` <iframe src="https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec" style="display: none;"></iframe> `
        .outerHTML,
    )
  })

  test('returns the iframe from a responsive embed', () => {
    const container = html` <div></div> `
    const markup =
      '<div style="position:relative;padding-bottom:42.5%;height:0"><iframe src="https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0"></iframe></div>'

    const embed = createEmbed({ html: markup }, container)
    expect(container.getAttribute('data-hubstairs-initialized')).toBe('true')
    expect(embed.outerHTML).toEqual(
      html`
        <iframe
          src="https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec"
          style="position:absolute;top:0;left:0;width:100%;height:100%"
          frameborder="0"
        ></iframe>
      `.outerHTML,
    )
  })
})

describe('initializeEmbeds', () => {
  test('creates embeds', async () => {
    fetch.mockResponse(JSON.stringify(mockOEmbedResponse), { status: 200, headers })

    const div = html`
      <div data-hubstairs-displayid="5e417dbac5d2651adbe509ec" data-hubstairs-responsive="false" id="display"></div>
    `
    document.body.appendChild(div)

    await new Promise(resolve => {
      initializeEmbeds()
      // wait 500ms for the embeds to initialize.
      setTimeout(resolve, 500)
    })

    expect(document.body.querySelector('#display').firstChild.nodeName).toBe('IFRAME')
  })

  test('creates responsive embeds', async () => {
    fetch.mockResponse(JSON.stringify(mockOEmbedResponseResponsive), { status: 200, headers })
    const div = html` <div data-hubstairs-displayid="5e417dbac5d2651adbe509ec" id="display2"></div> `
    document.body.appendChild(div)

    await new Promise(resolve => {
      initializeEmbeds()
      // wait 500ms for the embeds to initialize.
      setTimeout(resolve, 500)
    })

    expect(document.body.querySelector('#display2').firstChild.nodeName).toBe('DIV')
    expect(document.body.querySelector('#display2').firstChild.firstElementChild.nodeName).toBe('IFRAME')
  })

  test('is a function and sets a window property', () => {
    expect.assertions(2)
    expect(typeof resizeEmbeds).toBe('function')

    resizeEmbeds()
    expect(window.HubstairsDisplayResizeEmbeds_).toBe(true)
  })
})
