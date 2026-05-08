/**
 * Klaviyo-Webflow Form Processor
 * 
 * Core functionality for processing Webflow forms and integrating with Klaviyo
 */

const KlaviyoFormProcessor = (function() {
  let config = {};
  let helpers = {};
  let apiClient = {};
  
  /**
   * Initialize the form processor
   * @param {Object} serviceConfig - Global service configuration
   * @param {Object} helperFunctions - Helper utilities
   * @param {Object} klaviyoApiClient - API client
   */
  function init(serviceConfig, helperFunctions, klaviyoApiClient) {
    config = serviceConfig || {};
    helpers = helperFunctions || {};
    apiClient = klaviyoApiClient || {};
    
    // Log initialization
    helpers.log('Form Processor initialized', 'debug');
  }
  
  /**
   * Find all eligible forms in the document
   * @return {Array} Array of form elements
   */
  function findKlaviyoForms() {
    // Find forms with specific markers
    const forms = Array.from(document.querySelectorAll(
      '.klaviyo-form, [data-klaviyo-form], [data-klaviyo-account-id], [data-klaviyo-list-id]'
    ));
    
    // Also find forms configured by ID in the global config
    if (config.forms) {
      for (const formId in config.forms) {
        const form = document.getElementById(formId);
        if (form && !forms.includes(form)) {
          forms.push(form);
        }
      }
    }
    
    return forms;
  }
  
  /**
   * Extract configuration for a specific form from attributes and config objects
   * @param {Element} form - Form element
   * @param {string} formId - Form ID
   * @return {Object} Form configuration
   */
  function getFormConfig(form, formId) {
    // Start with default config
    const defaultConfig = config.DEFAULT_CONFIG || {};
    const result = Object.assign({}, defaultConfig);
    
    // Add form-specific config from JS (if available)
    if (formId && config.forms && config.forms[formId]) {
      Object.assign(result, config.forms[formId]);
    }
    
    // Check for form attributes that override config
    // 1. List ID
    const listIdAttr = form.getAttribute('data-klaviyo-list-id');
    if (listIdAttr) {
      result.listId = listIdAttr;
    }
    
    // 2. Account ID (Public API Key)
    const accountIdAttr = form.getAttribute('data-klaviyo-account-id');
    if (accountIdAttr) {
      result.publicApiKey = accountIdAttr;
    }
    
    // If we still don't have a public API key, use the global one
    if (!result.publicApiKey) {
      result.publicApiKey = config.publicApiKey || '';
    }
    
    // 3. API Version
    const apiVersionAttr = form.getAttribute('data-klaviyo-api-version');
    if (apiVersionAttr) {
      result.apiVersion = apiVersionAttr;
    }
    
    // 4. Check for "advanced config" as a JSON string
    const advancedConfigAttr = form.getAttribute('data-klaviyo-config');
    if (advancedConfigAttr) {
      try {
        const advancedConfig = JSON.parse(advancedConfigAttr);
        Object.assign(result, advancedConfig);
      } catch (e) {
        helpers.log(`Error parsing data-klaviyo-config attribute: ${e.message}`, 'error');
      }
    }
    
    // Merge field mappings with defaults
    const defaultFieldMappings = config.DEFAULT_FIELD_MAPPINGS || {};
    result.fieldMapping = helpers.mergeObjects(defaultFieldMappings, result.fieldMapping || {});
    
    return result;
  }
  
  /**
   * Set up a form for Klaviyo integration
   * @param {Element} form - Form element to set up
   */
  function setupForm(form) {
    const formId = form.id || '';
    
    // Get form-specific configuration
    const formConfig = getFormConfig(form, formId);
    
    // Validate configuration
    if (!formConfig.publicApiKey) {
      helpers.log(`Form ${formId || 'unknown'} has no Klaviyo account ID (public API key). Skipping setup.`, 'warn');
      return;
    }
    
    // Track form view if enabled
    if (formConfig.tracking && formConfig.tracking.viewForm) {
      trackFormView(form, formConfig);
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
      handleFormSubmit(event, form, formConfig);
    });
    
    // Mark the form as initialized
    form.setAttribute('data-klaviyo-initialized', 'true');
    
    // Add custom validation for phone if needed
    if (formConfig.useLibPhoneNumber) {
      setupPhoneValidation(form, formConfig);
    }
    
    helpers.log(`Form ${formId || form.className || 'unknown'} initialized for Klaviyo account ${formConfig.publicApiKey}`);
  }
  
  /**
   * Set up phone validation on a form
   * @param {Element} form - Form element
   * @param {Object} formConfig - Form configuration
   */
  function setupPhoneValidation(form, formConfig) {
    // Find phone fields
    const phoneSelectors = [
      '[name="phone"]', 
      '[name="phone-number"]', 
      '[name="phone_number"]', 
      '[data-klaviyo-field="phone_number"]'
    ];
    
    // Add custom field mappings for phone
    for (const [field, mapping] of Object.entries(formConfig.fieldMapping || {})) {
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
      validatePhoneField(phoneField, form);
    });
    
    phoneField.addEventListener('change', () => {
      validatePhoneField(phoneField, form);
    });
  }
  
  /**
   * Validate phone field
   * @param {Element} phoneField - Phone field element
   * @param {Element} form - Form element
   * @return {boolean} Is valid
   */
  function validatePhoneField(phoneField, form) {
    if (!phoneField.value || !window.libphonenumber) {
      return true; // Skip empty fields or if library isn't loaded
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
      helpers.log(`Phone validation error: ${e.message}`, 'warn');
      return false;
    }
  }
  
  /**
   * Track form view event
   * @param {Element} form - Form element
   * @param {Object} formConfig - Form configuration
   */
  function trackFormView(form, formConfig) {
    const formName = form.getAttribute('data-name') || form.id || 'Unknown Form';
    const apiKey = formConfig.publicApiKey;
    
    // Tracking data
    const trackingData = {
      'Form Name': formName,
      'Form ID': form.id,
      'Page URL': window.location.href,
      'Page Title': document.title,
      'Klaviyo Account': apiKey
    };
    
    // Track the event
    apiClient.trackEvent('Viewed Form', trackingData, apiKey)
      .catch(error => {
        // Non-blocking - don't want tracking to break functionality
        helpers.log(`Error tracking form view: ${error.message}`, 'warn');
      });
  }
  
  /**
   * Process form data and map fields
   * @param {Element} form - Form element
   * @param {Object} formConfig - Form configuration
   * @return {Object} Processed form data
   */
  function processFormData(form, formConfig) {
    const formData = new FormData(form);
    const mappings = formConfig.fieldMapping || {};
    const attributes = {};
    const location = {};
    const properties = Object.assign({}, formConfig.customProperties || {});
    
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
        const formattedPhone = helpers.formatPhoneNumber(value, defaultCountry);
        
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
    const formKlaviyoProps = getFormKlaviyoProps(form);
    if (formKlaviyoProps) {
      // Merge form-level properties with attributes
      Object.assign(attributes, formKlaviyoProps);
    }
    
    return { attributes };
  }
  
  /**
   * Get Klaviyo properties from form data attributes
   * @param {Element} form - Form element
   * @return {Object|null} Properties object or null
   */
  function getFormKlaviyoProps(form) {
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
  }
  
  /**
   * Validate form data
   * @param {Object} formData - Processed form data
   * @param {Element} form - Form element
   * @return {boolean} Is valid
   */
  function validateFormData(formData, form) {
    const attributes = formData.attributes;
    
    // Check if at least email or phone is provided
    if (!attributes.email && !attributes.phone_number) {
      showErrorMessage(form, 'Please provide either an email or a phone number.');
      return false;
    }
    
    // Check if phone number is valid (if provided)
    if (attributes.phone_number === null && form.querySelector('[name*="phone"]')) {
      showErrorMessage(form, 'Please enter a valid phone number.');
      return false;
    }
    
    // Check if email is valid (if provided)
    if (attributes.email && !helpers.isValidEmail(attributes.email)) {
      showErrorMessage(form, 'Please enter a valid email address.');
      return false;
    }
    
    return true;
  }
  
  /**
   * Prepare subscription data for Klaviyo
   * @param {Object} formData - Processed form data
   * @param {Object} formConfig - Form configuration
   * @param {Element} form - Form element
   * @return {Object} Subscription data for API
   */
  function prepareSubscriptionData(formData, formConfig, form) {
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
  }
  
  /**
   * Handle form submission
   * @param {Event} event - Submit event
   * @param {Element} form - Form element
   * @param {Object} formConfig - Form configuration
   */
  function handleFormSubmit(event, form, formConfig) {
    // Clear any previous error messages
    clearMessages(form);
    
    // Get form data and map to Klaviyo structure
    const formData = processFormData(form, formConfig);
    
    // Validate form data
    if (!validateFormData(formData, form)) {
      return;
    }
    
    // Prepare subscription data
    const subscriptionData = prepareSubscriptionData(formData, formConfig, form);
    
    // API request options
    const apiOptions = {
      apiVersion: formConfig.apiVersion || 'latest',
      debug: formConfig.debug,
      maxRetries: formConfig.maxRetries || 3
    };
    
    // Send data to Klaviyo
    apiClient.createClientSubscription(subscriptionData, formConfig.publicApiKey, apiOptions)
      .then(() => {
        // Show success message
        showSuccessMessage(form);
        
        // Track successful submission if enabled
        if (formConfig.tracking && formConfig.tracking.submitForm) {
          trackFormSubmit(form, formConfig, formData.attributes);
        }
        
        // If it's a Webflow AJAX form, trigger their success behavior
        triggerWebflowSuccess(form);
        
        // Fire any custom success callbacks
        const successEvent = new CustomEvent('klaviyoSubmitSuccess', {
          detail: { formData: formData, subscriptionData: subscriptionData }
        });
        form.dispatchEvent(successEvent);
        document.dispatchEvent(successEvent);
        
        helpers.log(`Form submitted successfully to Klaviyo account ${formConfig.publicApiKey}`);
      })
      .catch(error => {
        helpers.log(`Error submitting to Klaviyo: ${JSON.stringify(error)}`, 'error');
        showErrorMessage(form, 'Error submitting form to Klaviyo. Please try again.');
        
        // Fire any custom error callbacks
        const errorEvent = new CustomEvent('klaviyoSubmitError', {
          detail: { error: error, formData: formData }
        });
        form.dispatchEvent(errorEvent);
        document.dispatchEvent(errorEvent);
      });
  }
  
  /**
   * Track form submission event
   * @param {Element} form - Form element
   * @param {Object} formConfig - Form configuration
   * @param {Object} profileData - Profile data
   */
  function trackFormSubmit(form, formConfig, profileData) {
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
    
    // Track the event
    apiClient.trackEvent('Submitted Form', trackingData, apiKey)
      .catch(error => {
        // Non-blocking - tracking should not impact form submission
        helpers.log(`Error tracking form submission: ${error.message}`, 'warn');
      });
  }
  
  /**
   * Trigger Webflow's success state for AJAX forms
   * @param {Element} form - Form element
   */
  function triggerWebflowSuccess(form) {
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
  }
  
  /**
   * Show error message
   * @param {Element} form - Form element
   * @param {string} message - Error message
   */
  function showErrorMessage(form, message) {
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
  }
  
  /**
   * Show success message
   * @param {Element} form - Form element
   */
  function showSuccessMessage(form) {
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
  }
  
  /**
   * Clear error and success messages
   * @param {Element} form - Form element
   */
  function clearMessages(form) {
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
  
  /**
   * Initialize all forms on the page
   */
  function initAllForms() {
    const forms = findKlaviyoForms();
    forms.forEach(form => setupForm(form));
    
    helpers.log(`Initialized ${forms.length} Klaviyo forms`);
    return forms.length;
  }
  
  // Public API
  return {
    init,
    findKlaviyoForms,
    setupForm,
    initAllForms,
    // For advanced usage
    processFormData,
    prepareSubscriptionData,
    validateFormData
  };
})();

// Export for both browsers and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KlaviyoFormProcessor;
} else if (typeof window !== 'undefined') {
  window.KlaviyoFormProcessor = KlaviyoFormProcessor;
} 