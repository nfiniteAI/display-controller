import 'whatwg-fetch'
import jquery from 'jquery'

const html = `<body>
	<div id="test_display" data-hubstairs-displayid="2"></div>
	<div class="multiple">
		<iframe class="two" src="https://display.hubstairs.com/v1/2"></iframe>
		<iframe class="one" src="https://display.hubstairs.com/v1/1234"></iframe>
	</div>
</body>`

global.jQuery = jquery
document.body.innerHTML = html
