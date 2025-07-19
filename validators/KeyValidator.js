/**
 * KeyValidator provides utility methods for validating key strings.
 */
export class KeyValidator {
  /**
   * Ensures the key is a string.
   * @param {*} key - The value to validate.
   * @throws If the key is not a string.
   */
  static ensureString(key) {
    if (typeof key !== 'string') {
      throw new Error(`[KeyValidator] Key must be a string. Received: ${typeof key}`);
    }
  }

  /**
   * Ensures the key is a non-empty string.
   * @param {string} key - The key to validate.
   * @throws If the key is empty or not a string.
   */
  static ensureNonEmptyString(key) {
    this.ensureString(key);
    if (key.trim().length === 0) {
      throw new Error('[KeyValidator] Key must not be empty.');
    }
  }

  /**
   * Ensures the key matches the given RegExp pattern.
   * @param {string} key - The key to validate.
   * @param {RegExp} pattern - The pattern to match against.
   * @throws If the key does not match the pattern or if pattern is not a RegExp.
   */
  static ensureMatch(key, pattern) {
    this.ensureString(key);
    if (!(pattern instanceof RegExp)) {
      throw new Error('[KeyValidator] Pattern must be a RegExp.');
    }
    if (!pattern.test(key)) {
      throw new Error(`[KeyValidator] Key "${key}" does not match the required pattern.`);
    }
  }

  /**
   * Performs full key validation.
   * @param {string} key - The key to validate.
   * @param {Object} [options] - Validation options.
   * @param {boolean} [options.nonEmpty=true] - Whether the key must be non-empty.
   * @param {RegExp|null} [options.pattern=null] - Pattern the key must match, if any.
   * @throws If the key is invalid based on the options.
   */
  static validate(key, { nonEmpty = true, pattern = null } = {}) {
    this.ensureString(key);
    if (nonEmpty) this.ensureNonEmptyString(key);
    if (pattern) this.ensureMatch(key, pattern);
  }
}
