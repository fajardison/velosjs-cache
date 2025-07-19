export class Cleaner {
  constructor(store, logger = null) {
    this.store = store;
    this.logger = logger;
    this.interval = null;
  }

  start(interval = 60000) {
    if (this.interval) return;

    this.interval = setInterval(() => {
      for (const [key, entry] of this.store.getEntries()) {
        if (typeof entry.isExpired === 'function' && entry.isExpired()) {
          this.logger?.log(`[Cleaner] Hapus cache kadaluarsa: ${key}`);
          this.store.delete(key);
        }
      }
    }, interval);

    this.logger?.log(`[Cleaner] Auto-clean aktif setiap ${interval / 1000} detik`);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.logger?.log('[Cleaner] Auto-clean dihentikan');
    }
  }
}
