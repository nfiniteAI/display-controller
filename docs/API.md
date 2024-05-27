# Display Controller API

- [Constructor](#constructor)
- [Events](#events)
  - [error](#error)
  - [filter](#filter-)
  - [loadScene](#loadscene-)
  - [changeScene](#changescene-)
  - [changeProduct](#changeproduct-)
  - [changeSelectedProductLocation](#changeselectedproductlocation-)
  - [productClick](#productclick-)
- [Functions](#functions)
  - [ready](#ready-promisevoid-error)
  - [destroy](#destroy-promisevoid-error)
  - [setLanguage](#setlanguagelanguage-string-promisestring-error)
  - [nextScene](#nextscene-promisevoid-error-)
  - [setFilter](#setfilterfilter-object-promiseobject-error-)
  - [getProducts](#getproducts-promiseobject-error-)
- [Customization](#customization-)
  - [Styles](#customize-style)
  - [Labels](#customize-labels)

## Constructor

Instantiate a Display with the operator `new`

### Usage

```js
new Display(element: String|Element|JQuery, options?: Object): Display
```

### Parameters

For the given html

```html
<div id="element" />
```

`element` can be:

- an exiting DOM Element, e.g.:

```js
new Display(document.querySelector('#element'), options)
```

- html `id` attribute value, e.g.:

```js
new Display('element', options)
```

- a [jQuery selector](https://jquery.com/), e.g.:

```js
new Display($('#element'), options)
```

`options` is an Object which can take the following values:

| option name                             | default                                  | description                                                                                                 |
|-----------------------------------------|------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| displayid _or_ url                      |                                          | **Required.** Either the id or the url of the nfinite Display.                                              |
| token                                   |                                          | **Required.** Token generated in my.nfinite.app (in the service user section).                              |
| productcode                             |                                          | Load scenes where the product is visible (identified by its code). Only available for "Product Focus"       |
| responsive                              | `true` (if no width and height set)      | Resize according to its parent element, this parameter is incompatible with `height` and `width` parameters |
| height                                  |                                          | The exact height of the Display. Defaults to the height of the largest available version of the Display.    |
| width                                   |                                          | The exact width of the Display. Defaults to the width of the largest available version of the Display.      |
| displayUrl                              | `https://display.nfinite.app`            | Override the generated base url for the Display (useful in development mode).                               |
| oembedUrl                               | `https://display.nfinite.app/api/oembed` | Override the generated base url for oembed api (useful in development mode).                                |
| language                                | default language set in my.nfinite.app   | One of the defined language in my.nfinite.app (in the platform section).                                    |
| initialProducts ![infinite] ![beta]     |                                          | Permit to set some product codes as default in the Display                                                  |
| initialProductsMode ![infinite] ![beta] | `default`                                | Permit to choose the mode to display products not set in `initialProducts`                                  |
| styles ![model] ![beta]                 |                                          | Override style of customizable elements ([See list](#customize-style))                                      |
| labels ![model] ![beta]                 |                                          | Customize labels (use also for i18n) ([See list](#customize-labels))                                        |

e.g.:

```js
const options = {
  displayid: 'display-id-from-nfinite',
  token: 'access-token-from-nfinite',
}

new Display('element'), options)
```

## Events

To listen to the Display events, use the function `on()`. Then use the `off()` function to stop listening.

```js
const display = new Display(element, options)

display.on(eventName: String, callback: Function): void

display.off(eventName: String, callback?: Function): void
```

Info: You can listen to the same event name multiple times, callbacks will be called in the order that they have been registered. Call `off` method without `callback` to remove all the listeners attached to the event name. If you want to remove a specific callback, you need to pass it as a parameter, e.g.:

```js
display.on('error', callbackOne)
display.on('error', callbackTwo)

display.off('error', callbackOne) // remove only `callbackOne`
display.off('error') // remove all
```

### error

Triggered when an error has occured

On `error`, the callback receives the `error` as argument, e.g.:

```js
display.on('error', error => console.log(scene))
```

### filter ![beta] ![product-focus]

Triggered when a filter has been applied

On `filter`, the callback receives the `new filter` as argument, e.g.:

```js
display.on('filter', filter => console.log(filter))
```

### changeScene ![infinite] ![product-focus]

Triggered when a scene has been changed

On `changeScene`, the callback receives the `new scene` as argument, e.g.:

```js
display.on('changeScene', scene => console.log(scene))
```

### loadScene ![infinite]

Triggered when a scene is loaded

On `loadScene`, the callback receives the `initial scene` as argument, e.g.:

```js
display.on('loadScene', scene => console.log(scene))
```

### changeProduct ![infinite]

Triggered when a product has been changed at a location

On `changeProduct`, the callback receives the `product` as argument, e.g.:

```js
display.on('changeProduct', scene => console.log(product))
```

### changeSelectedProductLocation ![infinite]

Triggered when alternatives products are displayed (marker clicked) or hidden

On `changeSelectedProductLocation`, the callback receives the `{ currentProduct }` as argument (or nothing when it's hidden), e.g.:

```js
display.on('changeSelectedProductLocation', scene => console.log(product))
```

### productClick ![beta] ![infinite] ![product-focus]

Triggered when a product on the scene has been clicked

On `productClick`, the callback receives the `clicked product` as argument, e.g.:

```js
display.on('productClick', product => console.log(product))
```

## Functions

All the following functions return a Promise and it may resolve into a value depending on the function. If an error occurs you can catch it using Promise.catch. e.g.:

```js
display
  .anyAvailableFunction()
  .then(value => {
    // handle resolved value
  })
  .catch(error => {
    // handle error occurred
  })
```

### ready(): Promise&lt;void, Error&gt;

Trigger a function when the Display iframe has been initialized. You can start registering event listeners and call methods before receiving the `"ready"` event.

```js
display.ready().then(() => {
  // the Display is ready
})
```

### destroy(): Promise&lt;void, Error&gt;

Turn off all listeners and remove the Display iframe from the DOM. It will not be usable and a new one should be constructed before making any new operation.

```js
display.destroy().then(() => {
  // the display has been destroyed
})
```

### setLanguage(language: String): Promise&lt;String, (Error)&gt;

Set the language programmatically, e.g.:

```js
display.setLanguage('en-US').then(newLanguage => {
  // new language has been set
})
```

Available languages:

- `en-US`
- `fr-FR`

### nextScene(): Promise&lt;void, (Error)&gt; ![beta]

Render the next scene programmatically.

```js
display.nextScene()
```

### setFilter(filter: Object): Promise&lt;Object, (Error)&gt; ![beta]

Set the filter programmatically, e.g.:

```js
const filter = { value: 'blue', tagCategory: 'wallColors' }
display.setFilter(filter).then(newFilter => {
  // new filter has been applied
})
```

### getProducts(): Promise&lt;Object[], (Error)&gt; ![beta]

Get all the products visible in the scene

```js
display.getProducts().then(products => {
  // products
})
```

## Customization ![model]

#### Customize style

- Use camel-case for css properties

| property name | allowed pseudo-elements | description          |
|---------------|-------------------------|----------------------|
| button        | :hover :focus :outline  | Main button          |
| dimmer        | -                       | Overlay behind modal |
| modal         | -                       | Modal content        |

```js
  const styles = {
    button: {
      padding: '8px',
      border: '1px solid #373944',
      color: '#373944',
      backgroundColor: '#FFFFFF',
    },
    'button:hover': {
      color: '#FFFFFF',
      backgroundColor: '#373944',
    }
  }
  
  new Display('element', { styles })
```

#### Customize labels

| property name      | default                                       | description                             |
|--------------------|-----------------------------------------------|-----------------------------------------|
| button             | See in 3D                                     | Main button                             |
| QRCodeTitle        | See in your room                              | [Desktop] QR code title                 |
| QRCodeDescription  | Scan with your phone to launch the experience | [Desktop] QR code description           |
| buttonAR           | See in my room                                | [Mobile] Button to open AR              |
| buttonARDisabled   | AR is not supported on this device            | [Mobile] Message if AR is not available |

Eg
```js
  const language = navigator.language
  const labels = {
    button: getI18nLabel({ language, label: 'button' }),
    buttonAR: getI18nLabel({ language, label: 'buttonAR' }),
  }
  
  new Display('element', { labels })
```


[beta]: https://img.shields.io/badge/beta-blue
[infinite]: https://img.shields.io/badge/infinite-d1b2ff
[product-focus]: https://img.shields.io/badge/product%20focus-19d1ff
[model]:https://img.shields.io/badge/model-a13a14