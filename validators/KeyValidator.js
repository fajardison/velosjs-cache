/**
 * KeyValidator menyediakan metode utilitas untuk memvalidasi key string.
 */
export class KeyValidator {
  /**
   * Memastikan key bertipe string.
   * @param {*} key - Nilai yang akan divalidasi.
   * @throws Jika key bukan string.
   */
  static ensureString(key) {
    if (typeof key !== 'string') {
      throw new Error(`[KeyValidator] Key harus berupa string. Diterima: ${typeof key}`);
    }
  }

  /**
   * Memastikan key adalah string yang tidak kosong.
   * @param {string} key - Key yang akan divalidasi.
   * @throws Jika key kosong atau bukan string.
   */
  static ensureNonEmptyString(key) {
    this.ensureString(key);
    if (key.trim().length === 0) {
      throw new Error('[KeyValidator] Key tidak boleh kosong.');
    }
  }

  /**
   * Memastikan key sesuai dengan pola RegExp.
   * @param {string} key - Key yang akan divalidasi.
   * @param {RegExp} pattern - Pola yang harus cocok dengan key.
   * @throws Jika key tidak sesuai pola atau pattern bukan RegExp.
   */
  static ensureMatch(key, pattern) {
    this.ensureString(key);
    if (!(pattern instanceof RegExp)) {
      throw new Error('[KeyValidator] Pola harus berupa RegExp.');
    }
    if (!pattern.test(key)) {
      throw new Error(`[KeyValidator] Key "${key}" tidak sesuai dengan pola yang diminta.`);
    }
  }

  /**
   * Validasi lengkap terhadap key.
   * @param {string} key - Key yang akan divalidasi.
   * @param {Object} [options] - Opsi validasi.
   * @param {boolean} [options.nonEmpty=true] - Apakah key harus tidak kosong.
   * @param {RegExp|null} [options.pattern=null] - Pola yang harus cocok (jika ada).
   * @throws Jika key tidak valid berdasarkan opsi.
   */
  static validate(key, { nonEmpty = true, pattern = null } = {}) {
    this.ensureString(key);
    if (nonEmpty) this.ensureNonEmptyString(key);
    if (pattern) this.ensureMatch(key, pattern);
  }
}
