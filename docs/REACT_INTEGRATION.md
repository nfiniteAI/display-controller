# React integration ![beta]

## Installation

```bash
npm i @hubstairs/display-react
# or
yarn add @hubstairs/display-react
```

## Usage

```jsx
import Display from '@hubstairs/display-react'

const displayProps = {
  displayid
  token
}

function App() {
  return <Display {...displayProps} />
}
```

## Props

`displayProps` can receive the following data:

| props name                | default                             | description                                                                                                 |
| ------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| displayid _or_ displayUrl |                                     | **Required.** Either the id or the url of the Hubstairs Display.                                            |
| token                     |                                     | **Required.** Token generated in app.hubstairs.com (in the service user section).                           |
| productcode               |                                     | Load scenes where the product is visible (identified by its code). Only available for "Product Focus"       |
| responsive                | `true` (if no width and height set) | Resize according to its parent element, this parameter is incompatible with `height` and `width` parameters |
| displayUrl                | `https://display.hubstairs.com`     | Override the generated base url for the Display (useful in development mode).                               |
| oembedUrl                 | `https://api.hubstairs.com/oembed`  | Override the generated base url for oembed api (useful in development mode).                                |
| noCache                   | `false`                             | By default data from the Display is cached, you can bypass that by setting noCache to `true`                |
| onError                   |                                     | Callback on error                                                                                           |
| onReady                   |                                     | Callback when "ready" event is emitted                                                                      |
| onFilter                  |                                     | Callback on filter change, it receives the `new filter` as argument                                         |
| onChangeScene             |                                     | Callback on scene change, it receives the `new scene` as argument                                           |
| onProductClick            |                                     | Callback on product click, it receives the `product` as argument                                            |

[beta]: https://img.shields.io/badge/beta-blue
