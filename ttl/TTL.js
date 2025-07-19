export class TTL {
  constructor(value, ttl) {
    if (typeof ttl !== 'number' || ttl <= 0) {
      throw new Error('TTL harus berupa angka positif');
    }

    const now = Date.now();
    this.value = value;
    this.expiresAt = now + ttl;
    this.metadata = { lastAccessed: now };
  }

  isExpired() {
    return Date.now() > this.expiresAt;
  }

  touch() {
    this.metadata.lastAccessed = Date.now();
  }
}
