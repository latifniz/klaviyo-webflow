# Klaviyo to Webflow Integration

This repository contains tools for integrating Klaviyo with Webflow forms.

## Repository Structure

This project is organized into three main components:

### 1. Script Assets (`/script-assets`)

The core JavaScript integration script that connects Webflow forms to Klaviyo:

- `webflow-to-klaviyo-script.js` - The main script
- `build.js` - Build script for generating the production version
- `config.js` - Configuration for the build process
- `dist/` - Contains the built distribution files

### 2. Website (`/website`)

Static HTML website with documentation and examples:

- `index.html` - Main landing page
- `documentation.html` - Integration documentation
- `playground.html` - Testing playground
- `examples/` - Example implementations
- `public/` - Static assets

### 3. Next.js Application (`/nextjs-app`)

A modern React application built with Next.js that provides a better user experience for documentation, playground testing, and examples, plus script hosting with versioning:

- React-based components
- Improved UI with dark mode
- Interactive examples
- API routes for script delivery with versioning
- Centralized version management

## Next.js App Architecture

The Next.js application uses a robust architecture for script distribution:

### Centralized Version Management

All version information is managed in a single configuration file:

- `src/config/versions.ts` - Defines all available versions with metadata

### API Routes

- `/api/script` - Serves the latest script version
- `/api/script/[version]` - Serves specific script versions
- `/api/version` - Provides version metadata for clients

### Script Storage

Scripts are stored in a versioned directory structure:

- `public/scripts/versions/` - Contains specific script versions
- `public/scripts/klaviyo-webflow.min.js` - Latest version reference

### Release Management

We have a streamlined release process:

- `npm run release:prepare` - Interactive CLI tool to prepare a new release
- Automatically updates version information
- Guides through script file preparation

## Using the Hosted Script

### 1. Add the script to your Webflow site

```html
<script src="https://klaviyo-webflow-nextjs.vercel.app/api/script" defer></script>
```

For a specific version:

```html
<script src="https://klaviyo-webflow-nextjs.vercel.app/api/script/1.2.0" defer></script>
```

### 2. Initialize with your Klaviyo account

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    window.KlaviyoWebflow && window.KlaviyoWebflow.init({
      apiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
      defaultListId: 'YOUR_DEFAULT_LIST_ID',
      debug: false
    });
  });
</script>
```

Replace `YOUR_KLAVIYO_PUBLIC_API_KEY` with your Klaviyo public API key.

### 3. Configure your Webflow forms

Add the `data-klaviyo-form` attribute to any form you want to connect to Klaviyo:

```html
<form data-klaviyo-form>
  <!-- Form fields -->
</form>
```

## Developing the Next.js App

```bash
cd nextjs-app
npm install
npm run dev
```

## Version Management

To create a new version:

```bash
npm run release:prepare
```

This script will guide you through:
1. Choosing a version number
2. Adding change notes
3. Updating configuration
4. Copying script files to the proper locations

## Repository Links

- [Klaviyo-Webflow Integration Script](https://github.com/javron/klaviyo-webflow.git)
- [Next.js Documentation Site](https://github.com/javron/klaviyo-webflow-nextjs.git)

# Klaviyo-Webflow Integration

A powerful, flexible, and modular integration between Webflow forms and Klaviyo, with versioning support and robust error handling.

## Features

- **Multi-Account Support**: Connect multiple Klaviyo accounts on a single page
- **Versioned API**: Support for different Klaviyo API versions
- **Custom Field Mapping**: Map Webflow form fields to any Klaviyo fields
- **SMS Support**: Collect and validate phone numbers for SMS subscriptions
- **Event Tracking**: Track form views and submissions in Klaviyo
- **Error Handling**: Robust error handling with helpful user feedback
- **Developer-Friendly**: Modular architecture for easy maintenance
- **Webflow Compatible**: Works with all Webflow forms

## Quick Start

### 1. Add the script to your site

Add the following script to your site's head section:

```html
<script src="https://cdn.example.com/klaviyo-webflow/klaviyo-webflow.min.js"></script>
```

### 2. Initialize with your Klaviyo account

Add this script after the one above:

```html
<script>
  window.initKlaviyoWebflow({
    publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY'
  });
