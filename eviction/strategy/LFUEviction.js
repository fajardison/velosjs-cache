/**
 * LFUEviction implements Least Frequently Used eviction strategy.
 * Menghapus key yang paling jarang diakses.
 */
export class LFUEviction {
  /**
   * @param {string[]} keys - Daftar key.
   * @param {Object<string, { accessCount: number }>} metadata - Informasi frekuensi akses.
   * @returns {string} Key yang paling jarang diakses.
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
