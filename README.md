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

Alternatively, you can reference an up‐to‐date version on our CDN:

```html
<script src="https://assets.hubstairs.com/display/controller.js"></script>
```

## Getting Started

In order to control the Hubstairs display, you need a display to control. There are a
few ways to get a display:

### Pre-existing display

Already have a player on the page? Pass the element to the `Hubstairs.Controller`
constructor and you’re ready to go.

```html
<iframe
  src="https://display.hubstairs.com/v1/76979871"
  width="640"
  height="360"
  frameborder="0"
  allowfullscreen
  allow="autoplay; encrypted-media"
></iframe>

<script src="https://assets.hubstairs.com/display/controller.js"></script>
<script>
  const iframe = document.querySelector('iframe')
  const display = new Hubstairs.Controller(iframe)

  display.on('addToCart', function(product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })

  display.getProducts().then(function(products) {
    console.log('products:', products)
  })
</script>
```

### Create with a display id or url

You can use the library to make the embed for you. All you need is an empty
element and the display id or display.hubstairs.com url (and optional
[embed options](#embed-options)).

```html
<div id="made-in-parais"></div>

<script src="https://assets.hubstairs.com/display/controller.js"></script>
<script>
  const options = {
    displayId: 59777392,
  }

  const display = new Hubstairs.Controller('made-in-paris', options)

  display.on('addToCart', function(product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })
</script>
```

### Automatically with HTML attributes

When the library loads, it will scan your page for elements with Hubstairs
attributes. Each element must have at least a `data-hubstairs-displayId` or
`data-hubstairs-url` attribute in order for the embed to be created automatically.
You can also add attributes for any of the [embed options](#embed-options),
prefixed with `data-hubstairs`.

```html
<div data-hubstairs-displayId="19231868" id="handstick"></div>
<div data-hubstairs-url="https://display.hubstairs.com/76979871" id="playertwo"></div>

<script src="https://assets.hubstairs.com/display/controller.js"></script>
<script>
  // If you want to control the embeds, you’ll need to create a Player object.
  // You can pass either the `<div>` or the `<iframe>` created inside the div.
  const handstickController = new Hubstairs.Controller('handstick')
  handstickPlayer.on('addToCart', function(product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })

  const controllerTwoController = new Hubstairs.Controller('controllertwo')
  playerTwoPlayer.on('addToCart', function(product) {
    console.log(`addToCart button clicked for product ${product.code}`)
  })
</script>
```

## Browser Support

The Player API library is supported in Chrome, Firefox, Safari, and
Opera.

## Using with a module bundler

If you’re using a module bundler like [webpack](https://webpack.js.org) or
[rollup](http://rollupjs.org/), the exported object will be the Player
constructor (unlike the browser where it is attached to `window.Hubstairs`):

```js
import Controller from '@hubstairs/display-controller'

const controller = new Controller('handstick', {
  displayId: 19231868,
})

controller.on('addToCart', function(product) {
  console.log(`addToCart button clicked for product ${product.code}`)
})
```

## Table of Contents

- [Create a Controller](#create-a-player)
- [Methods](#methods)
  - [on](#onevent-string-callback-function-void)
  - [off](#offevent-string-callback-function-void)
  - [loadVideo](#loadvideooptions-numberobject-promisenumberobject-typeerrorpassworderrorerror)
  - [ready](#ready-promisevoid-error)
  - [enableTextTrack](#enabletexttracklanguage-string-kind-string-promiseobject-invalidtracklanguageerrorinvalidtrackerrorerror)
  - [disableTextTrack](#disabletexttrack-promisevoid-error)
  - [pause](#pause-promisevoid-passworderrorprivacyerrorerror)
  - [play](#play-promisevoid-passworderrorprivacyerrorerror)
  - [unload](#unload-promisevoid-error)
  - [destroy](#destroy-promisevoid-error)
  - [getAutopause](#getautopause-promiseboolean-unsupportederrorerror)
  - [setAutopause](#setautopauseautopause-boolean-promiseboolean-unsupportederrorerror)
  - [getBuffered](#getbuffered-promisearray-error)
  - [getColor](#getcolor-promisestring-error)
  - [setColor](#setcolorcolor-string-promisestring-contrasterrortypeerrorerror)
  - [addCuePoint](#addcuepointtime-number-data-object-promisestring-unsupportederrorrangeerrorerror)
  - [removeCuePoint](#removecuepointid-string-promisestring-unsupportederrorinvalidcuepointerror)
  - [getCuePoints](#getcuepoints-promisearray-unsupportederrorerror)
  - [getCurrentTime](#getcurrenttime-promisenumber-error)
  - [setCurrentTime](#setcurrenttimeseconds-number-promisenumber-rangeerrorerror)
  - [getDuration](#getduration-promisenumber-error)
  - [getEnded](#getended-promiseboolean-error)
  - [getLoop](#getloop-promiseboolean-error)
  - [setLoop](#setlooploop-boolean-promiseboolean-error)
  - [getMuted](#getmuted-promiseboolean-error)
  - [setMuted](#setmuted-boolean-promiseboolean-error)
  - [getPaused](#getpaused-promiseboolean-error)
  - [getPlaybackRate](#getplaybackrate-promisenumber-error)
  - [setPlaybackRate](#setplaybackrateplaybackrate-number-promisenumber-rangeerrorerror)
  - [getPlayed](#getplayed-promisearray-error)
  - [getSeekable](#getseekable-promisearray-error)
  - [getSeeking](#getseeking-promiseboolean-error)
  - [getTextTracks](#gettexttracks-promiseobject-error)
  - [getVideoEmbedCode](#getvideoembedcode-promisestring-error)
  - [getVideoId](#getvideoid-promisenumber-error)
  - [getVideoTitle](#getvideotitle-promisestring-error)
  - [getVideoWidth](#getvideowidth-promisenumber-error)
  - [getVideoHeight](#getvideoheight-promisenumber-error)
  - [getVideoUrl](#getvideourl-promisestring-privacyerrorerror)
  - [getVolume](#getvolume-promisenumber-error)
  - [setVolume](#setvolumevolume-number-promisenumber-rangeerrorerror)
- [Events](#events)
  - [play](#play)
  - [pause](#pause)
  - [ended](#ended)
  - [timeupdate](#timeupdate)
  - [progress](#progress)
  - [seeking](#seeking)
  - [seeked](#seeked)
  - [texttrackchange](#texttrackchange)
  - [cuechange](#cuechange)
  - [cuepoint](#cuepoint)
  - [volumechange](#volumechange)
  - [playbackratechange](#playbackratechange)
  - [bufferstart](#bufferstart)
  - [bufferend](#bufferend)
  - [error](#error)
  - [loaded](#loaded)
  - [durationchange](#durationchange)
- [Embed Options](#embed-options)

## Create a Player

The `Hubstair.Controller` object wraps an iframe so you can interact with and control a
Hubsstairs Display embed.

### Existing embed

If you already have a Hubstairs Display `<iframe>` on your page, pass that element into the
constructor to get a `Controller` object. You can also use jQuery to select the
element, or pass a string that matches the `id` of the `<iframe>`.

```js
// Select with the DOM API
var iframe = document.querySelector('iframe')
var iframeController = new Hubstairs.Controller(iframe)

// Select with jQuery
// If multiple elements are selected, it will use the first element.
var jqueryController = new Hubstairs.Controller($('iframe'))

// Select with the `<iframe>`’s id
// Assumes that there is an <iframe id="controller1"> on the page.
var idController = new Hubstairs.Controller('controller1')
```

### Create an embed

Pass any element and an options object to the `Hubstairs.Controller` constructor to make
an embed inside that element. The options object should consist of either an
`displayId` or `url` and any other [embed options](#embed-options) for the embed.

```html
<div id="made-in-paris"></div>

<script src="https://assets.hubstairs.com/display/controller.js"></script>
<script>
  var options = {
    displayId: 59777392,
  }

  // Will create inside the made-in-paris div:
  // <iframe src="https://display.hubstairs.com/v1/59777392" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
  var madeInParis = new Hubstairs.Controller('made-in-paris', options)
</script>
```

Embed options will also be read from the `data-vimeo-*` attributes. Attributes
on the element will override any defined in the options object passed to the
constructor (similar to how the `style` attribute overrides styles defined in
CSS).

Elements with a `data-vimeo-id` or `data-vimeo-url` attribute will have embeds
created automatically when the player API library is loaded. You can use the
`data-vimeo-defer` attribute to prevent that from happening and create the embed
at a later time. This is useful for situations where the player embed wouldn’t
be visible right away, but only after some action was taken by the user (a
lightbox opened from clicking on a thumbnail, for example).

```html
<div data-vimeo-id="59777392" data-vimeo-defer id="made-in-ny"></div>
<div data-vimeo-id="19231868" data-vimeo-defer data-vimeo-width="500" id="handstick"></div>

<script src="https://player.vimeo.com/api/player.js"></script>
<script>
  var options = {
    width: 640,
    loop: true,
  }

  // Will create inside the made-in-ny div:
  // <iframe src="https://player.vimeo.com/video/59777392?loop=1" width="640" height="360" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
  var madeInNy = new Vimeo.Player('made-in-ny', options)

  // Will create inside the handstick div:
  // <iframe src="https://player.vimeo.com/video/19231868?loop=1" width="500" height="281" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
  var handstick = new Vimeo.Player(document.getElementById('handstick'), options)
</script>
```

## Methods

You can call methods on the player by calling the function on the Player object:

```js
player.play()
```

All methods, except for `on()` and `off()` return a
[Promise](http://www.html5rocks.com/en/tutorials/es6/promises/). The Promise may
or may not resolve with a value, depending on the specific method.

```js
player
  .disableTextTrack()
  .then(function() {
    // the track was disabled
  })
  .catch(function(error) {
    // an error occurred
  })
```

Promises for getters are resolved with the value of the property:

```js
player.getLoop().then(function(loop) {
  // whether or not the player is set to loop
})
```

Promises for setters are resolved with the value set, or rejected with an error
if the set fails. For example:

```js
player
  .setColor('#00adef')
  .then(function(color) {
    // the color that was set
  })
  .catch(function(error) {
    // an error occurred setting the color
  })
```

### on(event: string, callback: function): void

Add an event listener for the specified event. Will call the callback with a
single parameter, `data`, that contains the data for that event. See
[events](#events) below for details.

```js
var onPlay = function(data) {
  // data is an object containing properties specific to that event
}

player.on('play', onPlay)
```

### off(event: string, callback?: function): void

Remove an event listener for the specified event. Will remove all listeners for
that event if a `callback` isn’t passed, or only that specific callback if it is
passed.

```js
var onPlay = function(data) {
  // data is an object containing properties specific to that event
}

player.on('play', onPlay)

// If later on you decide that you don’t need to listen for play anymore.
player.off('play', onPlay)

// Alternatively, `off` can be called with just the event name to remove all
// listeners.
player.off('play')
```

### ready(): Promise&lt;void, Error&gt;

Trigger a function when the player iframe has initialized. You do not need to
wait for `ready` to trigger to begin adding event listeners or calling other
methods.

```js
player.ready().then(function() {
  // the player is ready
})
```

### play(): Promise&lt;void, (PasswordError|PrivacyError|Error)&gt;

Play the video if it’s paused. **Note:** on iOS and some other mobile devices,
you cannot programmatically trigger play. Once the viewer has tapped on the play
button in the player, however, you will be able to use this function.

```js
player
  .play()
  .then(function() {
    // the video was played
  })
  .catch(function(error) {
    switch (error.name) {
      case 'PasswordError':
        // the video is password-protected and the viewer needs to enter the
        // password first
        break

      case 'PrivacyError':
        // the video is private
        break

      default:
        // some other error occurred
        break
    }
  })
```

### destroy(): Promise&lt;void, Error&gt;

Cleanup the player and remove it from the DOM.

It won't be usable and a new one should be constructed
in order to do any operations.

```js
player
  .destroy()
  .then(function() {
    // the player was destroyed
  })
  .catch(function(error) {
    // an error occurred
  })
```

### getAutopause(): Promise&lt;boolean, (UnsupportedError|Error)&gt;

Get the autopause behavior for this player.

```js
player
  .getAutopause()
  .then(function(autopause) {
    // autopause = whether autopause is turned on or off
  })
  .catch(function(error) {
    switch (error.name) {
      case 'UnsupportedError':
        // Autopause is not supported with the current player or browser
        break

      default:
        // some other error occurred
        break
    }
  })
```

### setAutopause(autopause: boolean): Promise&lt;boolean, (UnsupportedError|Error)&gt;

Enable or disable the autopause behavior of this player. By default, when
another video is played in the same browser, this player will automatically
pause. Unless you have a specific reason for doing so, we recommend that you
leave autopause set to the default (`true`).

```js
player
  .setAutopause(false)
  .then(function(autopause) {
    // autopause was turned off
  })
  .catch(function(error) {
    switch (error.name) {
      case 'UnsupportedError':
        // Autopause is not supported with the current player or browser
        break

      default:
        // some other error occurred
        break
    }
  })
```

## Events

You can listen for events in the player by attaching a callback using `.on()`:

```js
player.on('eventName', function(data) {
  // data is an object containing properties specific to that event
})
```

The events are equivalent to the HTML5 video events (except for `cuechange`,
which is slightly different).

To remove a listener, call `.off()` with the callback function:

```js
var callback = function() {}

player.off('eventName', callback)
```

If you pass only an event name, all listeners for that event will be removed.

### play

Triggered when the video plays.

```js
{
  duration: 61.857
  percent: 0
  seconds: 0
}
```

### error

Triggered when some kind of error is generated in the player. In general if you
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

These options are available to use as `data-vimeo-` attributes on elements or as
an object passed to the `Vimeo.Player` constructor. More information on embed options can be found in the [Vimeo Help Center](https://help.vimeo.com/hc/en-us/articles/360001494447-Using-Player-Parameters).

| option      | default  | description                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id _or_ url |          | **Required.** Either the id or the url of the video.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| autopause   | `true`   | Pause this video automatically when another one plays.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| autoplay    | `false`  | Automatically start playback of the video. Note that this won’t work on some devices.                                                                                                                                                                                                                                                                                                                                                                                   |
| background  | `false`  | Enable the player's background mode which hides the controls, autoplays and loops the video (available to Plus, PRO, or Business members).                                                                                                                                                                                                                                                                                                                              |
| byline      | `true`   | Show the byline on the video.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| color       | `00adef` | Specify the color of the video controls. Colors may be overridden by the embed settings of the video.                                                                                                                                                                                                                                                                                                                                                                   |
| controls    | `true`   | This parameter will hide all elements in the player (play bar, sharing buttons, etc) for a chromeless experience. ⚠️Warning: When using this parameter, the play bar and UI will be hidden. To start playback for your viewers, you'll need to either enable autoplay or use our player SDK to start and control playback. (available to Plus, PRO, or Business members)                                                                                                |
| dnt         | `false`  | Block the player from tracking any session data, including cookies.                                                                                                                                                                                                                                                                                                                                                                                                     |
| height      |          | The exact height of the video. Defaults to the height of the largest available version of the video.                                                                                                                                                                                                                                                                                                                                                                    |
| loop        | `false`  | Play the video again when it reaches the end.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| responsive  | `false`  | Resize according their parent element (experimental)                                                                                                                                                                                                                                                                                                                                                                                                                    |
| maxheight   |          | Same as height, but video will not exceed the native size of the video.                                                                                                                                                                                                                                                                                                                                                                                                 |
| maxwidth    |          | Same as width, but video will not exceed the native size of the video.                                                                                                                                                                                                                                                                                                                                                                                                  |
| muted       | `false`  | Mute this video on load. Required to autoplay in certain browsers.                                                                                                                                                                                                                                                                                                                                                                                                      |
| playsinline | `true`   | Play video inline on mobile devices, to automatically go fullscreen on playback set this parameter to `false`.                                                                                                                                                                                                                                                                                                                                                          |
| portrait    | `true`   | Show the portrait on the video.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| quality     |          | Vimeo Plus, PRO, and Business members can default an embedded video to a specific quality on desktop. Possible values: `4K`, `2K`, `1080p`, `720p`, `540p`, `360p` and `240p` https://help.vimeo.com/hc/en-us/articles/224983008-Setting-default-quality-for-embedded-videos                                                                                                                                                                                            |
| speed       | `false`  | Show the speed controls in the preferences menu and enable playback rate API (available to PRO and Business accounts).                                                                                                                                                                                                                                                                                                                                                  |
| texttrack   |          | Turn captions/subtitles on for a specific language by default. If you enter a language preference that hasn't yet been uploaded for your particular video, the text track parameter will be ignored, and your embedded video may load with CC or subtitles disabled by default. Supports lowercase language code (such as: `fr`, `es`, `de`, `en`). You can find a full list of popular language codes [here](https://www.andiamo.co.uk/resources/iso-language-codes/). |
| title       | `true`   | Show the title on the video.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| transparent | `true`   | The responsive player and transparent background are enabled by default, to disable set this parameter to `false`.                                                                                                                                                                                                                                                                                                                                                      |
| width       |          | The exact width of the video. Defaults to the width of the largest available version of the video.                                                                                                                                                                                                                                                                                                                                                                      |
