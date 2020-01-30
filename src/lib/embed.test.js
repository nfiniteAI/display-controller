/*global html*/

import { getOEmbedParameters, getOEmbedData, createEmbed, initializeEmbeds, resizeEmbeds } from './embed'

test('getOEmbedParameters retrieves the params from data attributes', () => {
  const el = html`
    <div data-vimeo-id="2" data-vimeo-width="640" data-vimeo-autoplay></div>
  `
  expect(getOEmbedParameters(el)).toEqual({
    id: '2',
    width: '640',
    autoplay: 1,
  })
})

test('getOEmbedParameters builds off of a defaults object', () => {
  const el = html`
    <div data-vimeo-id="2" data-vimeo-width="640" data-vimeo-autoplay></div>
  `
  expect(getOEmbedParameters(el, { loop: true })).toEqual({
    id: '2',
    width: '640',
    autoplay: 1,
    loop: true,
  })
})

test('getOEmbedData doesn’t operate on non-Vimeo urls', async () => {
  await expect(getOEmbedData('https://notvimeo.com')).rejects.toThrowError(TypeError)
})

test('getOEmbedData returns a json oembed response', async () => {
  expect.assertions(2)
  const result = await getOEmbedData('https://player.vimeo.com/video/18')
  expect(typeof result).toBe('object')
  expect(result.type).toBe('video')
})

test('createEmbed should throw if there’s no element', () => {
  expect(() => {
    createEmbed({ html: 'html' })
  }).toThrowError(TypeError)
})

test('createEmbed returns the already-initialized iframe', () => {
  const container = html`
    <div data-vimeo-initialized></div>
  `
  const iframe = html`
    <iframe src="https://player.vimeo.com/2"></iframe>
  `
  container.appendChild(iframe)
  expect(createEmbed({ html: 'html' }, container)).toEqual(iframe)
})

test('createEmbed makes an iframe from the oembed data', () => {
  const container = html`
    <div></div>
  `
  const markup = '<iframe src="https://player.vimeo.com/2"></iframe>'

  const embed = createEmbed({ html: markup }, container)
  expect(container.getAttribute('data-vimeo-initialized')).toBe('true')
  expect(embed.outerHTML).toEqual(
    html`
      <iframe src="https://player.vimeo.com/2"></iframe>
    `.outerHTML,
  )
})

test('createEmbed returns the iframe from a responsive embed', () => {
  const container = html`
    <div></div>
  `
  const markup =
    '<div style="position:relative;padding-bottom:42.5%;height:0"><iframe src="https://player.vimeo.com/video/2" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0"></iframe></div>'

  const embed = createEmbed({ html: markup }, container)
  expect(container.getAttribute('data-vimeo-initialized')).toBe('true')
  expect(embed.outerHTML).toEqual(
    html`
      <iframe
        src="https://player.vimeo.com/video/2"
        style="position:absolute;top:0;left:0;width:100%;height:100%"
        frameborder="0"
      ></iframe>
    `.outerHTML,
  )
})

test('initializeEmbeds should create embeds', async () => {
  const div = html`
    <div data-vimeo-id="18" data-vimeo-width="640" id="handstick"></div>
  `
  document.body.appendChild(div)

  await new Promise(resolve => {
    initializeEmbeds()
    // wait 500ms for the embeds to initialize.
    setTimeout(resolve, 500)
  })

  expect(document.body.querySelector('#handstick').firstChild.nodeName).toBe('IFRAME')
})

test('resizeEmbeds is a function and sets a window property', () => {
  expect.assertions(2)
  expect(typeof resizeEmbeds).toBe('function')

  resizeEmbeds()
  expect(window.VimeoPlayerResizeEmbeds_).toBe(true)
})
