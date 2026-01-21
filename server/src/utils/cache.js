/**
 * Simple in-memory cache for external API responses
 * Reduces redundant API calls and improves performance
 */

class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now()
    });
  }

  /**
   * Delete a value from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clear expired entries (for periodic cleanup)
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    let validCount = 0;
    let expiredCount = 0;
    const now = Date.now();
    
    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expiredCount++;
      } else {
        validCount++;
      }
    }
    
    return {
      total: this.cache.size,
      valid: validCount,
      expired: expiredCount
    };
  }

  /**
   * Get or set pattern - fetch from cache or execute function
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Function to execute if cache miss
   * @param {number} ttl - Time to live in milliseconds (optional)
   * @returns {Promise<*>} Cached or freshly fetched value
   */
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    const cached = this.get(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const value = await fetchFn();
    this.set(key, value, ttl);
    return value;
  }
}

// Platform-specific cache TTLs
export const CACHE_TTL = {
  PLATFORM_STATS: 15 * 60 * 1000,    // 15 minutes for platform stats
  CONTESTS: 60 * 60 * 1000,          // 1 hour for contests
  USER_PROFILE: 5 * 60 * 1000,       // 5 minutes for user profiles
  EXTERNAL_API: 10 * 60 * 1000,      // 10 minutes for external API calls
};

// Create cache keys
export const createCacheKey = {
  platformStats: (platform, username) => `platform:${platform}:${username}`,
  contests: (platform) => `contests:${platform}`,
  userProfile: (userId) => `user:${userId}`,
};

// Singleton instance
export const cache = new CacheService();

export default cache;
