# @velosjs/cache

[![npm version](https://img.shields.io/npm/v/@velosjs/cache)](https://www.npmjs.com/package/@velosjs/cache)
[![Version](https://img.shields.io/badge/Version-v1.0.0-blue)](https://www.npmjs.com/package/@velosjs/cache?activeTab=versions)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/fajardison/velosjs-cache/blob/main/LICENSE)
[![ESM](https://img.shields.io/badge/javascript-ESM-orange)](https://nodejs.org/api/esm.html)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-blue)](https://nodejs.org/)

> Efficient and lightweight caching utility for **VelosJS** — includes in-memory caching, optional persistent storage, and built-in statistics monitoring.

---

## ✨ Features

- ⚡ Fast in-memory caching
- 💾 Optional persistence to file
- 📊 Built-in statistics tracker
- 🧠 Smart `getOrFetch` mechanism
- 🧹 Supports multiple eviction strategies
- ✅ Modular and extensible

---

## 📦 Installation

```bash
npm install @velosjs/cache
```

---

## 🗂️ Exports

```js
import Cache from '@velosjs/cache'
import Persistence from '@velosjs/cache/persistence'
import Stats from '@velosjs/cache/stats'
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

## 🧹 Eviction Strategies

Built-in eviction policies:

- Least Recently Used (LRU)
- Most Recently Used (MRU)
- First-In-First-Out (FIFO)
- Least Frequently Used (LFU)
- Random

You can switch policies by specifying the strategy on initialization:

```js
const cache = new Cache({ evictionPolicy: 'LRU' })
```

---

## 📘 API Reference

### `cache.set(key, value, ttl?)`

Stores an entry in the cache with an optional TTL (in milliseconds).

### `cache.get(key)`

Retrieves a value from the cache. Returns `undefined` if not found or expired.

### `cache.getOrFetch(key, ttl, fetchFn)`

If the entry exists and is valid, returns it. Otherwise, calls `fetchFn()`, caches the result, and returns it.

### `cache.delete(key)`

Removes an entry by its key.

### `cache.clear()`

Removes all entries from the cache.

---

## 💾 Persistence

This feature allows the cache to be saved and restored from file:

```js
import Persistence from '@velosjs/cache/persistence'

await Persistence.save('cache.json', cache)
await Persistence.load('cache.json', cache)
```

---

## 📊 Statistics

Built-in statistics module to track cache performance:

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
