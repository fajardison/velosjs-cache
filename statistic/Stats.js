export default class Stats {
  #hit = 0
  #miss = 0
  #lastAccess = null

  hit(timestamp = Date.now()) {
    this.#hit++
    this.#lastAccess = timestamp
  }

  miss(timestamp = Date.now()) {
    this.#miss++
    this.#lastAccess = timestamp
  }

  reset() {
    this.#hit = 0
    this.#miss = 0
    this.#lastAccess = null
  }

  hitRatio() {
    const total = this.#hit + this.#miss
    return total === 0 ? 0 : this.#hit / total
  }

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

  toJSON() {
    return this.snapshot()
  }
}
