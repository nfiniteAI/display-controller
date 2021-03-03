/*global html*/

import {
  getMethodName,
  isDomElement,
  isObjectId,
  isHubstairsUrl,
  getHubstairsUrl,
  kebabToCamel,
  HubstairsError,
} from './functions'

describe('kebabToCamel', () => {
  test('formats properly the kebab string to camel case', () => {
    expect(kebabToCamel('my-string-yes')).toBe('myStringYes')
  })

  test("does noting if it's not kebab case", () => {
    expect(kebabToCamel('string')).toBe('string')
  })
})

describe('getMethodName', () => {
  test('formats properly the method name', () => {
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
    expect(isDomElement(html`<iframe></iframe> `)).toBe(true)
    expect(isDomElement(html`<div></div> `)).toBe(true)
  })
})

describe('isObjectId', () => {
  test('returns true for ObjectId', () => {
    expect(isObjectId('5e417dbac5d2651adbe509ec')).toBe(true)
    expect(isObjectId(null)).toBe(false)
    expect(isObjectId(0)).toBe(false)
    expect(isObjectId('any')).toBe(false)
  })
})

describe('isHubstairsUrl', () => {
  test('identifies right Hubstairs urls only', () => {
    expect(isHubstairsUrl('http://display.hubstairs.io')).toBe(true)
    expect(isHubstairsUrl('http://display.hubstairs.tld')).toBe(false)
    expect(isHubstairsUrl('http://display.nfinite.app')).toBe(true)
    expect(isHubstairsUrl('http://display.hubstairs.com')).toBe(true)
    expect(isHubstairsUrl('https://display.hubstairs.com')).toBe(true)
    expect(isHubstairsUrl('//display.hubstairs.com')).toBe(true)
    expect(isHubstairsUrl('http://display-something.hubstairs.com')).toBe(true)
    expect(isHubstairsUrl('https://display-something.hubstairs.com')).toBe(true)
    expect(isHubstairsUrl('//display-something.hubstairs.com')).toBe(true)
    expect(isHubstairsUrl('http://display.hubstairs.com:1000')).toBe(true)
    expect(isHubstairsUrl('https://display.hubstairs.com:1000')).toBe(true)
    expect(isHubstairsUrl('//display.hubstairs.com:1000')).toBe(true)
    expect(isHubstairsUrl('https://nothubstairs.com')).toBe(false)
    expect(isHubstairsUrl('https://hubstairs.someone.com')).toBe(false)
    expect(isHubstairsUrl('https://display.hubstairs.com/v1/1234')).toBe(true)
    expect(isHubstairsUrl('https://display-something.hubstairs.com/v1/1234')).toBe(true)
    expect(isHubstairsUrl('https://display.hubstairs.com.evil.net')).toBe(false)
  })
})

describe('getHubstairsUrl', () => {
  test('returns correctly a url from the embed parameters', () => {
    expect(getHubstairsUrl({ displayid: '5e417dbac5d2651adbe509ec' })).toBe(
      'https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec',
    )
    expect(getHubstairsUrl({ url: 'http://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec' })).toBe(
      'https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec',
    )
    expect(getHubstairsUrl({ url: 'https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec' })).toBe(
      'https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec',
    )
  })

  test('throws an error if there is no parameters', () => {
    expect(() => {
      getHubstairsUrl()
    }).toThrowError(HubstairsError)
  })

  test('throws an error if the displayid parameter is not an integer', () => {
    expect(() => {
      getHubstairsUrl({ displayid: 'https://nothubstairs.com/2' })
    }).toThrowError(HubstairsError)
  })

  test('throws an error if the url parameter is not a Hubstairs url', () => {
    expect(() => {
      getHubstairsUrl({ url: 'https://nothubstairs.com/2' })
    }).toThrowError(HubstairsError)
  })
})
