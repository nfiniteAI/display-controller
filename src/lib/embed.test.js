/*global html*/

import { getOEmbedParameters, getOEmbedData, createEmbed, initializeEmbeds, resizeEmbeds } from './embed'

test('getOEmbedParameters retrieves the params from data attributes', () => {
  const el = html`
    <div data-hubstairs-displayId="2" data-hubstairs-productCode="1234"></div>
  `
  expect(getOEmbedParameters(el)).toEqual({
    displayId: '2',
    productCode: '1234',
  })
})

test('getOEmbedParameters builds off of a defaults object', () => {
  const el = html`
    <div data-hubstairs-displayId="2" data-hubstairs-productCode="1234"></div>
  `
  expect(getOEmbedParameters(el, { loop: true })).toEqual({
    displayId: '2',
    productCode: '1234',
    loop: true,
  })
})

test('getOEmbedData doesn’t operate on non-Hubstairs urls', async () => {
  await expect(getOEmbedData('https://nothubstairs.com')).rejects.toThrowError(TypeError)
})

test('getOEmbedData returns a json oembed response', async () => {
  expect.assertions(2)
  const result = await getOEmbedData('https://display.hubstairs.com/v1/1234')
  expect(typeof result).toBe('object')
  expect(result.type).toBe('rich')
})

test('createEmbed should throw if there’s no element', () => {
  expect(() => {
    createEmbed({ html: 'html' })
  }).toThrowError(TypeError)
})

test('createEmbed returns the already-initialized iframe', () => {
  const container = html`
    <div data-hubstairs-initialized></div>
  `
  const iframe = html`
    <iframe src="https://display.hubstairs.com/2"></iframe>
  `
  container.appendChild(iframe)
  expect(createEmbed({ html: 'html' }, container)).toEqual(iframe)
})

test('createEmbed makes an iframe from the oembed data', () => {
  const container = html`
    <div></div>
  `
  const markup = '<iframe src="https://display.hubstairs.com/2"></iframe>'

  const embed = createEmbed({ html: markup }, container)
  expect(container.getAttribute('data-hubstairs-initialized')).toBe('true')
  expect(embed.outerHTML).toEqual(
    html`
      <iframe src="https://display.hubstairs.com/2"></iframe>
    `.outerHTML,
  )
})

test('createEmbed returns the iframe from a responsive embed', () => {
  const container = html`
    <div></div>
  `
  const markup =
    '<div style="position:relative;padding-bottom:42.5%;height:0"><iframe src="https://display.hubstairs.com/v1/2" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0"></iframe></div>'

  const embed = createEmbed({ html: markup }, container)
  expect(container.getAttribute('data-hubstairs-initialized')).toBe('true')
  expect(embed.outerHTML).toEqual(
    html`
      <iframe
        src="https://display.hubstairs.com/v1/2"
        style="position:absolute;top:0;left:0;width:100%;height:100%"
        frameborder="0"
      ></iframe>
    `.outerHTML,
  )
})

test('initializeEmbeds should create embeds', async () => {
  const div = html`
    <div data-hubstairs-displayId="18" id="handstick"></div>
  `
  document.body.appendChild(div)

  await new Promise(resolve => {
    initializeEmbeds()
    // wait 500ms for the embeds to initialize.
    setTimeout(resolve, 500)
  })

  expect(document.body.querySelector('#handstick').firstElementChild.nodeName).toBe('DIV')
  expect(document.body.querySelector('#handstick').firstElementChild.firstElementChild.nodeName).toBe('DIV')
  expect(document.body.querySelector('#handstick').firstElementChild.firstElementChild.firstElementChild.nodeName).toBe(
    'DIV',
  )
  expect(
    document.body.querySelector('#handstick').firstElementChild.firstElementChild.firstElementChild.firstElementChild
      .nodeName,
  ).toBe('IFRAME')
})

test('resizeEmbeds is a function and sets a window property', () => {
  expect.assertions(2)
  expect(typeof resizeEmbeds).toBe('function')

  resizeEmbeds()
  expect(window.HubstairsDisplayResizeEmbeds_).toBe(true)
})
