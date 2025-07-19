/**
 * MRUEviction implements Most Recently Used eviction strategy.
 * Menghapus key yang paling baru diakses.
 */
export class MRUEviction {
  /**
   * @param {string[]} keys - Daftar key.
   * @param {Object<string, { lastAccess: number }>} metadata - Timestamp akses terakhir.
   * @returns {string} Key yang terakhir digunakan.
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
