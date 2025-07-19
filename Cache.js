import Store from './store/Store.js';
import { TTL } from './ttl/TTL.js';
import { TTLManager } from './ttl/TTLManager.js';
import { Cleaner } from './ttl/Cleaner.js';
import Logger from './utils/Logger.js';

/**
 * A cache system with TTL, auto-cleaning, optional logging, and eviction policies.
 */
export default class Cache {
  /**
   * Initialize the cache with optional configuration.
   * @param {Object} options
   * @param {boolean} [options.useLogger=false] - Enable logging.
   * @param {number} [options.cleanInterval=60000] - Auto-clean interval in ms.
   * @param {number|null} [options.maxSize=null] - Maximum number of items in the cache.
   * @param {string|null} [options.evictionPolicy=null] - Eviction strategy (e.g., 'LRU').
   * @param {number} [options.defaultTTL=60000] - Default TTL in ms.
   */
  constructor({
    useLogger = false,
    cleanInterval = 60000,
    maxSize = null,
    evictionPolicy = null,
    defaultTTL = 60000
  } = {}) {
    const logger = new Logger(useLogger);

    this.defaultTTL = defaultTTL;
    this.store = new Store({ logger, maxSize, policy: evictionPolicy });
    this.ttlManager = new TTLManager(this.store, logger);
    this.cleaner = new Cleaner(this.store, logger);
    this.logger = logger;

    this.cleaner.start(cleanInterval);
  }

  /**
   * Store a value in the cache with optional TTL.
   * @param {string} key
   * @param {*} value
   * @param {number} [ttl] - Time to live in ms.
   */
  set(key, value, ttl = this.defaultTTL) {
    const entry = new TTL(value, ttl);
    this.store.set(key, entry);
  }

  /**
   * Retrieve a value if it's not expired.
   * @param {string} key
   * @returns {*|undefined}
   */
  get(key) {
    const entry = this.store.get(key);
    if (entry && !entry.isExpired()) {
      entry.touch();
      return entry.value;
    }
    this.store.delete(key);
    return undefined;
  }

  /**
   * Get a cached value or fetch and store it if missing/expired.
   * @param {string} key
   * @param {number} ttl - TTL for the fetched value.
   * @param {Function} fetchFn - Async function to fetch the value.
   * @returns {Promise<*>}
   */
  async getOrFetch(key, ttl, fetchFn) {
    return this.ttlManager.getOrFetch(key, ttl, fetchFn);
  }

  /**
   * Check if a key exists and is not expired.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Remove a key from the cache.
   * @param {string} key
   * @returns {boolean}
   */
  delete(key) {
    return this.store.delete(key);
  }

  /**
   * Clear all cached entries.
   */
  clear() {
    this.store.clear();
  }

  /**
   * Stop the automatic cleaner.
   */
  stopCleaner() {
    this.cleaner.stop();
  }

  /**
   * Export cache content to JSON format.
   * @returns {Object}
   */
  toJSON() {
    return this.store.toJSON();
  }

  /**
   * Restore cache from JSON data.
   * @param {Object} json
   */
  restoreFromJSON(json) {
    this.store.restoreFromJSON(json);
  }

  /**
   * Get the current number of active cache entries.
   * @returns {number}
   */
  size() {
    return this.store.size();
  }
}
