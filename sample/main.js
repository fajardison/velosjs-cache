import Cache from '@velosjs/cache';
import Persistence from '@velosjs/cache/persistence';
import Stats from '@velosjs/cache/stats';

const cacheFile = './cache.json';
const cache = new Cache({ cleanInterval: 3000 });
const stats = new Stats();

async function saveCache() {
  const data = JSON.parse(cache.toJSON());
  await Persistence.save(cacheFile, data);
  console.log('[Persistence] Cache berhasil disimpan ke file');
}

async function loadCache() {
  const data = await Persistence.load(cacheFile);
  cache.restoreFromJSON(JSON.stringify(data));
  console.log('[Persistence] Cache berhasil dimuat dari file');
}

async function runTests() {
  await loadCache();

  console.log('\n--- TEST: set() dan get() ---');
  cache.set('nama', 'Dimas', 5000);
  await saveCache();
  const val1 = cache.get('nama');
  if (val1 !== undefined) stats.hit(); else stats.miss();
  console.log('Hasil get:', val1);

  console.log('\n--- TEST: getOrFetch() (ambil dari cache) ---');
  const data1 = await cache.getOrFetch('nama', 5000, async () => 'Bukan Dimas');
  if (data1 === val1) stats.hit(); else stats.miss();
  console.log('getOrFetch hasil:', data1);

  console.log('\n--- TEST: getOrFetch() (fetch baru setelah expired) ---');
  await new Promise(res => setTimeout(res, 6000));
  const data2 = await cache.getOrFetch('nama', 5000, async () => 'Dimas Baru');
  stats.miss();
  console.log('getOrFetch setelah expired:', data2);
  await saveCache();

  console.log('\n--- TEST: Otomatis hapus oleh Cleaner ---');
  cache.set('sementara', 'Fajar', 1000);
  await saveCache();
  const val2 = cache.get('sementara');
  if (val2 !== undefined) stats.hit(); else stats.miss();
  console.log('Sebelum expired:', val2);

  await new Promise(res => setTimeout(res, 4000));
  const val3 = cache.get('sementara');
  if (val3 !== undefined) stats.hit(); else stats.miss();
  console.log('Setelah expired:', val3);

  cache.stopCleaner();

  console.log('\n--- Statistik Cache ---');
  console.log(stats.snapshot());
}

runTests().catch(console.error);
