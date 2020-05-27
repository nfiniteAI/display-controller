export class HTTPError extends Error {
  constructor(response) {
    super(response.statusText)
    this.name = 'HTTPError'
    this.response = response
  }
}

function checkStatus(response) {
  if (response.ok) {
    return response
  } else {
    throw new HTTPError(response)
  }
}

function parseJSON(response) {
  if (response.status === 204) {
    return Promise.resolve('')
  }
  const res = response.clone()
  return response
    .json()
    .catch(() => res.text())
    .catch(() => response.statusText)
}

function parseAndPopulate(response) {
  return parseJSON(response).then(data => {
    response.data = data
    return response
  })
}

export function fetchURL(url, params) {
  return fetch(url, params).then(parseAndPopulate).then(checkStatus)
}
