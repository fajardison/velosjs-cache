import { TTL } from './TTL.js';

/**
 * TTLManager manages cached entries with expiration control using TTL.
 */
export class TTLManager {
  /**
   * Constructs a TTLManager instance.
   * @param {Map|Object} store - The storage mechanism for key-value pairs.
   * @param {Logger|null} logger - Optional logger for debug output.
   */
  constructor(store, logger = null) {
    this.store = store;
    this.logger = logger;
  }

  /**
   * Creates a new TTL entry.
   * @param {*} value - The value to be stored.
   * @param {number} ttl - Time to live in milliseconds.
   * @returns {TTL} - A new TTL-wrapped entry.
   */
  createEntry(value, ttl) {
    return new TTL(value, ttl);
  }

  /**
   * Checks whether an entry is expired.
   * @param {TTL|null} entry - The TTL entry to check.
   * @returns {boolean} - True if the entry is missing or expired.
   */
  isExpired(entry) {
    return !entry || entry.isExpired();
  }

  /**
   * Retrieves a cached value or fetches a new one if expired or missing.
   * @param {string} key - The key to retrieve from the store.
   * @param {number} ttl - TTL to use for newly fetched entries.
   * @param {Function} fetchFn - Async function to fetch the value if not cached.
   * @returns {Promise<*>} - The cached or fetched value.
   */
  async getOrFetch(key, ttl, fetchFn) {
    const entry = this.store.get(key);

    if (entry && !this.isExpired(entry)) {
      entry.touch();
      this.logger?.log(`[TTLManager] Cache hit: ${key}`);
      return entry.value;
    }

    this.logger?.log(`[TTLManager] Fetching new value: ${key}`);
    const value = await fetchFn();
    this.store.set(key, this.createEntry(value, ttl));
    return value;
  }
}
