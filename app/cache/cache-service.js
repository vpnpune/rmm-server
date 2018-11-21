import NodeCache from 'node-cache';

class CacheService {

  constructor(ttlSeconds) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  set(key,data) {
    this.cache.set(key, data);
  }

  get(key, storeFunction) {
    const value = this.cache.get(key);
    console.log('value: ',value);
    if (value) {
      return Promise.resolve(value);
    }
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}


export default CacheService = new CacheService(24 * 60 * 60 * 1);