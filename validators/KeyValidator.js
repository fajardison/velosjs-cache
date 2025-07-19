export class KeyValidator {
  static ensureString(key) {
    if (typeof key !== 'string') {
      throw new Error(`[KeyValidator] Key harus berupa string. Diterima: ${typeof key}`);
    }
  }

  static ensureNonEmptyString(key) {
    this.ensureString(key);
    if (key.trim().length === 0) {
      throw new Error('[KeyValidator] Key tidak boleh kosong.');
    }
  }

  static ensureMatch(key, pattern) {
    this.ensureString(key);
    if (!(pattern instanceof RegExp)) {
      throw new Error('[KeyValidator] Pola harus berupa RegExp.');
    }
    if (!pattern.test(key)) {
      throw new Error(`[KeyValidator] Key "${key}" tidak sesuai dengan pola yang diminta.`);
    }
  }

  static validate(key, { nonEmpty = true, pattern = null } = {}) {
    this.ensureString(key);
    if (nonEmpty) this.ensureNonEmptyString(key);
    if (pattern) this.ensureMatch(key, pattern);
  }
}
