import { callbackMap, storeCallback, getCallbacks, removeCallback, shiftCallbacks, swapCallbacks } from './callbacks'

test('storeCallback adds the callback when the name doesn’t exist', () => {
  const player = {
    element: {},
  }

  const cb = () => {}

  storeCallback(player, 'test', cb)
  expect(callbackMap.get(player.element)).toHaveProperty('test')
  expect(callbackMap.get(player.element).test).toBeInstanceOf(Array)
  expect(callbackMap.get(player.element).test[0]).toBe(cb)
})

test('storeCallback adds the callback when the name already exists', () => {
  const player = {
    element: {},
  }

  const cb = () => {}
  const cb2 = () => {}

  storeCallback(player, 'test', cb)
  storeCallback(player, 'test', cb2)
  expect(callbackMap.get(player.element).test).toHaveLength(2)
  expect(callbackMap.get(player.element).test[1]).toBe(cb2)
})

test('getCallbacks returns an empty array when there are no callbacks', () => {
  expect(getCallbacks({ element: {} }, 'test')).toEqual([])
})

test('getCallbacks returns the callbacks', () => {
  const player = {
    element: {},
  }

  const cb = () => {}

  callbackMap.set(player.element, { test: [cb] })
  expect(getCallbacks(player, 'test')).toEqual([cb])
})

test('removeCallback does nothing if there are no callbacks', () => {
  expect(removeCallback({ element: {} }, 'test')).toBe(true)
})

test('removeCallback removes all callbacks without a callback arg', () => {
  const player = {
    element: {},
  }

  const cb = () => {}
  const cb2 = () => {}

  callbackMap.set(player.element, { test: [cb, cb2] })
  expect(removeCallback(player, 'test')).toBe(true)
  expect(callbackMap.get(player.element)).toEqual({ test: [] })
})

test('removeCallback removes just the callback specified', () => {
  const player = {
    element: {},
  }

  const cb = () => {}
  const cb2 = () => {}

  callbackMap.set(player.element, { test: [cb, cb2] })
  expect(removeCallback(player, 'test', cb2)).toBe(false)
  expect(callbackMap.get(player.element)).toEqual({ test: [cb] })
})

test('removeCallback does nothing if the callback passed isn’t in the map', () => {
  const player = {
    element: {},
  }

  const cb = () => {}
  const cb2 = () => {}

  callbackMap.set(player.element, { test: [cb] })
  expect(removeCallback(player, 'test', cb2)).toBe(false)
  expect(callbackMap.get(player.element)).toEqual({ test: [cb] })
})

test('shiftCallbacks shifts a single callback from the callback array', () => {
  const player = {
    element: {},
  }

  const cb = () => {}
  const cb2 = () => {}

  callbackMap.set(player.element, { test: [cb, cb2] })

  expect(shiftCallbacks(player, 'test')).toBe(cb)

  const callbacks = getCallbacks(player, 'test')
  expect(callbacks).toHaveLength(1)
  expect(callbacks[0]).toBe(cb2)
})

test('shiftCallbacks returns false when there are no callbacks', () => {
  const player = {
    element: {},
  }

  callbackMap.set(player.element, { test: [] })
  expect(shiftCallbacks(player, 'test')).toBe(false)
})

test('swapCallbacks moves the callbacks from one key to another', () => {
  const oldElement = {}
  const newElement = {}
  const cb = () => {}

  callbackMap.set(oldElement, { test: [cb] })
  swapCallbacks(oldElement, newElement)

  expect(callbackMap.get(oldElement)).toBeUndefined()
  expect(callbackMap.get(newElement)).toEqual({ test: [cb] })
})
