/**
 * Klaviyo API Client
 * 
 * Handles all API interactions with Klaviyo's API,
 * including version management and error handling.
 */

const KlaviyoApiClient = (function() {
  let config = {};
  let helpers = {};
  
  /**
   * Initialize the API client
   * @param {Object} serviceConfig - Global service configuration
   * @param {Object} helperFunctions - Helper utilities
   */
  function init(serviceConfig, helperFunctions) {
    config = serviceConfig || {};
    helpers = helperFunctions || {};
    
    // Log initialization
    helpers.log('API Client initialized', 'debug');
  }
  
  /**
   * Get the API configuration for a specific version
   * @param {string} version - API version to use
   * @return {Object} Version configuration
   */
  function getVersionConfig(version = 'latest') {
    const versionMap = config.VERSION?.klaviyoVersions || {};
    
    // If requested version doesn't exist, fall back to latest
    if (!versionMap[version]) {
      helpers.log(`API version ${version} not found, using latest`, 'warn');
      version = 'latest';
    }
    
    // Get the actual version identifier if 'latest' was requested
    const actualVersion = version === 'latest' ? versionMap.latest : version;
    
    return {
      revision: actualVersion,
      endpoint: versionMap[actualVersion]?.endpoint,
      features: versionMap[actualVersion]?.features || []
    };
  }
  
  /**
   * Create a client subscription (add profile to Klaviyo)
   * @param {Object} subscriptionData - Profile and subscription data
   * @param {string} publicApiKey - Klaviyo public API key
   * @param {Object} options - Request options
   * @return {Promise} API response
   */
  async function createClientSubscription(subscriptionData, publicApiKey, options = {}) {
    const versionConfig = getVersionConfig(options.apiVersion);
    
    if (!publicApiKey) {
      throw new Error('No Klaviyo public API key (company_id) provided');
    }
    
    // Create URL with public API key
    const url = `${versionConfig.endpoint}?company_id=${publicApiKey}`;
    
    // Create headers
    const headers = {
      'Content-Type': 'application/json',
      'revision': versionConfig.revision
    };
    
    // Add debug logging if enabled
    if (options.debug) {
      helpers.log(`Submitting to Klaviyo: ${JSON.stringify(subscriptionData)}`, 'debug', true);
    }
    
    // Use retry with backoff for resilience
    return helpers.retryWithBackoff(async () => {
      // Perform the fetch request
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(subscriptionData)
      });
      
      // Handle successful response (202 Accepted)
      if (response.status === 202) {
        return { success: true };
      }
      
      // Handle error responses with details
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not valid JSON, create a generic error
        errorData = { 
          errors: [{ 
            status: response.status.toString(), 
            title: 'HTTP Error', 
            detail: `HTTP error ${response.status}` 
          }] 
        };
      }
      
      // Format and throw error
      const error = new Error(`Klaviyo API error: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      
      throw error;
    }, options.maxRetries || 3);
  }
  
  /**
   * Track a custom event in Klaviyo
   * @param {string} eventName - Name of the event
   * @param {Object} properties - Event properties
   * @param {string} publicApiKey - Klaviyo public API key
   * @return {Promise} Tracking result
   */
  function trackEvent(eventName, properties, publicApiKey) {
    // This is a wrapper for Klaviyo's native tracking
    // Requires the Klaviyo JS to be loaded
    return new Promise((resolve, reject) => {
      if (!window.klaviyo) {
        // Queue the tracking for when Klaviyo loads
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['track', eventName, properties]);
        
        // We resolve anyway since this is non-critical
        resolve({
          status: 'queued',
          event: eventName
        });
        return;
      }
      
      // Immediate tracking if Klaviyo is loaded
      try {
        window.klaviyo.track(eventName, properties, response => {
          resolve({
            status: 'tracked',
            event: eventName,
            response: response
          });
        });
      } catch (error) {
        // Non-blocking error - we don't want tracking issues to break functionality
        helpers.log(`Error tracking event ${eventName}: ${error.message}`, 'error');
        reject(error);
      }
    });
  }
  
  // Public API
  return {
    init,
    getVersionConfig,
    createClientSubscription,
    trackEvent
  };
})();

// Export for both browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KlaviyoApiClient;
} else if (typeof window !== 'undefined') {
  window.KlaviyoApiClient = KlaviyoApiClient;
} 