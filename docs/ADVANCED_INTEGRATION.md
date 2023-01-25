# Advanced integration mode ![draft]

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
