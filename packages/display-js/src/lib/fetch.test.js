import { fetchURL, HTTPError } from './fetch'
import jestMock from 'jest-fetch-mock'

jestMock.enableMocks()

const headers = {
  accept: 'application/json',
}

beforeEach(() => {
  fetch.resetMocks()
})

describe("if it' 500", () => {
  test('it throw an HTTPError', async () => {
    fetch.mockResponse('', { status: 500 })
    await expect(fetchURL('https://httpstat.us/500')).rejects.toThrow(HTTPError)
  })

  test('status code is 500', async () => {
    expect.assertions(1)
    fetch.mockResponse('', { status: 500 })
    // eslint-disable-next-line jest/no-conditional-expect
    return fetchURL('https://httpstat.us/500', { headers }).catch(e => expect(e.response.status).toBe(500))
  })

  test("error data is parsed if it's json", async () => {
    expect.assertions(1)
    fetch.mockResponse(
      JSON.stringify({
        code: 500,
        description: 'Internal Server Error',
      }),
      { status: 500 },
    )
    return fetchURL('https://httpstat.us/500', { headers }).catch(e =>
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e.response.data).toMatchObject({
        code: 500,
        description: 'Internal Server Error',
      }),
    )
  })

  test("error data is response text if it's not json", () => {
    expect.assertions(1)
    fetch.mockResponse('500 Internal Server Error', { status: 500 })
    // eslint-disable-next-line jest/no-conditional-expect
    return fetchURL('https://httpstat.us/500').catch(e => expect(e.response.data).toBe('500 Internal Server Error'))
  })
})

describe("if it's 200", () => {
  test("response data is parsed if it's json", async () => {
    expect.assertions(1)
    fetch.mockResponse(
      JSON.stringify({
        code: 200,
        description: 'OK',
      }),
    )
    return fetchURL('https://httpstat.us/200', { headers }).then(response =>
      expect(response.data).toMatchObject({
        code: 200,
        description: 'OK',
      }),
    )
  })

  test('status code is 200', () => {
    expect.assertions(1)
    fetch.mockResponse('', { status: 200 })
    return fetchURL('https://httpstat.us/200').then(response => expect(response.status).toBe(200))
  })

  test("response data is response text if it's not json", () => {
    expect.assertions(1)
    fetch.mockResponse('200 OK')
    return fetchURL('https://httpstat.us/200').then(response => expect(response.data).toBe('200 OK'))
  })
})

describe("if it's 204", () => {
  test('response data is an empty string', () => {
    expect.assertions(2)
    fetch.mockResponse('', { status: 204 })
    return fetchURL('https://httpstat.us/204').then(response => {
      expect(response.status).toBe(204)
      expect(response.data).toBe('')
    })
  })
})
