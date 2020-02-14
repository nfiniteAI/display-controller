/*global html*/

import Display from './display'

test('constructor accepts only Hubstairs embeds', () => {
  expect(() => {
    void new Display(
      html`
        <div data-hubstairs-initialized><iframe></iframe></div>
      `,
    )
  }).toThrow()

  expect(() => {
    void new Display('string')
  }).toThrow()

  expect(() => {
    void new Display(
      html`
        <iframe></iframe>
      `,
    )
  }).toThrow()

  expect(() => {
    void new Display(
      html`
        <iframe src="https://www.youtube.com/embed/Uj3_KqkI9Zo"></iframe>
      `,
    )
  }).toThrow()
})

test('contructor does not throw if jquery is not present', () => {
  /* eslint-env jquery */
  /* eslint-disable no-global-assign */
  const frames = jQuery('iframe')[0]
  const oldJQuery = jQuery

  window.jQuery = jQuery = undefined

  expect(() => {
    void new Display(frames)
  }).not.toThrow()

  jQuery = window.jQuery = oldJQuery
  /* eslint-enable no-global-assign */
})

test('constructor uses the first element from a jQuery object', () => {
  /* eslint-env jquery */
  const consoleWarnSpy = jest.spyOn(console, 'warn')

  const iframes = jQuery('iframe')
  const display = new Display(iframes)

  expect(consoleWarnSpy).toHaveBeenCalled()
  expect(display.element).toBe(iframes[0])
})

test('constructor does not warn if only one jQuery object', () => {
  /* eslint-env jquery */
  const consoleWarnSpy = jest.spyOn(console, 'warn')

  const div = jQuery('.one')
  const display = new Display(div)

  expect(consoleWarnSpy).toHaveBeenCalled()
  expect(display.element).toBe(div[0])
})

// test.skip('constructor accepts a div without attributes when there is an options object', (t) => {
//     t.notThrows(() => {
//         void new Display(html`<div id="display"></div>`, { id: 76979871 });
//     });
// });
//
// test.skip('constructor finds iframe elements within the provided element', (t) => {
//     const div = html`<div></div>`;
//     const iframe = html`<iframe src="https://display.vimeo.com/video/159195552" width="640" height="360" frameborder="0" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>`;
//     div.appendChild(iframe);
//
//     const display = new Display(div);
//
//     t.ok(display.element === iframe);
// });

// test.skip('constructor gets an element by id if passed a string', (t) => {
//     const element = document.getElementById('test_display');
//     const display = new Display('test_display');
//
//     t.ok(display.element === element);
// });

test('constructor returns the same display object for the same element', () => {
  const iframe = document.querySelector('.one')
  const display1 = new Display(iframe)
  const display2 = new Display(iframe)

  expect(display1).toBe(display2)
})

test('constructing a display with a bad URI should fail', async () => {
  const display1 = new Display(
    html`
      <div data-hubstairs-displayId="guihash"></div>
    `,
  )
  await expect(display1.ready()).rejects.toThrow()
})

test('future calls to destroyed display should not not work', async () => {
  expect.assertions(4)

  const display1 = new Display(
    html`
      <iframe id="to-destroy" src="https://display.hubstairs.com/v1/1234"></iframe>
    `,
  )

  await expect(display1.destroy()).resolves.toBeUndefined()
  expect(document.querySelector('#to-destroy')).toBeFalsy()

  await expect(display1.ready()).rejects.toThrow()
  await expect(display1.getProducts()).rejects.toThrow()
})

test('display object includes all api methods', () => {
  const iframe = document.querySelector('.one')
  const display = new Display(iframe)

  expect(typeof display.get).toBe('function')
  expect(typeof display.set).toBe('function')
  expect(typeof display.callMethod).toBe('function')
  expect(typeof display.on).toBe('function')
  expect(typeof display.off).toBe('function')
  expect(typeof display.destroy).toBe('function')
  expect(typeof display.nextScene).toBe('function')
  expect(typeof display.getProducts).toBe('function')
  expect(typeof display.setConfig).toBe('function')
  expect(typeof display.destroy).toBe('function')
})

test('set requires a value', async () => {
  const iframe = document.querySelector('.one')
  const display = new Display(iframe)

  await expect(display.set('config')).rejects.toThrowError(TypeError)
})

test('on requires an event and a callback', () => {
  const iframe = document.querySelector('.one')
  const display = new Display(iframe)

  expect(() => display.on()).toThrowError(TypeError)
  expect(() => display.on('addToCart')).toThrowError(TypeError)
  expect(() => display.on('addToCart', 'string')).toThrowError(TypeError)
  expect(() => display.on('adddToCart', () => {})).not.toThrow()
})

test('off requires an event name, and the optional callback must be a function', () => {
  const iframe = document.querySelector('.one')
  const display = new Display(iframe)

  expect(() => display.off()).toThrowError(TypeError)
  expect(() => display.off('addToCart', 'string')).toThrowError(TypeError)
  expect(() => display.off('addToCart', () => {})).not.toThrow()
})
