const arrayIndexOfSupport = typeof Array.prototype.indexOf !== 'undefined';
const postMessageSupport = typeof window.postMessage !== 'undefined';

if (!arrayIndexOfSupport || !postMessageSupport) {
    throw new Error('Sorry, the Vimeo Player API is not available in this browser.');
}
