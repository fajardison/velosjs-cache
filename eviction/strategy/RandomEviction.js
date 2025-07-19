/**
 * Implements the Random eviction strategy.
 * Evicts a randomly selected key from the cache.
 */
export class RandomEviction {
  /**
   * Selects a random key from the list for eviction.
   * @param {string[]} keys - List of keys in the cache.
   * @returns {string} A randomly selected key to evict.
   * @throws {Error} If keys is not a non-empty array.
   */
  evict(keys) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('RandomEviction error: keys must be a non-empty array.');
    }
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }
}
