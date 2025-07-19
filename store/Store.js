import { EvictionPolicy } from '../eviction/EvictionPolicy.js';
import { KeyValidator } from '../validators/KeyValidator.js';
import Logger from '../utils/Logger.js';

export default class Store {
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

  get(key) {
    KeyValidator.validate(key, { nonEmpty: false });
    const entry = this.map.get(key);

    if (entry && typeof entry === 'object') {
      entry.lastAccessed = Date.now();
    }

    this.logger.log(`[Store] Get key: ${key}`);
    return entry;
  }

  has(key) {
    KeyValidator.validate(key, { nonEmpty: false });
    return this.map.has(key);
  }

  delete(key) {
    KeyValidator.validate(key, { nonEmpty: false });
    const existed = this.map.delete(key);

    if (existed) {
      this.logger.log(`[Store] Delete key: ${key}`);
      this.#runHook('onDelete', key);
    }

    return existed;
  }

  clear() {
    this.map.clear();
    this.logger.log(`[Store] Cleared`);
    this.#runHook('onClear');
  }

  entries() {
    return this.map.entries();
  }

  keys() {
    return this.map.keys();
  }

  values() {
    return this.map.values();
  }

  size() {
    return this.map.size;
  }

  forEach(callback) {
    this.map.forEach((value, key) => callback(value, key, this));
  }

  toJSON() {
    const obj = Object.fromEntries(this.map);
    this.logger.log(`[Store] Serialized to JSON`);
    return JSON.stringify(obj);
  }

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

  getEntries() {
    return this.map.entries();
  }

  #runHook(name, ...args) {
    const hook = this.hooks[name];
    if (typeof hook === 'function') {
      hook(...args);
    }
  }
  }
