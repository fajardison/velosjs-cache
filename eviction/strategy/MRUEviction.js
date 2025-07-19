/**
 * Implements the Most Recently Used (MRU) eviction strategy.
 * Evicts the key with the most recent access timestamp.
 */
export class MRUEviction {
  /**
   * Selects the most recently accessed key from the list.
   * @param {string[]} keys - List of cache keys.
   * @param {Object<string, { lastAccess: number }>} metadata - Last access timestamp metadata.
   * @returns {string} The most recently used key.
   * @throws {Error} If keys is not a non-empty array or metadata is invalid.
   */
  evict(keys, metadata = {}) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('MRUEviction error: keys must be a non-empty array.');
    }

    for (const key of keys) {
      if (!metadata[key] || typeof metadata[key].lastAccess !== 'number') {
        throw new Error(`MRUEviction error: Invalid metadata for key "${key}".`);
      }
    }

    return keys.reduce((most, key) =>
      metadata[key].lastAccess > metadata[most].lastAccess ? key : most
    );
  }
}
