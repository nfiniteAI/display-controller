# Hubstairs display API

The Hubstairs display API allows you to interact with and control an embedded Hubstairs
Display.

## Installation

You can install the Hubstairs Display API through either npm:

```bash
npm install @hubstairs/display-controller
#or yarn
yarn add @hubstairs/display-controller
```

Alternatively, you can reference an up‐to‐date version on unpkg (UMD build):

```html
<script src="https://unpkg.com/@hubstairs/display-controller@1"></script>
```

## Getting Started

In order to control the Hubstairs display, you need a display to control. There are a
few ways to get a display:

### Pre-existing display

Already have a display on the page? Pass the element to the `Display`
constructor and you’re ready to go.

> ⚠ This mode is incompatible with [`responsive` mode](#embed-options)

```html
<iframe
  src="https://display.hubstairs.com/v1/76979871"
  width="640"
  height="360"
  frameborder="0"
  allowfullscreen
  allow="autoplay; encrypted-media"
></iframe>

<script>
  import Display from '@hubstairs/display-controller'

  const iframe = document.querySelector('iframe')
  const display = new Display(iframe)

  display.on('addToCart', function (product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })

  display.getProducts().then(function (products) {
    console.log('products:', products)
  })
</script>
```

### Create with a display id or url

You can use the library to make the embed for you. All you need is an empty
element and the display id or display.hubstairs.com url (and optional
[embed options](#embed-options)).

```html
<div id="made-in-paris"></div>

<script>
  import Display from '@hubstairs/display-controller'

  const options = {
    displayid: 59777392,
  }

  const display = new Display('made-in-paris', options)

  display.on('addToCart', function (product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })
</script>
```

### Automatically with HTML attributes

When the library loads, it will scan your page for elements with Hubstairs
attributes. Each element must have at least a `data-hubstairs-displayid` or
`data-hubstairs-url` attribute in order for the embed to be created automatically.
You can also add attributes for any of the [embed options](#embed-options),
prefixed with `data-hubstairs`.

> ⚠ This mode is not recommended with virtual/shadow DOM

```html
<div data-hubstairs-displayid="5e417dbac5d2651adbe509ec" id="display"></div>
<div data-hubstairs-url="https://display.hubstairs.com/v1/76979871" id="displaytwo"></div>

<script>
  import Display from '@hubstairs/display-controller'
  // If you want to control the embeds, you’ll need to create a Display object.
  // You can pass either the `<div>` or the `<iframe>` created inside the div.
  const display = new Display('display')
  display.on('addToCart', function (product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })

  const displayTwo = new Display('displaytwo')
  displayTwo.on('addToCart', function (product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })
</script>
```

## Browser Support

The Display controller API library is supported in IE 11+, Chrome, Firefox, Safari, and
Opera.

To use this library, You should polyfill by your own:

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Using with CDN version

If you’re using the CDN version of the libray (UMD build), the display controller is exposed on the `window` object as `Hubstairs.Display`
constructor (unlike the browser where it is attached to `window.Hubstairs`):

```html
<div id="display"></div>
<script src="https://unpkg.com/@hubstairs/display-controller@1"></script>
<script>
  const display = new Hubstairs.Display('display', {
    displayid: '5e417dbac5d2651adbe509ec',
  })

  display.on('addToCart', function (product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })
</script>
```

## Table of Contents

- [Create a Display](#create-a-display)
- [Methods](#methods)
  - [on](#onevent-string-callback-function-void)
  - [off](#offevent-string-callback-function-void)
  - [ready](#ready-promisevoid-error)
  - [nextScene](#nextscene-promisevoid-error)
  - [destroy](#destroy-promisevoid-error)
  - [setConfig](#setconfigconfig-object-promiseobject-error)
  - [getProducts](#getproducts-promiseobject-error)
- [Events](#events)
  - [addToCart](#addToCart)
  - [clickProduct](#clickProduct)
- [Embed Options](#embed-options)

## Create a Display

The `Hubstairs.Display` object wraps an iframe so you can interact with and control a
Hubstairs Display embed.

### Existing embed

If you already have a Hubstairs Display `<iframe>` on your page, pass that element into the
constructor to get a `Display` object. You can also use jQuery to select the
element, or pass a string that matches the `id` of the `<iframe>`.

```js
import Display from '@hubstairs/display-controller'

// Select with the DOM API
const iframe = document.querySelector('iframe')
const iframeDisplay = new Display(iframe)

// Select with jQuery
// If multiple elements are selected, it will use the first element.
const jqueryDisplay = new Display($('iframe'))

// Select with the `<iframe>`’s id
// Assumes that there is an <iframe id="displayone"> on the page.
const idDisplay = new Display('displayone')
```

### Create an embed

Pass any element and an options object to the `Hubstairs.Display` constructor to make
an embed inside that element. The options object should consist of either an
`displayid` or `url` and any other [embed options](#embed-options) for the embed.

```html
<div id="made-in-paris"></div>

<script>
  import Display from '@hubstairs/display-controller'

  const options = {
    displayid: '5e417dbac5d2651adbe509ec',
  }

  // Will create inside the made-in-paris div:
  // <iframe src="https://display.hubstairs.com/v1/59777392" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
  const madeInParis = new Display('made-in-paris', options)
</script>
```

Embed options will also be read from the `data-hubstairs-*` attributes. Attributes on the element will override any defined in the options object passed to the constructor (similar to how the `style` attribute overrides styles defined in CSS).

Elements with a `data-hubstairs-displayid` or `data-hubstairs-url` attribute will have embeds created automatically when the display API library is loaded. You can use the `data-hubstairs-defer` attribute to prevent that from happening and create the embed at a later time. This is useful for situations where the controller embed wouldn’t be visible right away, but only after some action was taken by the user (a lightbox opened from clicking on a thumbnail, for example).

```html
<div data-hubstairss-displayid="5e417dbac5d2651adbe509ec" data-hubstairs-defer id="made-in-paris"></div>
<div
  data-hubstairss-displayid="5e417dbac5d2651adbe509ec"
  data-hubstairs-defer
  data-hubstairs-width="500"
  id="display"
></div>

<script>
  import Display from '@hubstairs/display-controller'

  const options = {
    width: 640,
  }

  // Will create inside the made-in-paris div:
  // <iframe src="https://display.hubstairs.com/v1/5e417dbac5d2651adbe509ec" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
  const madeInParis = new Display('made-in-paris', options)

  // Will create inside the display div:
  // <iframe src="https://display.hubstairs.com/v1/19231868?5e417dbac5d2651adbe509ec" width="500" height="281" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
  const display = new Display(document.getElementById('display'), options)
</script>
```

## Methods

You can call methods on the display controller by calling the function on the Display object:

```js
display.nextScene()
```

All methods, except for `on()` and `off()` return a Promise. The Promise may or may not resolve with a value, depending on the specific method.

```js
display
  .nextScene()
  .then(function () {
    // the next scene is displayed
  })
  .catch(function (error) {
    // an error occurred
  })
```

Promises for getters are resolved with the value of the property:

```js
display.getProducts().then(function (products) {})
```

Promises for setters are resolved with the value set, or rejected with an error if the set fails. For example:

```js
display
  .setConfig({ gui: 'hash' })
  .then(function (config) {
    // the config was set
  })
  .catch(function (error) {
    // an error occurred setting the color
  })
```

### on(event: string, callback: function): void

Add an event listener for the specified event. Will call the callback with a single parameter, `data`, that contains the data for that event. See
[events](#events) below for details.

```js
function onAddToCart(data) {
  // data is an object containing properties specific to that event
}

display.on('addToCart', onAddToCart)
```

### off(event: string, callback?: function): void

Remove an event listener for the specified event. Will remove all listeners for that event if a `callback` isn’t passed, or only that specific callback if it is passed.

```js
function onAddToCart(data) {
  // data is an object containing properties specific to that event
}

display.on('addToCart', onAddToCart)

// If later on you decide that you don’t need to listen for play anymore.
display.off('addToCart', onAddToCart)

// Alternatively, `off` can be called with just the event name to remove all listeners.
display.off('addToCart')
```

### ready(): Promise&lt;void, Error&gt;

Trigger a function when the display iframe has initialized. You do not need to
wait for `ready` to trigger to begin adding event listeners or calling other
methods.

```js
display.ready().then(function () {
  // the controller is ready
})
```

### nextScene(): Promise&lt;void, (Error)&gt;

Display the next scene

```js
display
  .nextScene()
  .then(function () {
    // the next scene is displayed
  })
  .catch(function (error) {
    // error
  })
```

### destroy(): Promise&lt;void, Error&gt;

Cleanup the display and remove it from the DOM.

It won't be usable and a new one should be constructed
in order to do any operations.

```js
display
  .destroy()
  .then(function () {
    // the display was destroyed
  })
  .catch(function (error) {
    // an error occurred
  })
```

### getProducts(): Promise&lt;object[], (Error)&gt;

Get all the products displayed in the scene

```js
display
  .getProducts()
  .then(function (products) {
    // products
  })
  .catch(function (error) {
    // error
  })
```

### setConfig(config: object): Promise&lt;object, (Error)&gt;

Set the configuration

```js
display
  .setConfig({ gui: 'hash' })
  .then(function (config) {
    // configuration is set
  })
  .catch(function (error) {
    // error
  })
```

## Events

You can listen for events in the display by attaching a callback using `.on()`:

```js
display.on('eventName', function (data) {
  // data is an object containing properties specific to that event
})
```

To remove a listener, call `.off()` with the callback function:

```js
function callback() {}

display.off('eventName', callback)
```

If you pass only an event name, all listeners for that event will be removed.

### addToCart

Triggered when the a addToCart button is clicked, returns a product

```js
{
  code: 1234
}
```

### clickProduct

Triggered when a product is clicked, returns a product

```js
{
  code: 1234
}
```

### error

Triggered when some kind of error is generated in the display controller. In general if you
are using this API library, you should use `.catch()` on each method call
instead of globally listening for error events.

If the error was generated from a method call, the name of that method will be
included.

```js
{
  message: '#984220 does not meet minimum contrast ratio. We recommend using brighter colors. (You could try #d35e30 instead.) See WCAG 2.0 guidelines: http://www.w3.org/TR/WCAG/#visual-audio-contrast'
  method: 'setColor'
  name: 'ContrastError'
}
```

## Embed Options

These options are available to use as `data-hubstairs-` attributes on elements or as
an object passed to the `Hubstairs.Display` constructor

> camel cased options must be convert in kebab cased to use them in element (eg: `displayUrl` --> `data-hubstairs-display-url`)

| option             | default                             | description                                                                                              |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| displayid _or_ url |                                     | **Required.** Either the id or the url of the Hubstairs Display.                                         |
| responsive         | `true` (if no width and height set) | Resize according their parent element, this parameter is incompatible with height and width parameters   |
| height             |                                     | The exact height of the display. Defaults to the height of the largest available version of the display. |
| width              |                                     | The exact width of the display. Defaults to the width of the largest available version of the display.   |
| displayUrl         | `https://display.hubstairs.com`     | Override the generated base url for display (useful in development mode).                                |
| oembedUrl          | `https://api.hubstairs.com/oembed`  | Override the generated base url for oembed api (useful in development mode).                             |
