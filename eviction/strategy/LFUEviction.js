/**
 * Implements the Least Frequently Used (LFU) eviction strategy.
 * Evicts the key with the lowest access count.
 */
export class LFUEviction {
  /**
   * Selects the least frequently accessed key from the list.
   * @param {string[]} keys - List of cache keys.
   * @param {Object<string, { accessCount: number }>} metadata - Access frequency metadata.
   * @returns {string} The least frequently used key.
   * @throws {Error} If keys is not a non-empty array or metadata is invalid.
   */
  evict(keys, metadata = {}) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('LFUEviction error: keys must be a non-empty array.');
    }

    for (const key of keys) {
      if (!metadata[key] || typeof metadata[key].accessCount !== 'number') {
        throw new Error(`LFUEviction error: Invalid metadata for key "${key}".`);
      }
    }

    return keys.reduce((least, key) =>
      metadata[key].accessCount < metadata[least].accessCount ? key : least
    );
  }
}
