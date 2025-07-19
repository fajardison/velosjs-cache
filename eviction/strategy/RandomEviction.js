/**
 * RandomEviction implements random eviction strategy.
 * Memilih key secara acak untuk dihapus.
 */
export class RandomEviction {
  /**
   * @param {string[]} keys - Daftar key dalam cache.
   * @returns {string} Key yang akan dihapus.
   */
  evict(keys) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('RandomEviction error: keys must be a non-empty array.');
    }
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }
}
