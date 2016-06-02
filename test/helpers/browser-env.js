/* eslint-env node */
import jsdom from 'jsdom';

const html = `<body>
	<div id="test_player" data-vimeo-id="2"></div>
	<div class="multiple">
		<iframe class="two" src="https://player.vimeo.com/video/2"></iframe>
		<iframe src="https://player.vimeo.com/video/76979871"></iframe>
	</div>
</body>`;

global.document = jsdom.jsdom(html);
global.window = document.defaultView;
global.navigator = window.navigator;
global.window.jQuery = global.jQuery = require('jquery');
