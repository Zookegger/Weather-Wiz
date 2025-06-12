class CacheService {
    constructor() {
        this.cache = new Map();
        this.expiry = new Map();
    }

    set(key, value, ttlSeconds = 300) {
        this.cache.set(key, value);
        this.expiry.set(key, Date.now() + (ttlSeconds * 1000));
    }

    get(key) {
        if (!this.cache.has(key)) return null;

        if (Date.now() > this.expiry.get(key)) {
            this.cache.delete(key);
            this.expiry.delete(key);
            return null;
        }

        return this.cache.get(key);
    }

    clear() {
        this.cache.clear();
        this.expiry.clear();
    }
}

module.exports = new CacheService();