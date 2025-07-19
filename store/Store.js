import { EvictionPolicy } from '../eviction/EvictionPolicy.js';
import { KeyValidator } from '../validators/KeyValidator.js';
import Logger from '../utils/Logger.js';

/**
 * Store class represents a key-value store with optional cache eviction strategy,
 * hooks for lifecycle events, and optional logging.
 */
export default class Store {
  /**
   * Initializes the Store with optional logger, hooks, max size, and eviction policy.
   * @param {Object} options
   * @param {Logger} [options.logger] - Optional logger instance.
   * @param {Function} [options.onSet] - Hook called after setting a key.
   * @param {Function} [options.onDelete] - Hook called after deleting a key.
   * @param {Function} [options.onClear] - Hook called after clearing the store.
   * @param {number|null} [options.maxSize] - Max number of entries before eviction.
   * @param {string|null} [options.policy] - Eviction policy type (e.g., LRU, LFU).
   */
  constructor({
    logger = new Logger(false),
    onSet,
    onDelete,
    onClear,
    maxSize = null,
    policy = null
  } = {}) {
    this.map = new Map();
    this.logger = logger;
    this.hooks = { onSet, onDelete, onClear };

    this.evictionPolicy = maxSize && policy
      ? new EvictionPolicy(maxSize, policy)
      : null;
  }

  /**
   * Sets a value by key. Triggers eviction if needed.
   * @param {string} key - The key to store.
   * @param {*} value - The value to associate with the key.
   */
  set(key, value) {
    KeyValidator.validate(key);

    if (this.evictionPolicy && value && typeof value === 'object') {
      if (!('lastAccessed' in value)) {
        value.lastAccessed = Date.now();
      }
    }

    if (this.evictionPolicy && !this.map.has(key)) {
      if (this.evictionPolicy.shouldEvict(this.map.size)) {
        const keysToEvict = this.evictionPolicy.evict(this.keys(), { store: this.map });
        for (const evictKey of keysToEvict) {
          if (this.map.has(evictKey)) {
            this.delete(evictKey);
            this.logger.log(`[Eviction] Key evicted: ${evictKey}`);
          } else {
            this.logger.log(`[Eviction] Attempted to evict non-existent key: ${evictKey}`);
          }
        }
      }
    }

    this.map.set(key, value);
    this.logger.log(`[Store] Set key: ${key}`);
    this.#runHook('onSet', key, value);
  }

  /**
   * Retrieves a value by key.
   * @param {string} key - The key to retrieve.
   * @returns {*} The value associated with the key, or undefined if not found.
   */
  get(key) {
    KeyValidator.validate(key, { nonEmpty: false });
    const entry = this.map.get(key);

    if (entry && typeof entry === 'object') {
      entry.lastAccessed = Date.now();
    }

    this.logger.log(`[Store] Get key: ${key}`);
    return entry;
  }

  /**
   * Checks if the key exists in the store.
   * @param {string} key - The key to check.
   * @returns {boolean} True if the key exists, false otherwise.
   */
  has(key) {
    KeyValidator.validate(key, { nonEmpty: false });
    return this.map.has(key);
  }

  /**
   * Deletes a key from the store and triggers onDelete hook if defined.
   * @param {string} key - The key to delete.
   * @returns {boolean} True if the key existed and was deleted.
   */
  delete(key) {
    KeyValidator.validate(key, { nonEmpty: false });
    const existed = this.map.delete(key);

    if (existed) {
      this.logger.log(`[Store] Delete key: ${key}`);
      this.#runHook('onDelete', key);
    }

    return existed;
  }

  /**
   * Clears all entries in the store and triggers onClear hook if defined.
   */
  clear() {
    this.map.clear();
    this.logger.log(`[Store] Cleared`);
    this.#runHook('onClear');
  }

  /**
   * Returns an iterator of [key, value] pairs.
   * @returns {IterableIterator<[string, *]>}
   */
  entries() {
    return this.map.entries();
  }

  /**
   * Returns an iterator of keys in the store.
   * @returns {IterableIterator<string>}
   */
  keys() {
    return this.map.keys();
  }

  /**
   * Returns an iterator of values in the store.
   * @returns {IterableIterator<*>}
   */
  values() {
    return this.map.values();
  }

  /**
   * Returns the number of entries in the store.
   * @returns {number}
   */
  size() {
    return this.map.size;
  }

  /**
   * Executes a callback for each entry in the store.
   * @param {Function} callback - Function called for each (value, key, store).
   */
  forEach(callback) {
    this.map.forEach((value, key) => callback(value, key, this));
  }

  /**
   * Serializes the store into a JSON string.
   * @returns {string} JSON representation of the store.
   */
  toJSON() {
    const obj = Object.fromEntries(this.map);
    this.logger.log(`[Store] Serialized to JSON`);
    return JSON.stringify(obj);
  }

  /**
   * Restores the store from a JSON string.
   * @param {string} json - JSON string representing key-value pairs.
   * @throws {Error} If JSON is invalid or restoration fails.
   */
  restoreFromJSON(json) {
    try {
      const parsed = JSON.parse(json);
      this.clear();
      for (const [key, value] of Object.entries(parsed)) {
        this.set(key, value);
      }
      this.logger.log(`[Store] Restored from JSON`);
    } catch (err) {
      this.logger.log(`[Store] Restore failed: ${err.message}`);
      throw err;
    }
  }

  /**
   * Returns the internal [key, value] iterator.
   * @returns {IterableIterator<[string, *]>}
   */
  getEntries() {
    return this.map.entries();
  }

  /**
   * Executes a hook function if defined.
   * @private
   * @param {string} name - Hook name (onSet, onDelete, onClear).
   * @param {...*} args - Arguments passed to the hook.
   */
  #runHook(name, ...args) {
    const hook = this.hooks[name];
    if (typeof hook === 'function') {
      hook(...args);
    }
  }
}
