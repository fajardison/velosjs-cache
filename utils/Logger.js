/**
 * Logger adalah utilitas logging sederhana dengan prefix dan level log.
 */
export default class Logger {
  /**
   * Membuat instance Logger.
   * @param {boolean} [enabled=false] - Menentukan apakah log akan ditampilkan.
   * @param {string} [prefix='Store'] - Prefix yang digunakan dalam output log.
   */
  constructor(enabled = false, prefix = 'Store') {
    this.enabled = enabled;
    this.prefix = `[${prefix}]`;
  }

  /**
   * Menampilkan log umum ke console.
   * @param  {...any} args - Argumen yang akan dicetak.
   */
  log(...args) {
    if (this.enabled) console.log(this.prefix, ...args);
  }

  /**
   * Menampilkan log informasi ke console.
   * @param  {...any} args - Argumen yang akan dicetak sebagai info.
   */
  info(...args) {
    if (this.enabled) console.info(this.prefix, '[INFO]', ...args);
  }

  /**
   * Menampilkan peringatan ke console.
   * @param  {...any} args - Argumen yang akan dicetak sebagai peringatan.
   */
  warn(...args) {
    if (this.enabled) console.warn(this.prefix, '[WARN]', ...args);
  }

  /**
   * Menampilkan kesalahan ke console.
   * @param  {...any} args - Argumen yang akan dicetak sebagai error.
   */
  error(...args) {
    if (this.enabled) console.error(this.prefix, '[ERROR]', ...args);
  }
}
