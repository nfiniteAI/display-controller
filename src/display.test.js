/*global html*/

import Display from './display'
import { HubstairsError } from './lib/functions'

describe('constructor', () => {
  test('accepts only Hubstairs embeds', () => {
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

  test('does not throw if jquery is not present', () => {
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

  test('uses the first element from a jQuery object', () => {
    /* eslint-env jquery */
    const consoleWarnSpy = jest.spyOn(console, 'warn')

    const iframes = jQuery('iframe')
    const display = new Display(iframes)

    expect(consoleWarnSpy).toHaveBeenCalled()
    expect(display.element).toBe(iframes[0])
  })

  test('does not warn if only one jQuery object', () => {
    /* eslint-env jquery */
    const consoleWarnSpy = jest.spyOn(console, 'warn')

    const div = jQuery('.one')
    const display = new Display(div)

    expect(consoleWarnSpy).toHaveBeenCalled()
    expect(display.element).toBe(div[0])
  })

  test('returns the same display object for the same element', () => {
    const iframe = document.querySelector('.one')
    const display1 = new Display(iframe)
    const display2 = new Display(iframe)

    expect(display1).toBe(display2)
  })

  test('throws if displayId is bad', async () => {
    const display1 = new Display(
      html`
        <div data-hubstairs-displayid="guihash"></div>
      `,
    )
    await expect(display1.ready()).rejects.toThrow()
  })
})

describe('methods', () => {
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

    await expect(display.set('config')).rejects.toThrowError(HubstairsError)
  })

  test('on requires an event and a callback', () => {
    const iframe = document.querySelector('.one')
    const display = new Display(iframe)

    expect(() => display.on()).toThrowError(HubstairsError)
    expect(() => display.on('addToCart')).toThrowError(HubstairsError)
    expect(() => display.on('addToCart', 'string')).toThrowError(HubstairsError)
    expect(() => display.on('addToCart', () => {})).not.toThrow()
  })

  test('off requires an event name, and the optional callback must be a function', () => {
    const iframe = document.querySelector('.one')
    const display = new Display(iframe)

    expect(() => display.off()).toThrowError(HubstairsError)
    expect(() => display.off('addToCart', 'string')).toThrowError(HubstairsError)
    expect(() => display.off('addToCart', () => {})).not.toThrow()
  })
})
