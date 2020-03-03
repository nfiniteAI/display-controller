import Player from './player'

test('constructor accepts only Vimeo embeds', () => {
  expect(() => {
    void new Player(
      html`
        <div data-vimeo-initialized><iframe></iframe></div>
      `,
    )
  }).toThrow()

  expect(() => {
    void new Player('string')
  }).toThrow()

  expect(() => {
    void new Player(
      html`
        <iframe></iframe>
      `,
    )
  }).toThrow()

  expect(() => {
    void new Player(
      html`
        <iframe src="https://www.youtube.com/embed/Uj3_KqkI9Zo"></iframe>
      `,
    )
  }).toThrow()
})

test('contructor does not throw if jquery is not present', () => {
  /* eslint-env jquery */
  /* globals jQuery:true */
  const frames = jQuery('iframe')[0]
  const oldJQuery = jQuery

  window.jQuery = jQuery = undefined

  expect(() => {
    void new Player(frames)
  }).not.toThrow()

  jQuery = window.jQuery = oldJQuery
})

test('constructor uses the first element from a jQuery object', () => {
  /* eslint-env jquery */
  const consoleWarnSpy = jest.spyOn(console, 'warn')

  const iframes = jQuery('iframe')
  const player = new Player(iframes)

  expect(consoleWarnSpy).toHaveBeenCalled()
  expect(player.element).toBe(iframes[0])
})

test('constructor does not warn if only one jQuery object', () => {
  /* eslint-env jquery */
  const consoleWarnSpy = jest.spyOn(console, 'warn')

  const div = jQuery('.one')
  const player = new Player(div)

  expect(consoleWarnSpy).toHaveBeenCalled()
  expect(player.element).toBe(div[0])
})

// test.skip('constructor accepts a div without attributes when there is an options object', (t) => {
//     t.notThrows(() => {
//         void new Player(html`<div id="player"></div>`, { id: 76979871 });
//     });
// });
//
// test.skip('constructor finds iframe elements within the provided element', (t) => {
//     const div = html`<div></div>`;
//     const iframe = html`<iframe src="https://player.vimeo.com/video/159195552" width="640" height="360" frameborder="0" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>`;
//     div.appendChild(iframe);
//
//     const player = new Player(div);
//
//     t.ok(player.element === iframe);
// });

// test.skip('constructor gets an element by id if passed a string', (t) => {
//     const element = document.getElementById('test_player');
//     const player = new Player('test_player');
//
//     t.ok(player.element === element);
// });

test('constructor returns the same player object for the same element', () => {
  const iframe = document.querySelector('.one')
  const player1 = new Player(iframe)
  const player2 = new Player(iframe)

  expect(player1).toBe(player2)
})

test('constructing a player with a bad URI should fail', async () => {
  const player1 = new Player(
    html`
      <div data-vimeo-id="1"></div>
    `,
  )
  await expect(player1.ready()).rejects.toThrow()
})

test('future calls to destroyed player should not not work', async () => {
  expect.assertions(4)

  const player1 = new Player(
    html`
      <iframe id="to-destroy" src="https://player.vimeo.com/video/76979871"></iframe>
    `,
  )

  await expect(player1.destroy()).resolves.toBeUndefined()
  expect(document.querySelector('#to-destroy')).toBeFalsy()

  await expect(player1.ready()).rejects.toThrow()
  await expect(player1.loadVideo(1)).rejects.toThrow()
})

test('player object includes all api methods', () => {
  const iframe = document.querySelector('.one')
  const player = new Player(iframe)

  expect(typeof player.get).toBe('function')
  expect(typeof player.set).toBe('function')
  expect(typeof player.callMethod).toBe('function')
  expect(typeof player.on).toBe('function')
  expect(typeof player.off).toBe('function')
  expect(typeof player.loadVideo).toBe('function')
  expect(typeof player.enableTextTrack).toBe('function')
  expect(typeof player.disableTextTrack).toBe('function')
  expect(typeof player.pause).toBe('function')
  expect(typeof player.play).toBe('function')
  expect(typeof player.unload).toBe('function')
  expect(typeof player.getAutopause).toBe('function')
  expect(typeof player.setAutopause).toBe('function')
  expect(typeof player.getColor).toBe('function')
  expect(typeof player.setColor).toBe('function')
  expect(typeof player.getCurrentTime).toBe('function')
  expect(typeof player.setCurrentTime).toBe('function')
  expect(typeof player.getDuration).toBe('function')
  expect(typeof player.getEnded).toBe('function')
  expect(typeof player.getLoop).toBe('function')
  expect(typeof player.setLoop).toBe('function')
  expect(typeof player.getPaused).toBe('function')
  expect(typeof player.getPlaybackRate).toBe('function')
  expect(typeof player.setPlaybackRate).toBe('function')
  expect(typeof player.getTextTracks).toBe('function')
  expect(typeof player.getVideoEmbedCode).toBe('function')
  expect(typeof player.getVideoId).toBe('function')
  expect(typeof player.getVideoTitle).toBe('function')
  expect(typeof player.getVideoWidth).toBe('function')
  expect(typeof player.getVideoHeight).toBe('function')
  expect(typeof player.getVideoUrl).toBe('function')
  expect(typeof player.getVolume).toBe('function')
  expect(typeof player.setVolume).toBe('function')
  expect(typeof player.getBuffered).toBe('function')
  expect(typeof player.getPlayed).toBe('function')
  expect(typeof player.getSeekable).toBe('function')
  expect(typeof player.getSeeking).toBe('function')
  expect(typeof player.getMuted).toBe('function')
  expect(typeof player.setMuted).toBe('function')
})

test('set requires a value', async () => {
  expect.assertions(1)
  const iframe = document.querySelector('.one')
  const player = new Player(iframe)

  try {
    await player.set('color')
  } catch (err) {
    expect(err).toBeInstanceOf(TypeError)
  }
})

test('on requires an event and a callback', () => {
  const iframe = document.querySelector('.one')
  const player = new Player(iframe)

  expect(() => player.on()).toThrowError(TypeError)
  expect(() => player.on('play')).toThrowError(TypeError)
  expect(() => player.on('play', 'string')).toThrowError(TypeError)
  expect(() => player.on('play', () => {})).not.toThrow()
})

test('off requires an event name, and the optional callback must be a function', () => {
  const iframe = document.querySelector('.one')
  const player = new Player(iframe)

  expect(() => player.off()).toThrowError(TypeError)
  expect(() => player.off('play', 'string')).toThrowError(TypeError)
  expect(() => player.off('play', () => {})).not.toThrow()
})
