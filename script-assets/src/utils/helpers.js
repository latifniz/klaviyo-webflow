/**
 * Klaviyo-Webflow Integration Utilities
 * 
 * Common helper functions used throughout the integration service.
 */

const KlaviyoHelpers = {
  /**
   * Merges objects deeply
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @return {Object} Merged object
   */
  mergeObjects: function(target, source) {
    const result = Object.assign({}, target);
    
    if (!source) return result;
    
    Object.keys(source).forEach(key => {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        if (typeof result[key] === 'object' && result[key] !== null) {
          result[key] = this.mergeObjects(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    });
    
    return result;
  },

  /**
   * Controlled console logging with log levels
   * @param {string} message - Message to log
   * @param {string} level - Log level (log, warn, error, debug)
   * @param {boolean} debugMode - If debug mode is enabled
   */
  log: function(message, level = 'log', debugMode = false) {
    const prefix = 'Klaviyo-Webflow:';
    
    if (level === 'error') {
      console.error(`${prefix} ${message}`);
      return;
    }
    
    if (level === 'warn') {
      console.warn(`${prefix} ${message}`);
      return;
    }
    
    if (debugMode || level !== 'debug') {
      console[level](`${prefix} ${message}`);
    }
  },

  /**
   * Safely load external scripts with error handling
   * @param {string} url - Script URL
   * @param {Object} options - Script attributes
   * @param {Function} callback - Callback on load
   * @param {Function} errorCallback - Callback on error
   */
  loadScript: function(url, options = {}, callback, errorCallback) {
    const script = document.createElement('script');
    script.async = options.async !== undefined ? options.async : true;
    script.type = 'text/javascript';
    script.src = url;
    
    // Add integrity and crossorigin for security if provided
    if (options.integrity) {
      script.integrity = options.integrity;
      script.crossOrigin = 'anonymous';
    }
    
    script.onload = function() {
      if (typeof callback === 'function') {
        callback();
      }
    };
    
    script.onerror = function() {
      if (typeof errorCallback === 'function') {
        errorCallback(new Error(`Failed to load script: ${url}`));
      }
    };
    
    document.head.appendChild(script);
  },

  /**
   * Format phone number using libphonenumber-js
   * @param {string} number - Phone number to format
   * @param {string} defaultCountry - Default country code
   * @return {string|null} Formatted number or null if invalid
   */
  formatPhoneNumber: function(number, defaultCountry = 'US') {
    if (!window.libphonenumber || !number) return number;
    
    try {
      // Parse and format the number using the provided country code
      const parsedNumber = libphonenumber.parsePhoneNumber(number, defaultCountry);
      
      if (parsedNumber && parsedNumber.isValid()) {
        return parsedNumber.format('E.164'); // Convert to E.164 format
      } else {
        this.log('Invalid phone number: ' + number, 'warn');
        return null;
      }
    } catch (error) {
      this.log('Error parsing phone number: ' + error.message, 'error');
      return null;
    }
  },

  /**
   * Simple email validation
   * @param {string} email - Email to validate
   * @return {boolean} Is email valid
   */
  isValidEmail: function(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  },

  /**
   * Get browser user agent info
   * @return {Object} Browser information
   */
  getBrowserInfo: function() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    };
  },

  /**
   * Get a cookie value by name
   * @param {string} name - Cookie name
   * @return {string|null} Cookie value or null
   */
  getCookie: function(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  },

  /**
   * Set a cookie with options
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {Object} options - Cookie options
   */
  setCookie: function(name, value, options = {}) {
    let cookieString = `${name}=${value}`;
    
    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
    
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
    
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
      cookieString += '; secure';
    }
    
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
  },

  /**
   * Generate a unique identifier
   * @return {string} UUID
   */
  generateUUID: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Retry a function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} baseDelay - Base delay in milliseconds
   * @return {Promise} Promise that resolves with the function result
   */
  retryWithBackoff: async function(fn, maxRetries = 3, baseDelay = 300) {
    let retries = 0;
    
    while (true) {
      try {
        return await fn();
      } catch (error) {
        if (retries >= maxRetries) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      }
    }
  }
};

// Export for both browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KlaviyoHelpers;
} else if (typeof window !== 'undefined') {
  window.KlaviyoHelpers = KlaviyoHelpers;
} 