/**
 * SUPPORTED_POLICIES lists the available cache eviction strategies.
 */
export const SUPPORTED_POLICIES = Object.freeze({
  FIFO: 'FIFO',
  LRU: 'LRU',
  LFU: 'LFU',
  MRU: 'MRU',
  RANDOM: 'RANDOM',
});
