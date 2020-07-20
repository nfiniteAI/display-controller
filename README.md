# Hubstairs Display Controller

Take control of your Hubstairs Display.

- [Foreword](#foreword)
- [About](#about)
- Integrations
  - [React](./docs/REACT_INTEGRATION.md)
  - [Advanced](./docs/ADVANCED_INTEGRATION.md)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Display Controller API](./docs/API.md#display-controller-api)
  - [Constructor](./docs/API.md#constructor)
  - [Events](./docs/API.md#events)
  - [Functions](./docs/API.md#functions)
- [Contributing](./docs/CONTRIBUTING.md)

## Foreword

This documentation evolves along with the development of the [Display Controller API](./docs/API.md#display-controller-api). This means that you can find options or features that are pretty new and they may not be totally stable. To mark those new things we use the following `badges`:

- ![draft] : documentation is still "Work in progress" (it concerns only the documentation)
- ![beta] : early option/feature, its usage may change
- ![new] : fresh option/feature which is still not largely used but its usage is stable

## About

Hubstairs Display is an interactive visual content delivery solution and its integration on your website can be easied with Hubstairs Display Controller.

Features:

- Instantiate Hubstairs Display
- Hook on Display events and lifecycle
- Access to content information
- Call functions

Info: If you use `React` on your website, we recommend you to follow the [`React integration instructions`](./docs/REACT_INTEGRATION.md) instead. It allows you to manipulate your Display as a Component and keep the exact same features.

## Installation

Hubstairs Display Controller is available on the npm registry. Just run

```bash
npm i @hubstairs/display-js
# or
yarn add @hubstairs/display-js
```

Info: If you do not use `npm` as a package manager, you can follow the [script integration instructions](./docs/ADVANCED_INTEGRATION.md#using-a-cdn)

## Getting started

After having set your Display up on [Hubstairs™](https://app.hubstairs.com) you will received your `display id` and your access `token`. Those information are needed to instantiate your Display. Pass the parent `DOM element` to the [Display constructor](./docs/API#constructor).

```html
<div id="display">
  <!-- insert the Display right here -->
</div>
```

```js
import Display from '@hubstairs/display-js'

const domElement = document.querySelector('#display') // select the parent DOM element

// The display id and access token you received from Hubstairs™
const options = {
  displayid,
  token,
}

// instantiate the Display
const display = new Display(domElement, options)

// hook on event
display.on('productClick', product => {
  console.log(`product button clicked for product ${product.code}`)
})

// access to content data
display.getProducts().then(products => {
  console.log('products', products)
})

// call exposed functions
display.nextScene().then(() => {
  console.log('next scene')
})
```

To go further there are [few advanced integration](./docs/ADVANCED_INTEGRATION.md) mode.

## Browser Support

Hubstairs Display Controller library is supported in Edge, Chrome, Firefox, Safari, and Opera.

To use this library, you should polyfill by your own:

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Troubleshooting

Hubstairs Display is an `<iframe />` where source comes from `display.hubstairs.com` so to make sure that it works properly you need to allow the `https://display.hubstairs.com` in your Content Security Policy.

```
Content-Security-Policy: frame-src https://display.hubstairs.com;
```

[draft]: https://img.shields.io/badge/draft-orange
[beta]: https://img.shields.io/badge/beta-blue
[new]: https://img.shields.io/badge/new-green
