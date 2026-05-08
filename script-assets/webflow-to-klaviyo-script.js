/**
 * Klaviyo-Webflow Integration Script
 * 
 * A professional script for integrating Webflow forms with Klaviyo.
 * 
 * Features:
 * - Multi-account support
 * - Per-form configuration via HTML attributes or JavaScript
 * - Email and SMS subscription support
 * - International phone number formatting
 * - Custom field mapping
 * - Event tracking
 * - Error and success handling
 * 
 * @version 1.1.0
 * @author Your Company
 * @license MIT
 */

(function() {
    // Version info for update checks
    const VERSION = {
      number: '1.1.0',
      api: '2025-04-15' // Klaviyo API revision this script is compatible with
    };
  
    // Klaviyo API configuration
    const KLAVIYO_API_CONFIG = {
      endpoint: 'https://a.klaviyo.com/client/subscriptions/',
      revision: VERSION.api
    };
  
    // Standard field mappings from Webflow to Klaviyo
    const DEFAULT_FIELD_MAPPINGS = {
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
    };
  
    // Configuration object that users can customize
    window.KlaviyoWebflow = window.KlaviyoWebflow || {
      // Default public API Key (Site ID) for Klaviyo - can be overridden per form
      publicApiKey: '',
      
      // Default form configuration
      defaultConfig: {
        // Default list ID for Klaviyo - can be overridden per form
        listId: '',
        // Default field mapping (will be merged with DEFAULT_FIELD_MAPPINGS)
        fieldMapping: {},
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
      
      // Initialize the script
      init: function(config) {
        // Merge provided config with default
        if (config) {
          if (config.publicApiKey) this.publicApiKey = config.publicApiKey;
          if (config.defaultConfig) this.defaultConfig = this._mergeObjects(this.defaultConfig, config.defaultConfig);
          if (config.forms) this.forms = config.forms;
        }
        
        // Check if any Klaviyo API key is provided (global or in forms)
        if (!this.publicApiKey && !this._hasFormWithApiKey()) {
          this._log('No Klaviyo public API key provided. Each form will need its own key.', 'warn');
        }
  
        // Load Klaviyo.js if a global API key is provided
        if (this.publicApiKey) {
          this.loadKlaviyoJS(this.publicApiKey);
        }
        
        // Load libphonenumber if needed
        if (this.defaultConfig.useLibPhoneNumber) {
          this.loadLibPhoneNumber();
        }
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
        } else {
          this.onDOMReady();
        }
        
        // Check for updates if in debug mode
        if (this.defaultConfig.debug) {
          this._checkForUpdates();
        }
      },
      
      // Check if any form has its own API key configured
      _hasFormWithApiKey: function() {
        if (!this.forms) return false;
        
        for (const formId in this.forms) {
          if (this.forms[formId].publicApiKey) {
            return true;
          }
        }
        
        return false;
      },
      
      // Utility function for safe object merging
      _mergeObjects: function(target, source) {
        const result = Object.assign({}, target);
        
        if (!source) return result;
        
        Object.keys(source).forEach(key => {
          if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            if (typeof result[key] === 'object' && result[key] !== null) {
              result[key] = this._mergeObjects(result[key], source[key]);
            } else {
              result[key] = source[key];
            }
          } else {
            result[key] = source[key];
          }
        });
        
        return result;
      },
      
      // Logging function that respects debug setting
      _log: function(message, level = 'log') {
        if (this.defaultConfig.debug || level === 'error' || level === 'warn') {
          console[level](`Klaviyo-Webflow: ${message}`);
        }
      },
      
      // Load Klaviyo.js for a specific API key
      loadKlaviyoJS: function(apiKey) {
        if (window.klaviyo) {
          this._resources.klaviyoJsLoaded = true;
          return;
        }
        
        // Add the klaviyo object to the page
        !function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();
        
        // Add Klaviyo's main script
        const script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = `//static.klaviyo.com/onsite/js/${apiKey}/klaviyo.js`;
        script.onload = () => {
          this._resources.klaviyoJsLoaded = true;
          this._log('Klaviyo.js loaded successfully');
        };
        script.onerror = () => {
          this._log('Failed to load Klaviyo.js - check your API key', 'error');
        };
        document.head.appendChild(script);
      },
      
      // Load libphonenumber-js for phone formatting
      loadLibPhoneNumber: function() {
        if (window.libphonenumber) {
          this._resources.libPhoneNumberLoaded = true;
          return;
        }
        
        const script = document.createElement('script');
        script.async = true;
        script.type = 'text/javascript';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/libphonenumber-js/1.10.20/libphonenumber-js.min.js';
        script.onload = () => {
          this._resources.libPhoneNumberLoaded = true;
          this._log('libphonenumber-js loaded successfully');
        };
        script.onerror = () => {
          this._log('Failed to load libphonenumber-js', 'warn');
        };
        document.head.appendChild(script);
      },
      
      // Check for script updates
      _checkForUpdates: function() {
        fetch('https://api.example.com/klaviyo-webflow/version.json')
          .then(response => response.json())
          .then(data => {
            if (data.version && data.version !== VERSION.number) {
              this._log(`A new version (${data.version}) is available. You're using ${VERSION.number}`, 'warn');
            }
            if (data.api_revision && data.api_revision !== VERSION.api) {
              this._log(`This script is built for Klaviyo API revision ${VERSION.api}, but the current revision is ${data.api_revision}. An update may be required.`, 'warn');
            }
          })
          .catch(error => {
            // Silently fail - version check is non-critical
          });
      },
      
      // When DOM is ready
      onDOMReady: function() {
        // Find forms to process - look for the following:
        // 1. Forms with klaviyo-form class
        // 2. Forms with data-klaviyo-form attribute
        // 3. Forms with data-klaviyo-account-id attribute 
        // 4. Forms with data-klaviyo-list-id attribute
        // 5. Forms with IDs that match configured forms
        const klaviyoForms = document.querySelectorAll(
          '.klaviyo-form, [data-klaviyo-form], [data-klaviyo-account-id], [data-klaviyo-list-id]'
        );
        
        // Process detected forms
        klaviyoForms.forEach(form => {
          const formId = form.id;
          this.setupForm(form, formId);
        });
        
        // Find forms explicitly configured by ID
        if (this.forms) {
          for (const formId in this.forms) {
            const form = document.getElementById(formId);
            if (form && !form.classList.contains('klaviyo-form') && 
                !form.hasAttribute('data-klaviyo-form') &&
                !form.hasAttribute('data-klaviyo-account-id') &&
                !form.hasAttribute('data-klaviyo-list-id')) {
              this.setupForm(form, formId);
            }
          }
        }
      },
      
      // Extract configuration for a specific form from attributes and config objects
      getFormConfig: function(form, formId) {
        // Start with default config
        const config = Object.assign({}, this.defaultConfig);
        
        // Add form-specific config from JS (if available)
        if (formId && this.forms && this.forms[formId]) {
          Object.assign(config, this.forms[formId]);
        }
        
        // Check for form attributes that override config
        // 1. List ID
        const listIdAttr = form.getAttribute('data-klaviyo-list-id');
        if (listIdAttr) {
          config.listId = listIdAttr;
        }
        
        // 2. Account ID (Public API Key)
        const accountIdAttr = form.getAttribute('data-klaviyo-account-id');
        if (accountIdAttr) {
          config.publicApiKey = accountIdAttr;
        }
        
        // If we still don't have a public API key, use the global one
        if (!config.publicApiKey) {
          config.publicApiKey = this.publicApiKey;
        }
        
        // 3. Check for "advanced config" as a JSON string
        // This allows setting any config option via data attribute
        const advancedConfigAttr = form.getAttribute('data-klaviyo-config');
        if (advancedConfigAttr) {
          try {
            const advancedConfig = JSON.parse(advancedConfigAttr);
            Object.assign(config, advancedConfig);
          } catch (e) {
            this._log(`Error parsing data-klaviyo-config attribute: ${e.message}`, 'error');
          }
        }
        
        // Merge field mappings with defaults
        config.fieldMapping = this._mergeObjects(DEFAULT_FIELD_MAPPINGS, config.fieldMapping || {});
        
        return config;
      },
      
      // Setup a single form
      setupForm: function(form, formId) {
        // Get form-specific configuration
        const formConfig = this.getFormConfig(form, formId);
        
        // Validate configuration
        if (!formConfig.publicApiKey) {
          this._log(`Form ${formId || 'unknown'} has no Klaviyo account ID (public API key). Skipping setup.`, 'warn');
          return;
        }
        
        // Load Klaviyo.js for this account if different from global
        if (formConfig.publicApiKey !== this.publicApiKey) {
          this.loadKlaviyoJS(formConfig.publicApiKey);
        }
        
        // Track form view if enabled
        if (formConfig.tracking && formConfig.tracking.viewForm) {
          this.trackFormView(form, formConfig);
        }
        
        // Don't add multiple handlers to the same form
        if (form.hasAttribute('data-klaviyo-initialized')) {
          return;
        }
        
        // Add submit handler
        form.addEventListener('submit', (event) => {
          // Prevent default form submission
          event.preventDefault();
          
          // Process the form data
          this.handleFormSubmit(event, form, formConfig);
        });
        
        // Mark the form as initialized
        form.setAttribute('data-klaviyo-initialized', 'true');
        
        // Add custom validation for phone if needed
        if (formConfig.useLibPhoneNumber) {
          this.setupPhoneValidation(form, formConfig);
        }
        
        this._log(`Form ${formId || form.className || 'unknown'} initialized for Klaviyo account ${formConfig.publicApiKey}`);
      },
      
      // Setup phone validation
      setupPhoneValidation: function(form, formConfig) {
        // Find phone fields
        const phoneSelectors = ['[name="phone"]', '[name="phone-number"]', '[name="phone_number"]', 
                              '[data-klaviyo-field="phone_number"]'];
        
        // Add custom field mappings for phone
        for (const [field, mapping] of Object.entries(formConfig.fieldMapping)) {
          if (mapping === 'phone_number') {
            phoneSelectors.push(`[name="${field}"]`);
          }
        }
        
        // Find first matching phone field
        let phoneField = null;
        for (const selector of phoneSelectors) {
          const field = form.querySelector(selector);
          if (field) {
            phoneField = field;
            break;
          }
        }
        
        if (!phoneField) {
          return; // No phone field found
        }
        
        // Add validation on blur/change
        phoneField.addEventListener('blur', () => {
          this.validatePhoneField(phoneField, form);
        });
        
        phoneField.addEventListener('change', () => {
          this.validatePhoneField(phoneField, form);
        });
      },
      
      // Validate phone field
      validatePhoneField: function(phoneField, form) {
        if (!phoneField.value || !window.libphonenumber) {
          return; // Skip empty fields or if library isn't loaded
        }
        
        try {
          // Get country from form if available
          const countryField = form.querySelector('[name="country"]');
          const defaultCountry = countryField ? countryField.value : 'US';
          
          // Try to parse the phone number
          const parsed = libphonenumber.parsePhoneNumber(phoneField.value, defaultCountry);
          
          if (!parsed || !parsed.isValid()) {
            phoneField.setCustomValidity('Please enter a valid phone number');
            
            // Add visual indication
            phoneField.classList.add('klaviyo-invalid-phone');
            
            return false;
          } else {
            // Format the phone number correctly
            phoneField.value = parsed.formatInternational();
            
            // Clear any previous validation error
            phoneField.setCustomValidity('');
            phoneField.classList.remove('klaviyo-invalid-phone');
            
            return true;
          }
        } catch (e) {
          this._log(`Phone validation error: ${e.message}`, 'warn');
          return false;
        }
      },
      
      // Format phone number using libphonenumber-js
      formatPhoneNumber: function(number, defaultCountry = 'US') {
        if (!window.libphonenumber || !number) return number;
        
        try {
          // Parse and format the number using the provided country code
          const parsedNumber = libphonenumber.parsePhoneNumber(number, defaultCountry);
          
          if (parsedNumber && parsedNumber.isValid()) {
            return parsedNumber.format('E.164'); // Convert to E.164 format
          } else {
            this._log('Invalid phone number: ' + number, 'warn');
            return null;
          }
        } catch (error) {
          this._log('Error parsing phone number: ' + error.message, 'error');
          return null;
        }
      },
      
      // Track form view event
      trackFormView: function(form, formConfig) {
        const formName = form.getAttribute('data-name') || form.id || 'Unknown Form';
        const apiKey = formConfig.publicApiKey;
        
        // Only track if Klaviyo is loaded
        if (window.klaviyo && this._resources.klaviyoJsLoaded) {
          klaviyo.track('Viewed Form', {
            'Form Name': formName,
            'Form ID': form.id,
            'Page URL': window.location.href,
            'Page Title': document.title,
            'Klaviyo Account': apiKey
          });
        } else {
          // Queue the tracking event for when Klaviyo loads
          window._klOnsite = window._klOnsite || [];
          window._klOnsite.push(['track', 'Viewed Form', {
            'Form Name': formName,
            'Form ID': form.id,
            'Page URL': window.location.href,
            'Page Title': document.title,
            'Klaviyo Account': apiKey
          }]);
        }
      },
      
      // Handle form submission
      handleFormSubmit: function(event, form, formConfig) {
        // Clear any previous error messages
        this.clearMessages(form);
        
        // Get form data and map to Klaviyo structure
        const formData = this.processFormData(form, formConfig);
        
        // Validate form data
        if (!this.validateFormData(formData, form)) {
          return;
        }
        
        // Prepare subscription data
        const subscriptionData = this.prepareSubscriptionData(formData, formConfig, form);
        
        // Send data to Klaviyo
        this.submitToKlaviyo(subscriptionData, formConfig, form)
          .then(() => {
            // Show success message
            this.showSuccessMessage(form);
            
            // Track successful submission if enabled
            if (formConfig.tracking.submitForm) {
              this.trackFormSubmit(form, formConfig, formData.attributes);
            }
            
            // If it's a Webflow AJAX form, trigger their success behavior
            this.triggerWebflowSuccess(form);
            
            // Fire any custom success callbacks
            const successEvent = new CustomEvent('klaviyoSubmitSuccess', {
              detail: { formData: formData, subscriptionData: subscriptionData }
            });
            form.dispatchEvent(successEvent);
            document.dispatchEvent(successEvent);
            
            this._log(`Form submitted successfully to Klaviyo account ${formConfig.publicApiKey}`);
          })
          .catch(error => {
            this._log(`Error submitting to Klaviyo: ${JSON.stringify(error)}`, 'error');
            this.showErrorMessage(form, 'Error submitting form to Klaviyo. Please try again.');
            
            // Fire any custom error callbacks
            const errorEvent = new CustomEvent('klaviyoSubmitError', {
              detail: { error: error, formData: formData }
            });
            form.dispatchEvent(errorEvent);
            document.dispatchEvent(errorEvent);
          });
      },
      
      // Trigger Webflow's success state for AJAX forms
      triggerWebflowSuccess: function(form) {
        // Check if it's a Webflow form
        if (!form.hasAttribute('data-wf-form-ajax')) {
          return;
        }
        
        // Find Webflow's success element
        const successEl = form.parentElement.querySelector('.w-form-done');
        const formEl = form.parentElement.querySelector('form');
        const failEl = form.parentElement.querySelector('.w-form-fail');
        
        if (successEl) {
          // Hide the form and error message
          if (formEl) formEl.style.display = 'none';
          if (failEl) failEl.style.display = 'none';
          
          // Show success message
          successEl.style.display = 'block';
        }
      },
      
      // Process form data and map fields
      processFormData: function(form, formConfig) {
        const formData = new FormData(form);
        const mappings = formConfig.fieldMapping;
        const attributes = {};
        const location = {};
        const properties = Object.assign({}, formConfig.customProperties);
        
        // Process form fields
        for (const [key, value] of formData.entries()) {
          if (!value) continue; // Skip empty values
          
          const mappedKey = mappings[key.toLowerCase()] || key;
          
          // Handle nested location fields
          if (mappedKey.startsWith('location.')) {
            const locationKey = mappedKey.replace('location.', '');
            location[locationKey] = value;
            continue;
          }
          
          // Handle standard attributes
          if (Object.values(mappings).includes(mappedKey)) {
            attributes[mappedKey] = value;
            continue;
          }
          
          // Handle special case: phone number
          if (key.toLowerCase().includes('phone') && formConfig.useLibPhoneNumber) {
            const countryInput = form.querySelector('[name="country"]');
            const defaultCountry = countryInput ? countryInput.value : 'US';
            const formattedPhone = this.formatPhoneNumber(value, defaultCountry);
            
            if (formattedPhone) {
              attributes['phone_number'] = formattedPhone;
            }
            continue;
          }
          
          // Check for custom field mapping with data attribute
          const customMapping = form.querySelector(`[name="${key}"]`)?.getAttribute('data-klaviyo-field');
          if (customMapping) {
            if (customMapping.includes('.')) {
              // Handle nested fields specified in data attribute
              const [parent, child] = customMapping.split('.');
              if (!attributes[parent]) attributes[parent] = {};
              attributes[parent][child] = value;
            } else {
              attributes[customMapping] = value;
            }
            continue;
          }
          
          // Add as custom property
          properties[key] = value;
        }
        
        // Add location data if any exists
        if (Object.keys(location).length > 0) {
          attributes.location = location;
        }
        
        // Add custom properties if any exist
        if (Object.keys(properties).length > 0) {
          attributes.properties = properties;
        }
        
        // Handle full name splitting if no first/last name
        if (!attributes.first_name && !attributes.last_name && attributes.name) {
          const nameParts = attributes.name.split(' ');
          attributes.first_name = nameParts[0] || '';
          attributes.last_name = nameParts.slice(1).join(' ') || '';
          delete attributes.name;
        }
        
        // Check if there are any data attributes with klaviyo properties on the form itself
        const formKlaviyoProps = this.getFormKlaviyoProps(form);
        if (formKlaviyoProps) {
          // Merge form-level properties with attributes
          Object.assign(attributes, formKlaviyoProps);
        }
        
        return { attributes };
      },
      
      // Get Klaviyo properties from form data attributes
      getFormKlaviyoProps: function(form) {
        const props = {};
        const dataAttrs = form.attributes;
        
        for (let i = 0; i < dataAttrs.length; i++) {
          const attr = dataAttrs[i];
          if (attr.name.startsWith('data-klaviyo-property-')) {
            const propName = attr.name.replace('data-klaviyo-property-', '');
            props[propName] = attr.value;
          }
        }
        
        return Object.keys(props).length > 0 ? props : null;
      },
      
      // Validate form data
      validateFormData: function(formData, form) {
        const attributes = formData.attributes;
        
        // Check if at least email or phone is provided
        if (!attributes.email && !attributes.phone_number) {
          this.showErrorMessage(form, 'Please provide either an email or a phone number.');
          return false;
        }
        
        // Check if phone number is valid (if provided)
        if (attributes.phone_number === null && form.querySelector('[name*="phone"]')) {
          this.showErrorMessage(form, 'Please enter a valid phone number.');
          return false;
        }
        
        // Check if email is valid (if provided)
        if (attributes.email && !this.isValidEmail(attributes.email)) {
          this.showErrorMessage(form, 'Please enter a valid email address.');
          return false;
        }
        
        return true;
      },
      
      // Email validation helper
      isValidEmail: function(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
      },
      
      // Prepare subscription data for Klaviyo
      prepareSubscriptionData: function(formData, formConfig, form) {
        const customSource = form.getAttribute('data-klaviyo-source') || 
                            form.getAttribute('data-name') || 
                            form.id || 
                            'Webflow Form';
        const attributes = formData.attributes;
        const subscriptions = {};
        
        // Add email subscription if email is provided
        if (attributes.email) {
          const emailConsent = form.querySelector('[name="email_consent"]');
          const emailMarketingConsent = form.querySelector('[name="email_marketing_consent"]');
          
          // Default to SUBSCRIBED unless explicitly set to false
          const consent = (emailConsent && emailConsent.value === 'false') || 
                        (emailMarketingConsent && emailMarketingConsent.value === 'false') ? 
                        null : 'SUBSCRIBED';
          
          if (consent) {
            subscriptions.email = {
              marketing: {
                consent: consent
              }
            };
          }
        }
        
        // Add SMS subscription if phone is provided
        if (attributes.phone_number) {
          const smsConsent = form.querySelector('[name="sms_consent"]');
          const smsMarketingConsent = form.querySelector('[name="sms_marketing_consent"]');
          
          // Default to SUBSCRIBED unless explicitly set to false
          const consent = (smsConsent && smsConsent.value === 'false') || 
                        (smsMarketingConsent && smsMarketingConsent.value === 'false') ? 
                        null : 'SUBSCRIBED';
          
          if (consent) {
            subscriptions.sms = {
              marketing: {
                consent: consent
              }
            };
          }
        }
        
        // Add subscriptions to attributes if any exist
        if (Object.keys(subscriptions).length > 0) {
          attributes.subscriptions = subscriptions;
        }
        
        // Get list ID (from form attribute or config)
        let listId = form.getAttribute('data-klaviyo-list-id') || formConfig.listId;
        
        const data = {
          data: {
            type: 'subscription',
            attributes: {
              custom_source: customSource,
              profile: {
                data: {
                  type: 'profile',
                  attributes: attributes
                }
              }
            }
          }
        };
        
        // Add list relationship if a list ID is provided
        if (listId) {
          data.data.attributes.relationships = {
            list: {
              data: {
                type: 'list',
                id: listId
              }
            }
          };
        }
        
        return data;
      },
      
      // Submit data to Klaviyo
      submitToKlaviyo: function(subscriptionData, formConfig, form) {
        return new Promise((resolve, reject) => {
          // Get the Klaviyo account ID (public API key)
          const apiKey = formConfig.publicApiKey;
          
          if (!apiKey) {
            reject(new Error('No Klaviyo account ID (public API key) provided'));
            return;
          }
          
          // Create URL with public API key
          const url = `${KLAVIYO_API_CONFIG.endpoint}?company_id=${apiKey}`;
          
          // Create headers
          const headers = {
            'Content-Type': 'application/json',
            'revision': KLAVIYO_API_CONFIG.revision
          };
          
          // Log request in debug mode
          if (formConfig.debug) {
            this._log(`Submitting to Klaviyo: ${JSON.stringify(subscriptionData)}`, 'log');
          }
          
          // Perform the fetch request
          fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(subscriptionData)
          })
          .then(response => {
            if (response.status === 202) {
              resolve();
            } else {
              return response.json().then(errorData => {
                reject(errorData);
              }).catch(() => {
                reject(new Error(`HTTP error ${response.status}`));
              });
            }
          })
          .catch(error => {
            reject(error);
          });
        });
      },
      
      // Track form submission event
      trackFormSubmit: function(form, formConfig, profileData) {
        const formName = form.getAttribute('data-name') || form.id || 'Unknown Form';
        const apiKey = formConfig.publicApiKey;
        
        // Remove sensitive data for tracking
        const trackingData = Object.assign({}, profileData);
        delete trackingData.email;
        delete trackingData.phone_number;
        
        // Add form metadata
        trackingData['Form Name'] = formName;
        trackingData['Form ID'] = form.id;
        trackingData['Page URL'] = window.location.href;
        trackingData['Page Title'] = document.title;
        trackingData['Klaviyo Account'] = apiKey;
        
        // Only track if Klaviyo is loaded
        if (window.klaviyo && this._resources.klaviyoJsLoaded) {
          klaviyo.track('Submitted Form', trackingData);
        } else {
               // Queue the tracking event for when Klaviyo loads
        window._klOnsite = window._klOnsite || [];
        window._klOnsite.push(['track', 'Submitted Form', trackingData]);
      }
    },
    
    // Show error message
    showErrorMessage: function(form, message) {
      // Look for custom error element
      let errorElement = form.querySelector('.form-error, .custom-error, .w-form-fail');
      
      if (errorElement) {
        // If it has text content, set it
        if (errorElement.querySelector('div')) {
          errorElement.querySelector('div').textContent = message;
        } else {
          errorElement.textContent = message;
        }
        
        // Show the element
        errorElement.style.display = 'block';
      } else {
        // Create a new error element if none exists
        errorElement = document.createElement('div');
        errorElement.className = 'custom-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ff3366';
        errorElement.style.marginTop = '10px';
        form.appendChild(errorElement);
      }
    },
    
    // Show success message
    showSuccessMessage: function(form) {
      // Check if Webflow handles this
      if (form.hasAttribute('data-wf-form-ajax')) {
        return; // Let Webflow handle it
      }
      
      // Look for success element
      let successElement = form.querySelector('.form-success, .custom-success, .w-form-done');
      
      if (successElement) {
        // Hide the form fields
        const formElements = form.querySelectorAll('input, select, textarea, button');
        formElements.forEach(el => {
          el.style.display = 'none';
        });
        
        // Show the element
        successElement.style.display = 'block';
      } else {
        // Hide the form fields
        const formElements = form.querySelectorAll('input, select, textarea, button');
        formElements.forEach(el => {
          el.style.display = 'none';
        });
        
        // Create a new success element if none exists
        successElement = document.createElement('div');
        successElement.className = 'custom-success';
        successElement.textContent = 'Thanks for subscribing!';
        successElement.style.color = '#12b878';
        successElement.style.marginTop = '10px';
        form.appendChild(successElement);
      }
    },
    
    // Clear error and success messages
    clearMessages: function(form) {
      // Clear error messages
      const errorElements = form.querySelectorAll('.form-error, .custom-error, .w-form-fail');
      errorElements.forEach(el => {
        el.style.display = 'none';
      });
      
      // Clear success messages
      const successElements = form.querySelectorAll('.form-success, .custom-success, .w-form-done');
      successElements.forEach(el => {
        el.style.display = 'none';
      });
    }
  };
  
  // Expose a global 'initKlaviyoWebflow' function
  window.initKlaviyoWebflow = function(config) {
    window.KlaviyoWebflow.init(config);
  };
  
  // Add a global helper for support/debugging
  window.klaviyoWebflowDebug = function() {
    return {
      version: VERSION.number,
      apiRevision: VERSION.api,
      formsFound: document.querySelectorAll('.klaviyo-form, [data-klaviyo-form], [data-klaviyo-account-id], [data-klaviyo-list-id]').length,
      forms: Array.from(document.querySelectorAll('.klaviyo-form, [data-klaviyo-form], [data-klaviyo-account-id], [data-klaviyo-list-id]'))
        .map(form => ({
          id: form.id,
          classes: form.className,
          hasApiKey: !!form.getAttribute('data-klaviyo-account-id'),
          hasListId: !!form.getAttribute('data-klaviyo-list-id'),
          initialized: form.hasAttribute('data-klaviyo-initialized')
        })),
      resources: window.KlaviyoWebflow._resources
    };
  };
})();