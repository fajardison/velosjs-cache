/**
 * Cleaner automatically removes expired cache entries at a fixed interval.
 */
export class Cleaner {
  /**
   * Creates a new Cleaner instance.
   * @param {Object} store - The cache store, must implement getEntries() and delete().
   * @param {Object|null} [logger=null] - Optional logger with a log() method.
   */
  constructor(store, logger = null) {
    this.store = store;
    this.logger = logger;
    this.interval = null;
  }

  /**
   * Starts the auto-cleaning process.
   * @param {number} [interval=60000] - Interval in milliseconds between each cleaning cycle.
   */
  start(interval = 60000) {
    if (this.interval) return;

    this.interval = setInterval(() => {
      for (const [key, entry] of this.store.getEntries()) {
        if (typeof entry.isExpired === 'function' && entry.isExpired()) {
          this.logger?.log(`[Cleaner] Removing expired cache entry: ${key}`);
          this.store.delete(key);
        }
      }
    }, interval);

    this.logger?.log(`[Cleaner] Auto-clean started. Running every ${interval / 1000} seconds.`);
  }

  /**
   * Stops the auto-cleaning process.
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.logger?.log('[Cleaner] Auto-clean stopped.');
    }
  }
}
