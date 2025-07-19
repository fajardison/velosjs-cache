import { TTL } from './TTL.js';

export class TTLManager {
  constructor(store, logger = null) {
    this.store = store;
    this.logger = logger;
  }

  createEntry(value, ttl) {
    return new TTL(value, ttl);
  }

  isExpired(entry) {
    return !entry || entry.isExpired();
  }

  async getOrFetch(key, ttl, fetchFn) {
    const entry = this.store.get(key);

    if (entry && !this.isExpired(entry)) {
      entry.touch();
      this.logger?.log(`[TTLManager] Cache hit: ${key}`);
      return entry.value;
    }

    this.logger?.log(`[TTLManager] Fetch baru: ${key}`);
    const value = await fetchFn();
    this.store.set(key, this.createEntry(value, ttl));
    return value;
  }
}
