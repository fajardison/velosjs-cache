import { TTLManager } from '../ttl/TTLManager.js';
import { Cleaner } from '../ttl/Cleaner.js';
import { TTL } from '../ttl/TTL.js';

class MapStore {
  constructor() {
    this.map = new Map();
  }

  get(key) {
    return this.map.get(key);
  }

  set(key, value) {
    this.map.set(key, value);
  }

  delete(key) {
    this.map.delete(key);
  }

  getEntries() {
    return this.map.entries();
  }
}

class Logger {
  constructor(enabled = true) {
    this.enabled = enabled;
  }

  log(message) {
    if (this.enabled) {
      console.log(message);
    }
  }
}

// Inisialisasi
const store = new MapStore();
const logger = new Logger(true);
const ttlManager = new TTLManager(store, logger);
const cleaner = new Cleaner(store, logger);

// Mulai auto-clean setiap 10 detik
cleaner.start(10000);

// Contoh pemakaian
async function fetchData() {
  return 'Dimas';
}

const data = await ttlManager.getOrFetch('nama', 5000, fetchData);
console.log('Value:', data);
