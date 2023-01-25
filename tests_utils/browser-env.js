import 'whatwg-fetch'
import jquery from 'jquery'

const html = `<body>
	<div class="multiple">
		<div class="two"></div>
		<div class="one"></div>
	</div>
</body>`

global.jQuery = jquery
document.body.innerHTML = html
