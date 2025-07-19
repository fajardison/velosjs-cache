import Store from '../cache/Store.js';
import Logger from '../utils/Logger.js';

const cache = new Store({
  logger: new Logger(true),
  maxSize: 5,
  policy: 'LRU',
  onSet: (key, value) => console.log('Disimpan:', key, value),
  onDelete: (key) => console.log('Dihapus:', key)
});

cache.set("nama", { value: "Dimas" });
console.log(cache.get("nama"));
