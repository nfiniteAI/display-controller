import 'whatwg-fetch'
import jquery from 'jquery'

const html = `<body>
	<div id="test_display" data-hubstairs-displayid="5e417dbac5d2651adbe509ec"></div>
	<div class="multiple">
		<iframe class="two" src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ec"></iframe>
		<iframe class="one" src="https://display.nfinite.app/v1/5e417dbac5d2651adbe509ed"></iframe>
	</div>
</body>`

global.jQuery = jquery
document.body.innerHTML = html
