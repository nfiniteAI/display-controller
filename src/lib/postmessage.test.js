import { storeCallback, getCallbacks } from './callbacks'
import { parseMessageData, postMessage, processData } from './postmessage'

test('parseMessageData passes through objects', () => {
  expect(parseMessageData({ method: 'getColor' })).toEqual({ method: 'getColor' })
})

test('parseMessageData parses strings', () => {
  expect(parseMessageData('{ "method": "getColor" }')).toEqual({ method: 'getColor' })
})

test("parseMessageData returns empty object with strings that can't be parsed", () => {
  expect(parseMessageData('post://{"name":"error","type":"postMessage"}')).toEqual({})
})

test('postMessage called correctly with just a method', () => {
  const postMessageSpy = jest.fn()

  const display = {
    element: {
      contentWindow: {
        postMessage: postMessageSpy,
      },
    },
    origin: 'displayOrigin',
  }

  postMessage(display, 'testMethod')

  expect(postMessageSpy).toHaveBeenCalled()
  expect(postMessageSpy).toHaveBeenCalledWith({ method: 'testMethod' }, 'displayOrigin')
})

test('postMessage called correctly with a method and single param', () => {
  const postMessageSpy = jest.fn()
  const display = {
    element: {
      contentWindow: {
        postMessage: postMessageSpy,
      },
    },
    origin: 'displayOrigin',
  }

  postMessage(display, 'testMethodWithParams', 'testParam')
  expect(postMessageSpy).toHaveBeenCalled()
  expect(postMessageSpy).toHaveBeenCalledWith({ method: 'testMethodWithParams', value: 'testParam' }, 'displayOrigin')
})

test('postMessage called correctly with a method and params object', () => {
  const postMessageSpy = jest.fn()
  const display = {
    element: {
      contentWindow: {
        postMessage: postMessageSpy,
      },
    },
    origin: 'displayOrigin',
  }

  postMessage(display, 'testMethodWithParamObject', { language: 'en', kind: 'captions' })

  expect(postMessageSpy).toHaveBeenCalled()

  expect(postMessageSpy).toHaveBeenCalledWith(
    {
      method: 'testMethodWithParamObject',
      value: {
        language: 'en',
        kind: 'captions',
      },
    },
    'displayOrigin',
  )
})

test('processData calls the proper callbacks for an event', () => {
  const display = { element: {} }
  const callbacks = [jest.fn(), jest.fn()]

  callbacks.forEach(callback => {
    storeCallback(display, 'event:play', callback)
  })

  processData(display, { event: 'play', data: { seconds: 0 } })

  callbacks.forEach(callback => {
    expect(callback).toHaveBeenCalled()
    expect(callback).toHaveBeenCalledWith({ seconds: 0 })
  })
})

test('processData resolves a method promise with the proper data', async () => {
  const display = { element: {} }
  const callback = {}
  const methodPromise = new Promise((resolve, reject) => {
    callback.resolve = resolve
    callback.reject = reject
  })

  storeCallback(display, 'getColor', callback)

  processData(display, { method: 'getColor', value: '00adef' })

  expect(getCallbacks(display, 'getColor')).toHaveLength(0)

  const value = await methodPromise
  expect(value).toBe('00adef')
})

test('processData resolves multiple of the same method calls with the proper data', async () => {
  const display = { element: {} }

  const callbackOne = {}
  const methodPromiseOne = new Promise((resolve, reject) => {
    callbackOne.resolve = resolve
    callbackOne.reject = reject
  })

  const callbackTwo = {}
  const methodPromiseTwo = new Promise((resolve, reject) => {
    callbackTwo.resolve = resolve
    callbackTwo.reject = reject
  })

  const callbackThree = {}
  const methodPromiseThree = new Promise((resolve, reject) => {
    callbackThree.resolve = resolve
    callbackThree.reject = reject
  })

  storeCallback(display, 'addCuePoint', callbackOne)
  storeCallback(display, 'addCuePoint', callbackTwo)
  processData(display, { method: 'addCuePoint', value: 'bf6a88a0-87ac-4196-b249-a66fde4339f2' })
  storeCallback(display, 'addCuePoint', callbackThree)
  processData(display, { method: 'addCuePoint', value: 'a6f3de01-f4cb-4956-a639-221e640ed458' })
  processData(display, { method: 'addCuePoint', value: 'b9a2834a-6461-4785-8301-7e6501c3cf4c' })

  const [idOne, idTwo, idThree] = await Promise.all([methodPromiseOne, methodPromiseTwo, methodPromiseThree])
  expect(idOne).toBe('bf6a88a0-87ac-4196-b249-a66fde4339f2')
  expect(idTwo).toBe('a6f3de01-f4cb-4956-a639-221e640ed458')
  expect(idThree).toBe('b9a2834a-6461-4785-8301-7e6501c3cf4c')
})

test('processData rejects a method promise on an error event', async () => {
  const display = { element: {} }
  const callback = {}
  const methodPromise = new Promise((resolve, reject) => {
    callback.resolve = resolve
    callback.reject = reject
  })

  storeCallback(display, 'getColor', callback)

  processData(display, {
    event: 'error',
    data: {
      method: 'getColor',
      name: 'TypeError',
      message: 'The color should be 3- or 6-digit hex value.',
    },
  })

  expect(getCallbacks(display, 'getColor')).toHaveLength(0)
  await expect(methodPromise).rejects.toThrowError('The color should be 3- or 6-digit hex value.')

  // we need this test because error name are set dynmaically so it cannot be tested by jest correctly
  try {
    await methodPromise
  } catch (error) {
    // eslint-disable-next-line jest/no-try-expect
    expect(error.name).toBe('TypeError')
  }
})
