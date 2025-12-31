/**
 * Request Manager Utility
 * Handles request deduplication, caching, rate limiting, and 429 error handling
 */

class RequestManager {
  constructor() {
    // Track pending requests to prevent duplicates
    this.pendingRequests = new Map();
    
    // Cache successful responses
    this.cache = new Map();
    
    // Default cache TTL: 30 seconds for GET requests
    this.defaultCacheTTL = 30 * 1000;
    
    // Track rate limit retry delays
    this.rateLimitDelays = new Map();
  }

  /**
   * Generate cache key from URL and options
   */
  _getCacheKey(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Check if request is cached and still valid
   */
  _getCachedResponse(cacheKey, ttl = this.defaultCacheTTL) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > ttl) {
      // Cache expired
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.data;
  }

  /**
   * Store response in cache
   */
  _setCachedResponse(cacheKey, data) {
    this.cache.set(cacheKey, {
      data: { ...data }, // Clone to prevent mutations
      timestamp: Date.now()
    });
  }

  /**
   * Handle 429 rate limit errors with exponential backoff
   */
  async _handleRateLimit(url, retryCount = 0) {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    if (retryCount >= maxRetries) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = baseDelay * Math.pow(2, retryCount);
    
    // Check if we already have a delay scheduled for this URL
    const existingDelay = this.rateLimitDelays.get(url);
    if (existingDelay && Date.now() < existingDelay) {
      const waitTime = existingDelay - Date.now();
      console.warn(`⏳ Rate limited. Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    } else {
      // Set new delay
      const delayUntil = Date.now() + delay;
      this.rateLimitDelays.set(url, delayUntil);
      console.warn(`⏳ Rate limited. Waiting ${delay}ms before retry ${retryCount + 1}/${maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    return retryCount + 1;
  }

  /**
   * Make a request with deduplication, caching, and rate limit handling
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @param {Object} config - Request config (cacheTTL, skipCache, skipDeduplication)
   * @returns {Promise} Response data
   */
  async request(url, options = {}, config = {}) {
    const {
      cacheTTL = this.defaultCacheTTL,
      skipCache = false,
      skipDeduplication = false
    } = config;

    const method = (options.method || 'GET').toUpperCase();
    const cacheKey = this._getCacheKey(url, options);

    // Check cache for GET requests (unless skipCache is true)
    if (method === 'GET' && !skipCache) {
      const cached = this._getCachedResponse(cacheKey, cacheTTL);
      if (cached) {
        console.log('📦 [RequestManager] Cache hit:', url);
        return cached;
      }
    }

    // Check for pending duplicate requests (unless skipDeduplication is true)
    if (!skipDeduplication && this.pendingRequests.has(cacheKey)) {
      console.log('🔄 [RequestManager] Deduplicating request:', url);
      try {
        return await this.pendingRequests.get(cacheKey);
      } catch (error) {
        // If the pending request failed, continue with new request
        this.pendingRequests.delete(cacheKey);
      }
    }

    // Create request promise
    const requestPromise = this._executeRequest(url, options, cacheKey, cacheTTL, method, skipCache);

    // Store pending request for deduplication
    if (!skipDeduplication) {
      this.pendingRequests.set(cacheKey, requestPromise);
    }

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      if (!skipDeduplication) {
        this.pendingRequests.delete(cacheKey);
      }
    }
  }

  /**
   * Execute the actual fetch request with retry logic
   */
  async _executeRequest(url, options, cacheKey, cacheTTL, method, skipCache, retryCount = 0) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // Handle 429 Too Many Requests
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : null;
        
        if (delay) {
          console.warn(`⏳ Rate limited. Server says retry after ${retryAfter}s`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          await this._handleRateLimit(url, retryCount);
        }
        
        // Retry the request
        return this._executeRequest(url, options, cacheKey, cacheTTL, method, skipCache, retryCount + 1);
      }

      // Handle other errors
      if (!response.ok) {
        // Don't cache error responses
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (method === 'GET' && !skipCache && data.success !== false) {
        this._setCachedResponse(cacheKey, data);
      }

      return data;
    } catch (error) {
      // If it's a network error and we haven't exceeded retries, retry once
      if (retryCount === 0 && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.warn('🔄 [RequestManager] Network error, retrying once...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this._executeRequest(url, options, cacheKey, cacheTTL, method, skipCache, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Clear cache for a specific URL pattern or all cache
   */
  clearCache(urlPattern = null) {
    if (!urlPattern) {
      this.cache.clear();
      console.log('🗑️ [RequestManager] Cleared all cache');
    } else {
      const keysToDelete = [];
      for (const key of this.cache.keys()) {
        if (key.includes(urlPattern)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.cache.delete(key));
      console.log(`🗑️ [RequestManager] Cleared cache for: ${urlPattern}`);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      rateLimitDelays: this.rateLimitDelays.size
    };
  }
}

// Export singleton instance
const requestManager = new RequestManager();
export default requestManager;

