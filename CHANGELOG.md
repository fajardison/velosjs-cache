# Changelog

All notable changes to this project will be documented in this file.

This format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2025-07-19
### Added
- Main module `Cache.js` as the entry point.
- Support for multiple eviction policies: `LRU`, `MRU`, `LFU`, `FIFO`, and `Random`.
- TTL Manager to automatically remove expired cache entries.
- Persistence support using `utils/Persistence.js`.
- Cache usage statistics module (`statistic/Stats.js`).
- Key validation system (`validators/KeyValidator.js`).
- Lightweight internal logging system (`utils/Logger.js`).
- Sample usage provided in the `sample/` directory.

### Notes
- Initial release, suitable for lightweight to medium-scale production use.
- Open for contributions and further testing in large-scale environments.
- 
