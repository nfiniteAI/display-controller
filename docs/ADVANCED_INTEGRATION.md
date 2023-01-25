# Advanced integration mode ![draft]

## Pre-existing Display

Already have a Display on the page? Pass the iframe to the Display constructor and you are ready to go.

> ⚠ This mode is incompatible with [`responsive` option](API.md#constructor)

```html
<iframe
  src="https://display.nfinite.com/v1/{displayId}"
  width="640"
  height="360"
  frameborder="0"
  allow="fullscreen;"
  allowfullscreen
  mozallowfullscreen="true"
  webkitallowfullscreen="true"
></iframe>

<script>
  import Display from '@hubstairs/display-js'

  const iframe = document.querySelector('iframe')
  const display = new Display(iframe)
</script>
```

## Using a CDN

If you are using the CDN version of the libray (UMD build), the Display Controller is exposed on the `window` object as `Hubstairs.Controller`.

```html
<div id="display" />
<script src="https://unpkg.com/@hubstairs/display-js@1"></script>
<script>
  const display = new Hubstairs.Controller('display', {
    displayid: '5e417dbac5d2651adbe509ec',
  })
</script>
```

[draft]: https://img.shields.io/badge/draft-orange
