/**
 * Implements the First-In-First-Out (FIFO) eviction strategy.
 * Always evicts the oldest inserted key from the cache.
 */
export class FIFOEviction {
  /**
   * Selects the first key from the provided list for eviction.
   * @param {string[]} keys - Ordered list of keys.
   * @returns {string} The key to evict.
   * @throws {Error} If keys is not a non-empty array.
   */
  evict(keys) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('FIFOEviction error: keys must be a non-empty array.');
    }
    return keys[0];
  }
}
