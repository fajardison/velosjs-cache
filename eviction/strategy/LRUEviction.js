/**
 * LRUEviction implements Least Recently Used eviction strategy.
 * Evicts the key with the oldest last access timestamp.
 */
export class LRUEviction {
  /**
   * Selects the least recently accessed key for eviction.
   * @param {string[]} keys - List of keys in the cache.
   * @param {Object<string, { lastAccess: number }>} metadata - Access metadata for each key.
   * @returns {string} The key to evict.
   * @throws {Error} If keys is not a non-empty array or metadata is invalid.
   */
  evict(keys, metadata = {}) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('LRUEviction error: keys must be a non-empty array.');
    }

    for (const key of keys) {
      if (!metadata[key] || typeof metadata[key].lastAccess !== 'number') {
        throw new Error(`LRUEviction error: Invalid metadata for key "${key}".`);
      }
    }

    return keys.reduce((oldest, key) =>
      metadata[key].lastAccess < metadata[oldest].lastAccess ? key : oldest
    );
  }
}
