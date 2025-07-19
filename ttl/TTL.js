/**
 * TTL (Time To Live) wraps a value with an expiration time and metadata.
 */
export class TTL {
  /**
   * Creates a new TTL-wrapped value.
   * @param {*} value - The value to store with TTL.
   * @param {number} ttl - Time to live in milliseconds (must be positive).
   * @throws Will throw an error if ttl is not a positive number.
   */
  constructor(value, ttl) {
    if (typeof ttl !== 'number' || ttl <= 0) {
      throw new Error('TTL must be a positive number');
    }

    const now = Date.now();
    this.value = value;
    this.expiresAt = now + ttl;
    this.metadata = { lastAccessed: now };
  }

  /**
   * Checks whether the TTL value has expired.
   * @returns {boolean} True if the value has expired, false otherwise.
   */
  isExpired() {
    return Date.now() > this.expiresAt;
  }

  /**
   * Updates the last accessed time to the current timestamp.
   */
  touch() {
    this.metadata.lastAccessed = Date.now();
  }
}
