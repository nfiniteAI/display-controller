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
  expect(isVimeoUrl('http://display.hubstairs.com')).toBe(true)
  expect(isVimeoUrl('https://display.hubstairs.com')).toBe(true)
  expect(isVimeoUrl('//display.hubstairs.com')).toBe(true)
  expect(isVimeoUrl('http://display-something.hubstairs.com')).toBe(true)
  expect(isVimeoUrl('https://display-something.hubstairs.com')).toBe(true)
  expect(isVimeoUrl('//display-something.hubstairs.com')).toBe(true)
  expect(isVimeoUrl('http://display.hubstairs.com:1000')).toBe(true)
  expect(isVimeoUrl('https://display.hubstairs.com:1000')).toBe(true)
  expect(isVimeoUrl('//display.hubstairs.com:1000')).toBe(true)
  expect(isVimeoUrl('https://nothubstairs.com')).toBe(false)
  expect(isVimeoUrl('https://hubstairs.someone.com')).toBe(false)
  expect(isVimeoUrl('https://display.hubstairs.com/v1/1234')).toBe(true)
  expect(isVimeoUrl('https://display-something.hubstairs.com/v1/1234')).toBe(true)
  expect(isVimeoUrl('https://display.hubstairs.com.evil.net')).toBe(false)
})

test('getVimeoUrl correctly returns a url from the embed parameters', () => {
  expect(getVimeoUrl({ displayId: 1234 })).toBe('https://display.hubstairs.com/v1/1234')
  expect(getVimeoUrl({ url: 'http://display.hubstairs.com/v1/1234' })).toBe('https://display.hubstairs.com/v1/1234')
  expect(getVimeoUrl({ url: 'https://display.hubstairs.com/v1/1234' })).toBe('https://display.hubstairs.com/v1/1234')
})

describe('getVimeoUrl throws when the required keys don’t exist', () => {
  test('throws an error if there is no parameters', () => {
    expect(() => {
      getVimeoUrl()
    }).toThrowError(Error)
  })

  test('throws an error if the displayId parameter is not an integer', () => {
    expect(() => {
      getVimeoUrl({ displayId: 'https://notvimeo.com/2' })
    }).toThrowError(TypeError)
  })

  test('throws an error if the url parameter is not a Hubstairs url', () => {
    expect(() => {
      getVimeoUrl({ url: 'https://notvimeo.com/2' })
    }).toThrowError(TypeError)
  })
})
