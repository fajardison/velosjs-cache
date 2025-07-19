import fs from 'fs/promises';

export default class Persistence {
  /**
   * Save entries to a JSON file.
   * @param {string} filePath - Path to the JSON file.
   * @param {object} entries - Data to save (must be a plain object).
   * @throws {TypeError} If entries is not a valid object.
   */
  static async save(filePath, entries) {
    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) {
      throw new TypeError('[Persistence] Entries must be a valid plain object');
    }

    const json = JSON.stringify(entries, null, 2);
    await fs.writeFile(filePath, json, 'utf8');
  }

  /**
   * Load entries from a JSON file.
   * @param {string} filePath - Path to the JSON file.
   * @returns {Promise<object>} Parsed JSON object from file.
   * @throws {TypeError} If the file content is not a valid object.
   */
  static async load(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new TypeError('[Persistence] File does not contain a valid JSON object');
      }

      return parsed;
    } catch (err) {
      if (err.code === 'ENOENT') return {};
      throw err;
    }
  }
}
