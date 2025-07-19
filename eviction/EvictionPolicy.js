import { SUPPORTED_POLICIES } from '../constants/supportedPolicies.js';
import { FIFOEviction } from './strategy/FIFOEviction.js';
import { LRUEviction } from './strategy/LRUEviction.js';
import { LFUEviction } from './strategy/LFUEviction.js';
import { MRUEviction } from './strategy/MRUEviction.js';
import { RandomEviction } from './strategy/RandomEviction.js';

const STRATEGY_MAP = {
  [SUPPORTED_POLICIES.FIFO]: FIFOEviction,
  [SUPPORTED_POLICIES.LRU]: LRUEviction,
  [SUPPORTED_POLICIES.LFU]: LFUEviction,
  [SUPPORTED_POLICIES.MRU]: MRUEviction,
  [SUPPORTED_POLICIES.RANDOM]: RandomEviction,
};

export class EvictionPolicy {
  constructor(maxSize, policy = SUPPORTED_POLICIES.FIFO) {
    if (typeof maxSize !== 'number' || maxSize <= 0) {
      throw new Error(`EvictionPolicy error: maxSize must be a positive number.`);
    }

    const Strategy = STRATEGY_MAP[policy];
    if (!Strategy) {
      throw new Error(`EvictionPolicy error: Unsupported policy "${policy}".`);
    }

    this.maxSize = maxSize;
    this.policy = policy;
    this.strategy = new Strategy();
  }

  shouldEvict(currentSize) {
    if (typeof currentSize !== 'number' || currentSize < 0) {
      throw new Error(`EvictionPolicy error: currentSize must be a non-negative number.`);
    }

    return currentSize >= this.maxSize;
  }

  evict(keys, metadata = {}) {
    return this.strategy.evict(keys, metadata);
  }
}
