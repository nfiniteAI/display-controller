/*global html*/

import { getMethodName, isDomElement, isInteger, isVimeoUrl, getVimeoUrl } from './functions'

test('getMethodName properly formats the method name', () => {
  expect(getMethodName('color', 'get')).toBe('getColor')
  expect(getMethodName('color', 'GET')).toBe('getColor')
  expect(getMethodName('getColor', 'get')).toBe('getColor')
  expect(getMethodName('color', 'set')).toBe('setColor')
  expect(getMethodName('color', 'SET')).toBe('setColor')
  expect(getMethodName('setColor', 'set')).toBe('setColor')
})

test('isDomElement returns true for elements', () => {
  expect(isDomElement()).toBe(false)
  expect(isDomElement('string')).toBe(false)
  expect(isDomElement(true)).toBe(false)
  expect(isDomElement(false)).toBe(false)
  expect(isDomElement(1)).toBe(false)
  expect(isDomElement(1.1)).toBe(false)
  expect(
    isDomElement(
      html`
        <iframe></iframe>
      `,
    ),
  ).toBe(true)
  expect(
    isDomElement(
      html`
        <div></div>
      `,
    ),
  ).toBe(true)
})

test('isInteger returns true for integers', () => {
  expect(isInteger(1)).toBe(true)
  expect(isInteger('1')).toBe(true)
  expect(isInteger(1.0)).toBe(true)
  expect(isInteger(1.1)).toBe(false)
  expect(isInteger(false)).toBe(false)
  expect(isInteger(NaN)).toBe(false)
  expect(isInteger(Infinity)).toBe(false)
})

test('isVimeoUrl identifies *.vimeo.com only', () => {
  expect(isVimeoUrl('http://vimeo.com')).toBe(true)
  expect(isVimeoUrl('https://vimeo.com')).toBe(true)
  expect(isVimeoUrl('//vimeo.com')).toBe(true)
  expect(isVimeoUrl('http://www.vimeo.com')).toBe(true)
  expect(isVimeoUrl('https://www.vimeo.com')).toBe(true)
  expect(isVimeoUrl('//www.vimeo.com')).toBe(true)
  expect(isVimeoUrl('http://player.vimeo.com')).toBe(true)
  expect(isVimeoUrl('//player.vimeo.com')).toBe(true)
  expect(isVimeoUrl('https://player.vimeo.com')).toBe(true)
  expect(isVimeoUrl('https://notvimeo.com')).toBe(false)
  expect(isVimeoUrl('https://vimeo.someone.com')).toBe(false)
  expect(isVimeoUrl('https://player.vimeo.com/video/123')).toBe(true)
  expect(isVimeoUrl('https://vimeo.com/2')).toBe(true)
  expect(isVimeoUrl('https://vimeo.com.evil.net')).toBe(false)
  expect(isVimeoUrl('http://player.vimeo.com.evil.com')).toBe(false)
  expect(isVimeoUrl('https://player.vimeozcom')).toBe(false)
  expect(isVimeoUrl('https://www2vimeo.com')).toBe(false)
})

test('getVimeoUrl correctly returns a url from the embed parameters', () => {
  expect(getVimeoUrl({ id: 2 })).toBe('https://vimeo.com/2')
  expect(getVimeoUrl({ url: 'http://vimeo.com/2' })).toBe('https://vimeo.com/2')
  expect(getVimeoUrl({ url: 'https://vimeo.com/2' })).toBe('https://vimeo.com/2')
})

test('getVimeoUrl throws when the required keys don’t exist', () => {
  expect(() => {
    getVimeoUrl()
  }).toThrowError(Error)

  expect(() => {
    getVimeoUrl({ id: 'string' })
  }).toThrowError(TypeError)

  expect(() => {
    getVimeoUrl({ id: 'https://notvimeo.com/2' })
  }).toThrowError(TypeError)

  expect(() => {
    getVimeoUrl({ url: 'https://notvimeo.com/2' })
  }).toThrowError(TypeError)
})
