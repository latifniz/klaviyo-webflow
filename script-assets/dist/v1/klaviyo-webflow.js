/**
 * Klaviyo-Webflow Integration
 * 
 * Main entry point for the Klaviyo-Webflow integration service.
 * Provides a simple API for initializing and configuring the service.
 * 
 * @version 1.0.0
 * @license MIT
 */

(function() {
  // Service components
  let serviceConfig = {};
  let helpers = {};
  let apiClient = {};
  let formProcessor = {};
  
  // Main service object
  const KlaviyoWebflow = {
    // Public API Key (Site ID) for Klaviyo - can be overridden per form
    publicApiKey: '',
    
    // Default form configuration
    defaultConfig: {
      // Default list ID for Klaviyo - can be overridden per form
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
    
    // Form specific configuration by form ID or class
    forms: {},
    
    // Storage for loaded resources
    _resources: {
      libPhoneNumberLoaded: false,
      klaviyoJsLoaded: false
    },
    
    /**
     * Initialize the service
     * @param {Object} config - User configuration
     */
    init: function(config) {
      // Load the global configuration
      this._loadConfig(function(globalConfig) {
        // Merge provided config with defaults
        serviceConfig = globalConfig;
        
        if (config) {
          if (config.publicApiKey) KlaviyoWebflow.publicApiKey = config.publicApiKey;
          if (config.defaultConfig) KlaviyoWebflow.defaultConfig = helpers.mergeObjects(KlaviyoWebflow.defaultConfig, config.defaultConfig);
          if (config.forms) KlaviyoWebflow.forms = config.forms;
        }
        
        // Store the merged configuration to the global config
        serviceConfig.publicApiKey = KlaviyoWebflow.publicApiKey;
        serviceConfig.DEFAULT_CONFIG = KlaviyoWebflow.defaultConfig;
        serviceConfig.forms = KlaviyoWebflow.forms;
        
        // Load dependencies
        KlaviyoWebflow._loadDependencies(function() {
          // Initialize components
          apiClient.init(serviceConfig, helpers);
          formProcessor.init(serviceConfig, helpers, apiClient);
          
          // Initialize forms when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', KlaviyoWebflow._onDOMReady);
          } else {
            KlaviyoWebflow._onDOMReady();
          }
        });
      });
    },
    
    /**
     * Load global configuration
     * @param {Function} callback - Callback when config is loaded
     * @private
     */
    _loadConfig: function(callback) {
      // Use global config if already loaded
      if (window.KLAVIYO_WEBFLOW_CONFIG) {
        callback(window.KLAVIYO_WEBFLOW_CONFIG);
        return;
      }
      
      // Otherwise fetch it from the CDN
      try {
        // Try to get the config from the current script's location
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];
        const scriptSrc = currentScript.src;
        
        // Extract base path from script URL
        const basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
        const configUrl = `${basePath}../config/config.js`;
        
        // Create script element to load config
        const configScript = document.createElement('script');
        configScript.src = configUrl;
        configScript.async = false;
        
        configScript.onload = function() {
          if (window.KLAVIYO_WEBFLOW_CONFIG) {
            callback(window.KLAVIYO_WEBFLOW_CONFIG);
          } else {
            // Fallback to default config
            callback({
              VERSION: {
                service: '1.0.0',
                klaviyoVersions: {
                  'latest': '2025-04-15',
                  '2025-04-15': {
                    endpoint: 'https://a.klaviyo.com/client/subscriptions/',
                    features: ['email', 'sms', 'customProps', 'phoneValidation']
                  }
                }
              },
              DEFAULT_FIELD_MAPPINGS: {
                'email': 'email',
                'name': 'first_name',
                'first-name': 'first_name',
                'firstname': 'first_name',
                'last-name': 'last_name',
                'lastname': 'last_name',
                'phone': 'phone_number',
                'phone-number': 'phone_number'
              }
            });
          }
        };
        
        configScript.onerror = function() {
          // Fallback to default config on error
          callback({
            VERSION: {
              service: '1.0.0',
              klaviyoVersions: {
                'latest': '2025-04-15',
                '2025-04-15': {
                  endpoint: 'https://a.klaviyo.com/client/subscriptions/',
                  features: ['email', 'sms', 'customProps', 'phoneValidation']
                }
              }
            },
            DEFAULT_FIELD_MAPPINGS: {
              'email': 'email',
              'name': 'first_name',
              'first-name': 'first_name',
              'firstname': 'first_name',
              'last-name': 'last_name',
              'lastname': 'last_name',
              'phone': 'phone_number',
              'phone-number': 'phone_number'
            }
          });
        };
        
        document.head.appendChild(configScript);
      } catch (error) {
        // Fallback to default config on error
        callback({
          VERSION: {
            service: '1.0.0',
            klaviyoVersions: {
              'latest': '2025-04-15',
              '2025-04-15': {
                endpoint: 'https://a.klaviyo.com/client/subscriptions/',
                features: ['email', 'sms', 'customProps', 'phoneValidation']
              }
            }
          },
          DEFAULT_FIELD_MAPPINGS: {
            'email': 'email',
            'name': 'first_name',
            'first-name': 'first_name',
            'firstname': 'first_name',
            'last-name': 'last_name',
            'lastname': 'last_name',
            'phone': 'phone_number',
            'phone-number': 'phone_number'
          }
        });
      }
    },
    
    /**
     * Load required dependencies
     * @param {Function} callback - Callback when dependencies are loaded
     * @private
     */
    _loadDependencies: function(callback) {
      // Load helpers
      this._loadHelpers(function() {
        // Load API client
        KlaviyoWebflow._loadApiClient(function() {
          // Load form processor
          KlaviyoWebflow._loadFormProcessor(function() {
            // Load Klaviyo.js and libphonenumber.js if needed
            let pendingLoads = 0;
            
            // Load Klaviyo.js if a public API key is provided
            if (KlaviyoWebflow.publicApiKey) {
              pendingLoads++;
              KlaviyoWebflow._loadKlaviyoJS(KlaviyoWebflow.publicApiKey, function() {
                pendingLoads--;
                if (pendingLoads === 0) callback();
              });
            }
            
            // Load libphonenumber if needed
            if (KlaviyoWebflow.defaultConfig.useLibPhoneNumber) {
              pendingLoads++;
              KlaviyoWebflow._loadLibPhoneNumber(function() {
                pendingLoads--;
                if (pendingLoads === 0) callback();
              });
            }
            
            // If no external dependencies, call callback immediately
            if (pendingLoads === 0) callback();
          });
        });
      });
    },
    
    /**
     * Load helpers module
     * @param {Function} callback - Callback when loaded
     * @private
     */
    _loadHelpers: function(callback) {
      // Use global helpers if already loaded
      if (window.KlaviyoHelpers) {
        helpers = window.KlaviyoHelpers;
        callback();
        return;
      }
      
      // Otherwise load them from the same path as this script
      try {
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];
        const scriptSrc = currentScript.src;
        
        // Extract base path from script URL
        const basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
        const helpersUrl = `${basePath}utils/helpers.js`;
        
        // Create script element to load helpers
        const helpersScript = document.createElement('script');
        helpersScript.src = helpersUrl;
        helpersScript.async = false;
        
        helpersScript.onload = function() {
          if (window.KlaviyoHelpers) {
            helpers = window.KlaviyoHelpers;
            callback();
          } else {
            // Create minimal helpers
            helpers = {
              mergeObjects: function(target, source) {
                return Object.assign({}, target, source);
              },
              log: function(message, level) {
                if (level === 'error') {
                  console.error('Klaviyo-Webflow: ' + message);
                } else if (level === 'warn') {
                  console.warn('Klaviyo-Webflow: ' + message);
                } else {
                  console.log('Klaviyo-Webflow: ' + message);
                }
              }
            };
            callback();
          }
        };
        
        helpersScript.onerror = function() {
          // Create minimal helpers on error
          helpers = {
            mergeObjects: function(target, source) {
              return Object.assign({}, target, source);
            },
            log: function(message, level) {
              if (level === 'error') {
                console.error('Klaviyo-Webflow: ' + message);
              } else if (level === 'warn') {
                console.warn('Klaviyo-Webflow: ' + message);
              } else {
                console.log('Klaviyo-Webflow: ' + message);
              }
            }
          };
          callback();
        };
        
        document.head.appendChild(helpersScript);
      } catch (error) {
        // Create minimal helpers on error
        helpers = {
          mergeObjects: function(target, source) {
            return Object.assign({}, target, source);
          },
          log: function(message, level) {
            if (level === 'error') {
              console.error('Klaviyo-Webflow: ' + message);
            } else if (level === 'warn') {
              console.warn('Klaviyo-Webflow: ' + message);
            } else {
              console.log('Klaviyo-Webflow: ' + message);
            }
          }
        };
        callback();
      }
    },
    
    /**
     * Load API client module
     * @param {Function} callback - Callback when loaded
     * @private
     */
    _loadApiClient: function(callback) {
      // Use global API client if already loaded
      if (window.KlaviyoApiClient) {
        apiClient = window.KlaviyoApiClient;
        callback();
        return;
      }
      
      // Otherwise load it from the same path as this script
      try {
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];
        const scriptSrc = currentScript.src;
        
        // Extract base path from script URL
        const basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
        const apiClientUrl = `${basePath}core/api-client.js`;
        
        // Create script element to load API client
        const apiClientScript = document.createElement('script');
        apiClientScript.src = apiClientUrl;
        apiClientScript.async = false;
        
        apiClientScript.onload = function() {
          if (window.KlaviyoApiClient) {
            apiClient = window.KlaviyoApiClient;
            callback();
          } else {
            // Create minimal API client
            apiClient = {
              init: function() {},
              createClientSubscription: function() {
                return Promise.reject(new Error('API client not loaded'));
              },
              trackEvent: function() {
                return Promise.reject(new Error('API client not loaded'));
              }
            };
            callback();
          }
        };
        
        apiClientScript.onerror = function() {
          // Create minimal API client on error
          apiClient = {
            init: function() {},
            createClientSubscription: function() {
              return Promise.reject(new Error('API client not loaded'));
            },
            trackEvent: function() {
              return Promise.reject(new Error('API client not loaded'));
            }
          };
          callback();
        };
        
        document.head.appendChild(apiClientScript);
      } catch (error) {
        // Create minimal API client on error
        apiClient = {
          init: function() {},
          createClientSubscription: function() {
            return Promise.reject(new Error('API client not loaded'));
          },
          trackEvent: function() {
            return Promise.reject(new Error('API client not loaded'));
          }
        };
        callback();
      }
    },
    
    /**
     * Load form processor module
     * @param {Function} callback - Callback when loaded
     * @private
     */
    _loadFormProcessor: function(callback) {
      // Use global form processor if already loaded
      if (window.KlaviyoFormProcessor) {
        formProcessor = window.KlaviyoFormProcessor;
        callback();
        return;
      }
      
      // Otherwise load it from the same path as this script
      try {
        const scripts = document.getElementsByTagName('script');
        const currentScript = scripts[scripts.length - 1];
        const scriptSrc = currentScript.src;
        
        // Extract base path from script URL
        const basePath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
        const formProcessorUrl = `${basePath}core/form-processor.js`;
        
        // Create script element to load form processor
        const formProcessorScript = document.createElement('script');
        formProcessorScript.src = formProcessorUrl;
        formProcessorScript.async = false;
        
        formProcessorScript.onload = function() {
          if (window.KlaviyoFormProcessor) {
            formProcessor = window.KlaviyoFormProcessor;
            callback();
          } else {
            // Create minimal form processor
            formProcessor = {
              init: function() {},
              setupForm: function() {},
              initAllForms: function() { return 0; }
            };
            callback();
          }
        };
        
        formProcessorScript.onerror = function() {
          // Create minimal form processor on error
          formProcessor = {
            init: function() {},
            setupForm: function() {},
            initAllForms: function() { return 0; }
          };
          callback();
        };
        
        document.head.appendChild(formProcessorScript);
      } catch (error) {
        // Create minimal form processor on error
        formProcessor = {
          init: function() {},
          setupForm: function() {},
          initAllForms: function() { return 0; }
        };
        callback();
      }
    },
    
    /**
     * Load Klaviyo.js for a specific API key
     * @param {string} apiKey - Klaviyo public API key
     * @param {Function} callback - Callback when loaded
     * @private
     */
    _loadKlaviyoJS: function(apiKey, callback) {
      if (window.klaviyo) {
        this._resources.klaviyoJsLoaded = true;
        callback();
        return;
      }
      
      // Add the klaviyo object to the page
      // This is Klaviyo's recommended script snippet
      !function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
      
      // Add Klaviyo's main script
      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = `//static.klaviyo.com/onsite/js/${apiKey}/klaviyo.js`;
      script.onload = () => {
        this._resources.klaviyoJsLoaded = true;
        if (helpers.log) helpers.log('Klaviyo.js loaded successfully', 'debug');
        callback();
      };
      script.onerror = () => {
        if (helpers.log) helpers.log('Failed to load Klaviyo.js - check your API key', 'error');
        callback();
      };
      document.head.appendChild(script);
    },
    
    /**
     * Load libphonenumber-js for phone formatting
     * @param {Function} callback - Callback when loaded
     * @private
     */
    _loadLibPhoneNumber: function(callback) {
      if (window.libphonenumber) {
        this._resources.libPhoneNumberLoaded = true;
        callback();
        return;
      }
      
      // Get dependency URL/integrity from config if available
      let libPhoneNumberUrl = 'https://cdnjs.cloudflare.com/ajax/libs/libphonenumber-js/1.10.20/libphonenumber-js.min.js';
      let libPhoneNumberIntegrity = '';
      
      if (serviceConfig.DEPENDENCIES && serviceConfig.DEPENDENCIES.libPhoneNumber) {
        libPhoneNumberUrl = serviceConfig.DEPENDENCIES.libPhoneNumber.url || libPhoneNumberUrl;
        libPhoneNumberIntegrity = serviceConfig.DEPENDENCIES.libPhoneNumber.integrity || '';
      }
      
      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = libPhoneNumberUrl;
      
      // Add integrity check if available
      if (libPhoneNumberIntegrity) {
        script.integrity = libPhoneNumberIntegrity;
        script.crossOrigin = 'anonymous';
      }
      
      script.onload = () => {
        this._resources.libPhoneNumberLoaded = true;
        if (helpers.log) helpers.log('libphonenumber-js loaded successfully', 'debug');
        callback();
      };
      script.onerror = () => {
        if (helpers.log) helpers.log('Failed to load libphonenumber-js', 'warn');
        callback();
      };
      document.head.appendChild(script);
    },
    
    /**
     * When DOM is ready
     * @private
     */
    _onDOMReady: function() {
      // Initialize all forms
      formProcessor.initAllForms();
    }
  };
  
  // Expose the global API
  window.KlaviyoWebflow = KlaviyoWebflow;
  
  // Expose a global 'initKlaviyoWebflow' function
  window.initKlaviyoWebflow = function(config) {
    window.KlaviyoWebflow.init(config);
  };
  
  // Add a global helper for support/debugging
  window.klaviyoWebflowDebug = function() {
    return {
      version: serviceConfig.VERSION ? serviceConfig.VERSION.service : '1.0.0',
      apiRevision: serviceConfig.VERSION ? serviceConfig.VERSION.klaviyoVersions.latest : '2025-04-15',
      formsFound: formProcessor.findKlaviyoForms ? formProcessor.findKlaviyoForms().length : 0,
      forms: formProcessor.findKlaviyoForms ? formProcessor.findKlaviyoForms().map(form => ({
        id: form.id,
        classes: form.className,
        hasApiKey: !!form.getAttribute('data-klaviyo-account-id'),
        hasListId: !!form.getAttribute('data-klaviyo-list-id'),
        initialized: form.hasAttribute('data-klaviyo-initialized')
      })) : [],
      resources: KlaviyoWebflow._resources
    };
  };
  
  // Auto-initialize if there's a data-auto-init attribute
  if (document.querySelector('[data-klaviyo-auto-init]')) {
    let autoInitConfig = {};
    const autoInitEl = document.querySelector('[data-klaviyo-auto-init]');
    
    // Check for config JSON
    try {
      const configJson = autoInitEl.getAttribute('data-klaviyo-auto-init');
      if (configJson && configJson !== 'true') {
        autoInitConfig = JSON.parse(configJson);
      }
    } catch (e) {
      console.error('Klaviyo-Webflow: Error parsing auto-init config', e);
    }
    
    // Auto-initialize
    window.initKlaviyoWebflow(autoInitConfig);
  }
})(); 