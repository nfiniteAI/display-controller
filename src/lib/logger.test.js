import { logger } from './logger'

const prefix = '[Hubstairs controller]'

describe('logger', () => {
  test('prefixes all the messages', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const consoleWarnSpy = jest.spyOn(console, 'warn')
    const consoleInfoSpy = jest.spyOn(console, 'info')
    const consoleLogSpy = jest.spyOn(console, 'log')
    logger.error('error')
    logger.warn('warn')
    logger.info('info')
    logger.log('log')
    expect(consoleErrorSpy).toHaveBeenCalledWith(prefix, 'error')
    expect(consoleWarnSpy).toHaveBeenCalledWith(prefix, 'warn')
    expect(consoleInfoSpy).toHaveBeenCalledWith(prefix, 'info')
    expect(consoleLogSpy).toHaveBeenCalledWith(prefix, 'log')
  })

  test('logs an error message with logger.error', () => {
    const consoleSpy = jest.spyOn(console, 'error')
    logger.error('error')
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('logs a warning message with logger.warn', () => {
    const consoleSpy = jest.spyOn(console, 'warn')
    logger.warn('warn')
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('logs an info message with logger.info', () => {
    const consoleSpy = jest.spyOn(console, 'info')
    logger.info('info')
    expect(consoleSpy).toHaveBeenCalled()
  })

  test('logs an info message with logger.log', () => {
    const consoleSpy = jest.spyOn(console, 'log')
    logger.log('log')
    expect(consoleSpy).toHaveBeenCalled()
  })
})
