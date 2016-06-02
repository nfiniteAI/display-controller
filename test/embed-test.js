import test from 'ava';
import html from './helpers/html';
import { getOEmbedParameters, getOEmbedData, createEmbed } from '../src/lib/embed';

test('getOEmbedParameters retrieves the params from data attributes', (t) => {
    const el = html`<div data-vimeo-id="2" data-vimeo-width="640" data-vimeo-autoplay></div>`;
    t.deepEqual(getOEmbedParameters(el), {
        id: '2',
        width: '640',
        autoplay: 1
    });
});

test('getOEmbedParameters builds off of a defaults object', (t) => {
    const el = html`<div data-vimeo-id="2" data-vimeo-width="640" data-vimeo-autoplay></div>`;
    t.deepEqual(getOEmbedParameters(el, { loop: true }), {
        id: '2',
        width: '640',
        autoplay: 1,
        loop: true
    });
});

test('getOEmbedData doesn’t operate on non-Vimeo urls', (t) => {
    t.plan(1);
    t.throws(getOEmbedData('https://notvimeo.com'), TypeError);
});

test('createEmbed should throw if there’s no element', (t) => {
    t.throws(() => {
        createEmbed({ html: 'html' });
    }, TypeError);
});

test('createEmbed returns the already-initialized iframe', (t) => {
    const container = html`<div data-vimeo-initialized></div>`;
    const iframe = html`<iframe src="https://player.vimeo.com/2"></iframe>`;
    container.appendChild(iframe);
    t.deepEqual(createEmbed({ html: 'html' }, container), iframe);
});

test('createEmbed makes an iframe from the oembed data', (t) => {
    const container = html`<div></div>`;
    const markup = '<iframe src="https://player.vimeo.com/2"></iframe>';

    const embed = createEmbed({ html: markup }, container);
    t.true(container.getAttribute('data-vimeo-initialized') === 'true');
    t.deepEqual(embed.outerHTML, html`<iframe src="https://player.vimeo.com/2"></iframe>`.outerHTML);
});
