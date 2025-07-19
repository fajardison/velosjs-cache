# @velosjs/cache

[![npm version](https://img.shields.io/npm/v/@velosjs/cache)](https://www.npmjs.com/package/@velosjs/cache)
[![Version](https://img.shields.io/badge/Version-v1.0.0-blue)](https://www.npmjs.com/package/@velosjs/cache?activeTab=versions)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/fajardison/velosjs-cache/blob/main/LICENSE)
[![ESM](https://img.shields.io/badge/javascript-ESM-orange)](https://nodejs.org/api/esm.html)

> Efficient and lightweight caching utility for **VelosJS** — includes in-memory caching, optional persistent storage, and built-in statistics monitoring.

---

## ✨ Features

- ⚡ Fast in-memory caching
- 💾 Optional persistence to file
- 📊 Built-in statistics tracker
- 🧠 Smart `getOrFetch` mechanism
- ✅ Modular and extensible

---

## 📦 Installation

```bash
npm install @velosjs/cache
```

---

## 🚀 Usage

### Basic Usage

```js
import Cache from '@velosjs/cache'

const cache = new Cache()

cache.set('foo', 'bar')
console.log(cache.get('foo')) // bar
```

### With `getOrFetch`

```js
const result = await cache.getOrFetch('user:1', 10000, async () => {
  return await fetchUserFromDB(1)
})

console.log(result)
```

---

## 🗂️ Exports

```js
import Cache from '@velosjs/cache'
import Persistence from '@velosjs/cache/persistence'
import Stats from '@velosjs/cache/stats'
```

---

## 📘 API Reference

### `cache.set(key, value, ttl?)`

Menyimpan entri ke dalam cache dengan optional TTL (dalam milidetik).

### `cache.get(key)`

Mengambil nilai dari cache. Akan `undefined` jika tidak ditemukan atau sudah expired.

### `cache.getOrFetch(key, ttl, fetchFn)`

Jika entri tersedia di cache, maka dikembalikan. Jika tidak, maka `fetchFn()` akan dipanggil dan hasilnya disimpan ke cache untuk TTL yang diberikan.

### `cache.delete(key)`

Menghapus entri berdasarkan key.

### `cache.clear()`

Menghapus seluruh entri dalam cache.

---

## 💾 Persistence

Fitur ini memungkinkan penyimpanan cache ke file agar dapat dipulihkan saat aplikasi dijalankan ulang.

```js
import Persistence from '@velosjs/cache/persistence'

await Persistence.save('cache.json', cache)
await Persistence.load('cache.json', cache)
```

---

## 📊 Statistik

Modul statistik bawaan untuk memantau performa cache:

```js
import Stats from '@velosjs/cache/stats'

const stats = new Stats()

stats.hit()
stats.miss()

console.log(stats.snapshot()) // { hit: 1, miss: 1, total: 2, hitRatio: 0.5 }
```

---

## 👤 Author

**[Dimas Fajar](https://github.com/fajardison)**

---

## ⚖️ License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/fajardison/velosjs-cache/blob/main/LICENSE) file for details.
