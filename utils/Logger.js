export default class Logger {
  constructor(enabled = false) {
    this.enabled = enabled;
  }

  log(...args) {
    if (this.enabled) {
      console.log('[Store]', ...args);
    }
  }
}
