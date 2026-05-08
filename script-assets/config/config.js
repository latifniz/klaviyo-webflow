/**
 * Klaviyo-Webflow Integration Service Configuration
 * 
 * This file defines the global configuration for the Klaviyo integration service.
 * It contains version information, API endpoints, and default settings.
 */

const CONFIG = {
  // Service version information
  VERSION: {
    service: '1.0.0',
    // Map of supported Klaviyo API versions
    klaviyoVersions: {
      'latest': '2025-04-15',
      '2025-04-15': {
        endpoint: 'https://a.klaviyo.com/client/subscriptions/',
        features: ['email', 'sms', 'customProps', 'phoneValidation']
      },
      '2023-10-15': {
        endpoint: 'https://a.klaviyo.com/client/subscriptions/',
        features: ['email', 'sms', 'customProps']
      },
      // Add older versions as needed for backward compatibility
    }
  },
  
  // CDN configuration
  CDN: {
    // Base URL where the script will be hosted (replace with your actual CDN URL)
    baseUrl: 'https://cdn.example.com/klaviyo-webflow/',
    // Versioned paths
    paths: {
      latest: 'latest/',
      v1: 'v1/',
      // Add more versions as they are released
    }
  },
  
  // Default field mappings from Webflow to Klaviyo
  DEFAULT_FIELD_MAPPINGS: {
    // Standard Webflow fields
    'email': 'email',
    'name': 'first_name',
    'first-name': 'first_name',
    'firstname': 'first_name',
    'last-name': 'last_name',
    'lastname': 'last_name',
    'phone': 'phone_number',
    'phone-number': 'phone_number',
    'company': 'organization',
    'title': 'title',
    'image': 'image',
    // Location fields
    'address1': 'location.address1',
    'address2': 'location.address2',
    'city': 'location.city',
    'country': 'location.country',
    'region': 'location.region',
    'zip': 'location.zip',
    'timezone': 'location.timezone',
    'ip': 'location.ip'
  },
  
  // Default form configuration
  DEFAULT_CONFIG: {
    // Default list ID for Klaviyo - to be overridden per form
    listId: '',
    // Track form views and submissions
    tracking: {
      viewForm: true,
      submitForm: true
    },
    // Custom properties to add to all submissions
    customProperties: {},
    // Use libphonenumber for phone formatting
    useLibPhoneNumber: true,
    // Debug mode - logs details to console
    debug: false
  },
  
  // Dependencies
  DEPENDENCIES: {
    libPhoneNumber: {
      url: 'https://cdnjs.cloudflare.com/ajax/libs/libphonenumber-js/1.10.20/libphonenumber-js.min.js',
      integrity: 'sha384-J0XdM11T3SLXeX6Nq8YQlk5jERgOSrSmniBWKWYV5+cXq/nfwNiCBbIU2Zt5chEV',
      async: true
    }
  },
  
  // Cache settings for optimal CDN performance
  CACHE: {
    maxAge: 86400,  // 24 hours in seconds
    staleWhileRevalidate: 604800  // 7 days in seconds
  }
};

// Export configuration for different environments (browser vs Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.KLAVIYO_WEBFLOW_CONFIG = CONFIG;
} 