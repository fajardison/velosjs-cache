// utils/Persistence.js
import fs from 'fs/promises';

export default class Persistence {
  /**
   * Simpan entri ke dalam file JSON
   * @param {string} filePath - Lokasi file penyimpanan
   * @param {object} entries - Data yang akan disimpan (harus object literal)
   */
  static async save(filePath, entries) {
    if (
      !entries ||
      typeof entries !== 'object' ||
      Array.isArray(entries)
    ) {
      throw new TypeError('[Persistence] Entries harus berupa object literal yang valid');
    }

    const json = JSON.stringify(entries, null, 2);
    await fs.writeFile(filePath, json, 'utf8');
  }

  /**
   * Memuat entri dari file JSON
   * @param {string} filePath - Lokasi file penyimpanan
   * @returns {Promise<object>} - Object hasil parsing file
   */
  static async load(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new TypeError('[Persistence] File tidak berisi object JSON yang valid');
      }

      return parsed;
    } catch (err) {
      if (err.code === 'ENOENT') return {};
      throw err;
    }
  }
}
