/**
 * SUPPORTED_POLICIES defines all available cache eviction strategies.
 * 
 * The keys represent policy identifiers, and the values are their string names.
 * This object is immutable and used to validate or reference supported policies.
 */
export const SUPPORTED_POLICIES = Object.freeze({
  FIFO: 'FIFO',
  LRU: 'LRU',
  LFU: 'LFU',
  MRU: 'MRU',
  RANDOM: 'RANDOM',
});
