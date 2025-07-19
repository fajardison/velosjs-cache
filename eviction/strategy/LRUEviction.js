/**
 * Implements the Least Recently Used (LRU) eviction strategy.
 * Evicts the key with the oldest last access timestamp.
 */
export class LRUEviction {
  /**
   * Selects the least recently accessed key from the list.
   * @param {string[]} keys - List of cache keys.
   * @param {Object<string, { lastAccess: number }>} metadata - Last access timestamp metadata.
   * @returns {string} The least recently used key.
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
