# React integration

> React integration makes heavy use of React hooks, so you'll need to be on React 16.8 or greater

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
  displayid,
  token,
}

function App() {
  return <Display {...displayProps} />
}
```

## Props

> If needed, you can find more details in the [types declaration](../packages/display-react/types/index.d.ts)

`displayProps` can receive the following data:

### Common props

| props name                | default                                  | description                                                                                                 |
| ------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| displayid _or_ displayUrl |                                          | **Required.** Either the id or the url of the nfinite Display.                                              |
| token                     |                                          | **Required.** Token generated in my.nfinite.app (in the service user section).                              |
| responsive                | `true` (if no width and height set)      | Resize according to its parent element, this parameter is incompatible with `height` and `width` parameters |
| displayUrl                | `https://display.nfinite.app`            | Override the generated base url for the Display (useful in development mode).                               |
| oembedUrl                 | `https://display.nfinite.app/api/oembed` | Override the generated base url for oembed api (useful in development mode).                                |
| language                  | default language set in my.nfinite.app   | One of the defined language in my.nfinite.app (in the platform section).                                    |
| onError                   |                                          | Callback on error                                                                                           |
| onReady                   |                                          | Callback when "ready" event is emitted                                                                      |

### Infinite props

| props name                      | default | description                                                                                                                          |
| ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| onChangeProduct                 |         | Callback on scene change, it receives the an object with the `prevProduct` and the `nextProduct` as argument                         |
| onChangeScene                   |         | Callback on scene change, it receives the `new scene` as argument (it will also be triggered at the load of the scene)               |
| onLoadScene                     |         | Callback on scene load, it receives the `initial scene` as argument                                                                  |
| onProductClick ![beta]          |         | Callback on product CTA click, it receives the `product` as argument                                                                 |
| onChangeSelectedProductLocation |         | Callback when a location is opened (marker clicked) or closed, it receives the `currentProduct` as argument (or nothing when closed) |

### Produt focus props

| props name            | default | description                                                       |
| --------------------- | ------- | ----------------------------------------------------------------- |
| productcode           |         | Load scenes where the product is visible (identified by its code) |
| onChangeScene ![beta] |         | Callback on scene change, it receives the `new scene` as argument |

[beta]: https://img.shields.io/badge/beta-blue
