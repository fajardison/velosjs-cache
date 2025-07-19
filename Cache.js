import Store from './store/Store.js';
import { TTL } from './ttl/TTL.js';
import { TTLManager } from './ttl/TTLManager.js';
import { Cleaner } from './ttl/Cleaner.js';
import Logger from './utils/Logger.js';

export default class Cache {
  /**
   * Inisialisasi cache dengan konfigurasi opsional
   * @param {Object} options
   * @param {boolean} [options.useLogger=false] - Aktifkan logging
   * @param {number} [options.cleanInterval=60000] - Interval pembersihan TTL (ms)
   * @param {number|null} [options.maxSize=null] - Maksimal item dalam cache
   * @param {string|null} [options.evictionPolicy=null] - Strategi pengusiran item (mis. 'LRU')
   * @param {number} [options.defaultTTL=60000] - TTL default (ms)
   */
  constructor({
    useLogger = false,
    cleanInterval = 60000,
    maxSize = null,
    evictionPolicy = null,
    defaultTTL = 60000
  } = {}) {
    const logger = new Logger(useLogger);

    this.defaultTTL = defaultTTL;
    this.store = new Store({ logger, maxSize, policy: evictionPolicy });
    this.ttlManager = new TTLManager(this.store, logger);
    this.cleaner = new Cleaner(this.store, logger);
    this.logger = logger;

    this.cleaner.start(cleanInterval);
  }

  /**
   * Simpan data ke cache dengan TTL
   * @param {string} key
   * @param {any} value
   * @param {number} [ttl] - TTL dalam milidetik (opsional)
   */
  set(key, value, ttl = this.defaultTTL) {
    const entry = new TTL(value, ttl);
    this.store.set(key, entry);
  }

  /**
   * Ambil data dari cache jika belum kadaluarsa
   * @param {string} key
   * @returns {any | undefined}
   */
  get(key) {
    const entry = this.store.get(key);
    if (entry && !entry.isExpired()) {
      entry.touch();
      return entry.value;
    }
    this.store.delete(key);
    return undefined;
  }

  /**
   * Ambil dari cache atau fetch jika belum tersedia
   * @param {string} key
   * @param {number} ttl - TTL untuk data baru jika di-fetch
   * @param {Function} fetchFn - Fungsi async untuk mengambil data jika tidak tersedia
   * @returns {Promise<any>}
   */
  async getOrFetch(key, ttl, fetchFn) {
    return this.ttlManager.getOrFetch(key, ttl, fetchFn);
  }

  /**
   * Cek apakah key tersedia dan belum kadaluarsa
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Hapus item dari cache
   * @param {string} key
   * @returns {boolean}
   */
  delete(key) {
    return this.store.delete(key);
  }

  /**
   * Kosongkan seluruh cache
   */
  clear() {
    this.store.clear();
  }

  /**
   * Hentikan proses pembersih otomatis
   */
  stopCleaner() {
    this.cleaner.stop();
  }

  /**
   * Serialisasi isi cache ke format JSON
   * @returns {Object}
   */
  toJSON() {
    return this.store.toJSON();
  }

  /**
   * Muat cache dari hasil serialisasi JSON
   * @param {Object} json
   */
  restoreFromJSON(json) {
    this.store.restoreFromJSON(json);
  }

  /**
   * Dapatkan jumlah item aktif dalam cache
   * @returns {number}
   */
  size() {
    return this.store.size();
  }
}
