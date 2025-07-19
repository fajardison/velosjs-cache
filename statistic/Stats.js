/**
 * Tracks cache statistics including hit/miss counts and last access time.
 */
export default class Stats {
  #hit = 0
  #miss = 0
  #lastAccess = null

  /**
   * Increments the hit counter and updates last access time.
   * @param {number} [timestamp=Date.now()] - Optional custom timestamp.
   */
  hit(timestamp = Date.now()) {
    this.#hit++
    this.#lastAccess = timestamp
  }

  /**
   * Increments the miss counter and updates last access time.
   * @param {number} [timestamp=Date.now()] - Optional custom timestamp.
   */
  miss(timestamp = Date.now()) {
    this.#miss++
    this.#lastAccess = timestamp
  }

  /**
   * Resets all statistics to initial state.
   */
  reset() {
    this.#hit = 0
    this.#miss = 0
    this.#lastAccess = null
  }

  /**
   * Calculates and returns the hit ratio.
   * @returns {number} Ratio of cache hits to total accesses.
   */
  hitRatio() {
    const total = this.#hit + this.#miss
    return total === 0 ? 0 : this.#hit / total
  }

  /**
   * Returns a snapshot of the current statistics.
   * @returns {Object} Object containing hit, miss, total, hitRatio, lastAccess.
   */
  snapshot() {
    const total = this.#hit + this.#miss
    return {
      hit: this.#hit,
      miss: this.#miss,
      total,
      hitRatio: this.hitRatio(),
      lastAccess: this.#lastAccess,
    }
  }

  /**
   * Returns statistics in JSON-serializable format.
   * @returns {Object} Same as snapshot().
   */
  toJSON() {
    return this.snapshot()
  }
}
