/*global html*/

import jestMock from 'jest-fetch-mock'
import { getOEmbedData, createEmbed } from './embed'
import { HubstairsError } from './functions'

jestMock.enableMocks()

const mockOEmbedResponse = {
  version: '1.0',
  type: 'rich',
  width: 200,
  height: 160,
  maxheight: 1000,
  title: 'My title',
  maxwidth: 1250,
  url: 'https://display.nfinite.app/my-video',
  html: `<iframe
width="200px"
height="160px"
src="https://display.nfinite.app/my-video"
frameborder="0"
allow="autoplay; fullscreen; vr"
allowvr
allowfullscreen
mozallowfullscreen="true"
webkitallowfullscreen="true"
>
</iframe>`,
  provider_name: 'Hubstairs',
  provider_url: 'http://www.nfinite.app/',
}

beforeEach(() => {
  fetch.resetMocks()
})

describe('getOEmbedData', () => {
  test('doesn’t operate on non-Hubstairs urls', async () => {
    await expect(getOEmbedData({ url: 'https://notnfinite.com' })).rejects.toThrowError(HubstairsError)
  })

  test('returns a json oembed response', async () => {
    expect.assertions(2)
    fetch.mockResponse(JSON.stringify(mockOEmbedResponse), { status: 200 })
    const result = await getOEmbedData({ url: 'https://display.nfinite.app/v1/1234' })
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
    const container = html`<div data-hubstairs-initialized></div> `
    const iframe = html`<iframe src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ec"></iframe> `
    container.appendChild(iframe)
    expect(createEmbed({ html: 'html' }, container)).toEqual(iframe)
  })

  test('creates an iframe from the oembed data', () => {
    const container = html`<div></div> `
    const markup = '<iframe src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ec"></iframe>'

    const embed = createEmbed({ html: markup }, container)
    expect(container.getAttribute('data-hubstairs-initialized')).toBe('true')
    expect(embed.outerHTML).toEqual(
      html`<iframe src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ec" style="display: none;"></iframe> `
        .outerHTML,
    )
  })

  test('returns the iframe from a responsive embed', () => {
    const container = html`<div></div> `
    const markup =
      '<div style="position:relative;padding-bottom:42.5%;height:0"><iframe src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ec" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0"></iframe></div>'

    const embed = createEmbed({ html: markup }, container)
    expect(container.getAttribute('data-hubstairs-initialized')).toBe('true')
    expect(embed.outerHTML).toEqual(
      html`
        <iframe
          src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ec"
          style="position:absolute;top:0;left:0;width:100%;height:100%"
          frameborder="0"
        ></iframe>
      `.outerHTML,
    )
  })
})
