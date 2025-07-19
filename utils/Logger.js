/**
 * Logger is a simple utility for conditional logging with prefix and log levels.
 */
export default class Logger {
  /**
   * Creates a Logger instance.
   * @param {boolean} [enabled=false] - Whether logging is enabled.
   * @param {string} [prefix='Store'] - Prefix for all log outputs.
   */
  constructor(enabled = false, prefix = 'Store') {
    this.enabled = enabled;
    this.prefix = `[${prefix}]`;
  }

  /**
   * Logs general messages to the console.
   * @param  {...any} args - Arguments to log.
   */
  log(...args) {
    if (this.enabled) console.log(this.prefix, ...args);
  }

  /**
   * Logs info-level messages to the console.
   * @param  {...any} args - Arguments to log as info.
   */
  info(...args) {
    if (this.enabled) console.info(this.prefix, '[INFO]', ...args);
  }

  /**
   * Logs warning messages to the console.
   * @param  {...any} args - Arguments to log as warning.
   */
  warn(...args) {
    if (this.enabled) console.warn(this.prefix, '[WARN]', ...args);
  }

  /**
   * Logs error messages to the console.
   * @param  {...any} args - Arguments to log as error.
   */
  error(...args) {
    if (this.enabled) console.error(this.prefix, '[ERROR]', ...args);
  }
}
