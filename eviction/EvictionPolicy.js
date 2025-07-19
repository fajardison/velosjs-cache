import { SUPPORTED_POLICIES } from '../constants/supportedPolicies.js';
import { FIFOEviction } from './strategy/FIFOEviction.js';
import { LRUEviction } from './strategy/LRUEviction.js';
import { LFUEviction } from './strategy/LFUEviction.js';
import { MRUEviction } from './strategy/MRUEviction.js';
import { RandomEviction } from './strategy/RandomEviction.js';

/**
 * STRATEGY_MAP links supported eviction policies to their corresponding strategy classes.
 * Used internally by EvictionPolicy to instantiate the correct strategy.
 */
const STRATEGY_MAP = Object.freeze({
  [SUPPORTED_POLICIES.FIFO]: FIFOEviction,
  [SUPPORTED_POLICIES.LRU]: LRUEviction,
  [SUPPORTED_POLICIES.LFU]: LFUEviction,
  [SUPPORTED_POLICIES.MRU]: MRUEviction,
  [SUPPORTED_POLICIES.RANDOM]: RandomEviction,
});

/**
 * EvictionPolicy manages cache eviction based on a defined policy.
 * It delegates eviction decision to the selected strategy.
 */
export class EvictionPolicy {
  /**
   * @param {number} maxSize - Maximum allowed number of keys in cache.
   * @param {string} policy - One of the SUPPORTED_POLICIES.
   */
  constructor(maxSize, policy = SUPPORTED_POLICIES.FIFO) {
    if (typeof maxSize !== 'number' || maxSize <= 0) {
      throw new Error('EvictionPolicy error: maxSize must be a positive number.');
    }

    const Strategy = STRATEGY_MAP[policy];
    if (!Strategy) {
      throw new Error(`EvictionPolicy error: Unsupported policy "${policy}".`);
    }

    this.maxSize = maxSize;
    this.policy = policy;
    this.strategy = new Strategy();
  }

  /**
   * Determines whether the cache has reached the threshold to trigger eviction.
   * @param {number} currentSize - Current number of keys in cache.
   * @returns {boolean} Whether eviction should occur.
   */
  shouldEvict(currentSize) {
    if (typeof currentSize !== 'number' || currentSize < 0) {
      throw new Error('EvictionPolicy error: currentSize must be a non-negative number.');
    }

    return currentSize >= this.maxSize;
  }

  /**
   * Selects a key to evict based on the active eviction strategy.
   * @param {string[]} keys - List of current keys in the cache.
   * @param {Object} metadata - Optional metadata for strategies like LRU/LFU/MRU.
   * @returns {string} The selected key to evict.
   */
  evict(keys, metadata = {}) {
    return this.strategy.evict(keys, metadata);
  }
}
