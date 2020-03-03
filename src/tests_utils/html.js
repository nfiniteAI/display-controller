global.html = (strings, ...values) => {
  const string = strings.reduce((previous, current, index) => {
    return previous + current + (values[index] ? values[index] : '')
  }, '')

  const el = document.createElement('div')
  el.innerHTML = string.trim()
  return el.firstChild
}