</script>
```

Replace `YOUR_KLAVIYO_PUBLIC_API_KEY` with your Klaviyo public API key.

### 3. Configure your Webflow forms

Add the `data-klaviyo-form` attribute to any form you want to connect to Klaviyo:

```html
<form data-klaviyo-form data-klaviyo-list-id="YOUR_LIST_ID">
  <!-- Form fields -->
</form>
```

Replace `YOUR_LIST_ID` with your Klaviyo list ID.

## Form Configuration Options

Forms can be configured using data attributes or JavaScript.

### Using Data Attributes

```html
<form 
  data-klaviyo-form
  data-klaviyo-list-id="YOUR_LIST_ID"
  data-klaviyo-account-id="YOUR_PUBLIC_API_KEY"
  data-klaviyo-source="Homepage Form"
  data-klaviyo-api-version="2025-04-15"
>
  <!-- Form fields -->
</form>
```

### Using JavaScript

```javascript
window.initKlaviyoWebflow({
  publicApiKey: 'DEFAULT_PUBLIC_API_KEY',
  defaultConfig: {
    listId: 'DEFAULT_LIST_ID',
    tracking: {
      viewForm: true,
      submitForm: true
    },
    useLibPhoneNumber: true,
    debug: false
  },
  forms: {
    'contact-form': {
      listId: 'SPECIFIC_LIST_ID',
      publicApiKey: 'SPECIFIC_PUBLIC_API_KEY',
      customProperties: {
        source: 'Contact Page',
        campaign: 'Spring 2023'
      }
    }
  }
});
```

## Field Mapping

The integration automatically maps common field names to Klaviyo properties:

| Webflow Field Name | Klaviyo Property |
|-------------------|-----------------|
| email            | email           |
| name             | first_name      |
| first-name       | first_name      |
| last-name        | last_name       |
| phone            | phone_number    |
| phone-number     | phone_number    |
| company          | organization    |
| address1         | location.address1 |
| city             | location.city   |
| country          | location.country |
| region           | location.region |
| zip              | location.zip    |

### Custom Field Mapping

For custom fields, use the `data-klaviyo-field` attribute:

```html
<input type="text" name="industry" data-klaviyo-field="properties.industry">
```

Or configure mapping in JavaScript:

```javascript
window.initKlaviyoWebflow({
  // ... other config ...
  defaultConfig: {
    fieldMapping: {
      'industry': 'properties.industry',
      'job-title': 'title'
    }
  }
});
```

## Advanced Usage

### SMS Subscriptions

For SMS subscriptions, include a phone field and the script will automatically subscribe the user to SMS marketing:

```html
<form data-klaviyo-form data-klaviyo-list-id="YOUR_LIST_ID">
  <input type="email" name="email">
  <input type="tel" name="phone">
  <button type="submit">Subscribe</button>
</form>
```

To explicitly control which channels a user subscribes to, use consent fields:

```html
<input type="hidden" name="email_marketing_consent" value="true">
<input type="hidden" name="sms_marketing_consent" value="true">
```

### Version-Specific Features

To use a specific API version:

```html
<form data-klaviyo-form data-klaviyo-api-version="2025-04-15">
  <!-- Form fields -->
</form>
```

Or in JavaScript:

```javascript
window.initKlaviyoWebflow({
  // ... other config ...
  defaultConfig: {
    apiVersion: '2025-04-15'
  }
});
```

### Debugging

Enable debug mode to log detailed information to the console:

```javascript
window.initKlaviyoWebflow({
  // ... other config ...
  defaultConfig: {
    debug: true
  }
});
```

You can also use the global debug helper:

```javascript
console.log(window.klaviyoWebflowDebug());
```

## Event Handling

The integration fires custom events that you can listen for:

```javascript
document.addEventListener('klaviyoSubmitSuccess', function(event) {
  console.log('Form submitted successfully!', event.detail);
});

document.addEventListener('klaviyoSubmitError', function(event) {
  console.error('Error submitting form:', event.detail.error);
});
```

## Browser Compatibility

The integration is compatible with all modern browsers:

- Chrome 60+
- Firefox 60+
- Safari 10+
- Edge 16+
- Opera 50+

## Development

### Building from source

```
git clone https://github.com/yourusername/klaviyo-webflow.git
cd klaviyo-webflow
npm install
npm run build
```

This will create the distribution files in the `dist` directory.

### Development server

```
npm run dev
```

This will start a development server at http://localhost:8080.

## License

MIT

---

For more examples and details, see the [examples](./examples) directory.

For questions or support, please open an issue on GitHub. 