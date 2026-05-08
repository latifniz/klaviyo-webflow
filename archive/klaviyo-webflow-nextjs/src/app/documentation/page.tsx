"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Define versions (newest first)
const versions = [
  { number: "1.2.0", date: "2023-11-01", status: "latest" },
  { number: "1.1.0", date: "2023-09-15", status: "stable" },
  { number: "1.0.0", date: "2023-08-01", status: "legacy" },
];

export default function DocumentationPage() {
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  
  return (
    <div className="py-10 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          <aside className="hidden md:block sticky top-24 self-start h-[calc(100vh-8rem)] overflow-auto pr-6 border-r">
            {/* Version selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Version:</h4>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                  {selectedVersion.status}
                </span>
              </div>
              <select 
                value={selectedVersion.number}
                onChange={(e) => {
                  const version = versions.find(v => v.number === e.target.value);
                  if (version) setSelectedVersion(version);
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {versions.map((version) => (
                  <option key={version.number} value={version.number}>
                    {version.number} {version.status === 'latest' ? '(Latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <h3 className="font-medium text-lg mb-4">Contents</h3>
            <ul className="space-y-3">
              <li>
                <a href="#getting-started" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Getting Started
                </a>
                <ul className="mt-2 ml-4 space-y-2">
                  <li>
                    <a href="#installation" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Installation
                    </a>
                  </li>
                  <li>
                    <a href="#configuration" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Configuration
                    </a>
                  </li>
                  <li>
                    <a href="#basic-usage" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Basic Usage
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#form-setup" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Form Setup
                </a>
              </li>
              <li>
                <a href="#advanced-usage" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Advanced Usage
                </a>
              </li>
              <li>
                <a href="#api-reference" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#troubleshooting" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Troubleshooting
                </a>
              </li>
              <li>
                <a href="#version-history" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Version History
                </a>
              </li>
            </ul>
          </aside>
          
          <div className="max-w-3xl">
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-4xl font-bold tracking-tighter">Documentation</h1>
                <div className="flex items-center gap-3">
                  {/* Mobile version selector */}
                  <div className="sm:hidden">
                    <select 
                      value={selectedVersion.number}
                      onChange={(e) => {
                        const version = versions.find(v => v.number === e.target.value);
                        if (version) setSelectedVersion(version);
                      }}
                      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    >
                      {versions.map((version) => (
                        <option key={version.number} value={version.number}>
                          Version {version.number}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Version badge */}
                  <div className="hidden sm:flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm">
                    <span className="mr-2 text-primary font-medium">v{selectedVersion.number}</span>
                    <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold border border-primary/20 bg-primary/10 text-primary">
                      {selectedVersion.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">Everything you need to know about integrating Klaviyo with your Webflow site</p>
            </div>
            
            <section id="getting-started" className="mb-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">Getting Started</h2>
                <p className="text-base leading-7">
                  KlaviyoFlow is a powerful integration that connects your Webflow forms directly to Klaviyo. 
                  This guide will walk you through setting up the integration on your Webflow site.
                </p>
              </div>
              
              <div id="installation" className="mt-8 mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Installation</h3>
                <p className="mb-6 text-base leading-7">
                  To install KlaviyoFlow on your Webflow site, you need to add a small script to your site&apos;s custom code section.
                </p>
                
                <ol className="space-y-3 mb-6 list-decimal list-inside text-base leading-7">
                  <li>Go to your Webflow project&apos;s dashboard</li>
                  <li>Navigate to <strong>Project Settings</strong> &gt; <strong>Custom Code</strong></li>
                  <li>Add the following code to the <strong>Footer Code</strong> section:</li>
                </ol>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<script src="https://cdn.example.com/klaviyo-webflow-${selectedVersion.number}.min.js"></script>
<script>
  window.initKlaviyoWebflow({
    publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY'
  });
</script>`}</pre>
                </div>
                
                <p className="mb-4 text-base leading-7">
                  <strong>Note:</strong> Replace <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">YOUR_KLAVIYO_PUBLIC_API_KEY</code> with your actual Klaviyo public API key (also known as Site ID).
                </p>
              </div>
              
              <div id="configuration" className="mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Configuration</h3>
                <p className="mb-6 text-base leading-7">
                  Once installed, you can configure the script with additional options:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`window.initKlaviyoWebflow({
  publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
  defaultListId: 'YOUR_LIST_ID',
  debug: false,
  successMessage: 'Thanks for subscribing!'
});`}</pre>
                </div>
              </div>
              
              <div id="basic-usage" className="mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Basic Usage</h3>
                <p className="mb-6 text-base leading-7">
                  After configuration, add the <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">data-klaviyo-form</code> attribute 
                  to any form you want to connect:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<form data-klaviyo-form>
  <input type="email" name="email" placeholder="Your email" required>
  <button type="submit">Subscribe</button>
</form>`}</pre>
                </div>
              </div>
            </section>

            <section id="form-setup" className="mb-16">
              {/* Feature badge for new versions */}
              {selectedVersion.number === "1.2.0" && (
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                  Updated in version 1.2.0
                </div>
              )}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">Form Setup</h2>
                <p className="text-base leading-7">
                  The integration supports both simple newsletter forms and complex multi-field forms. 
                  Here&apos;s how to set up different form types:
                </p>
              </div>
              
              <div className="mt-8 mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Basic Newsletter Form</h3>
                <p className="mb-6 text-base leading-7">
                  For a simple email signup form, just add the <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">data-klaviyo-form</code> attribute:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<form data-klaviyo-form>
  <input type="email" name="email" placeholder="Your email" required>
  <button type="submit">Subscribe</button>
</form>`}</pre>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-10 scroll-m-20">Custom List ID</h3>
                <p className="mb-6 text-base leading-7">
                  To subscribe to a specific list (different from your default list):
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<form data-klaviyo-form data-klaviyo-list-id="YOUR_SPECIFIC_LIST_ID">
  <input type="email" name="email" placeholder="Your email" required>
  <button type="submit">Subscribe</button>
</form>`}</pre>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-10 scroll-m-20">Additional Fields</h3>
                <p className="mb-6 text-base leading-7">
                  You can collect additional information like name, phone, or custom fields:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<form data-klaviyo-form>
  <input type="email" name="email" placeholder="Your email" required>
  <input type="text" name="first-name" placeholder="First name">
  <input type="text" name="last-name" placeholder="Last name">
  <input type="tel" name="phone" placeholder="Phone number">
  <input type="text" name="company" placeholder="Company name">
  <button type="submit">Subscribe</button>
</form>`}</pre>
                </div>
                
                <p className="mb-4 text-base leading-7">
                  The integration automatically maps common field names to the proper properties in Klaviyo.
                </p>
              </div>
            </section>

            <section id="advanced-usage" className="mb-16">
              {/* Feature badge for new versions */}
              {selectedVersion.number === "1.1.0" && (
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm mb-6">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                  Updated in version 1.1.0
                </div>
              )}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">Advanced Usage</h2>
                <p className="text-base leading-7">
                  The integration supports advanced features for more complex use cases.
                </p>
              </div>
              
              <div className="mt-8 mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Custom Field Mapping</h3>
                <p className="mb-6 text-base leading-7">
                  You can create custom field mappings between your form fields and Klaviyo properties:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`window.initKlaviyoWebflow({
  publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
  defaultConfig: {
    fieldMapping: {
      'custom-field': 'custom_property',
      'job-title': 'title',
      'zip-code': 'location.zip'
    }
  }
});`}</pre>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-10 scroll-m-20">Multiple Forms with Different Configurations</h3>
                <p className="mb-6 text-base leading-7">
                  For different forms with different configurations:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`window.initKlaviyoWebflow({
  publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
  forms: {
    'newsletter-form': {
      listId: 'NEWSLETTER_LIST_ID',
      successMessage: 'Thanks for subscribing to our newsletter!'
    },
    'webinar-signup': {
      listId: 'WEBINAR_LIST_ID',
      successMessage: 'You\'re registered for the webinar!',
      redirectUrl: '/webinar-confirmation'
    }
  }
});`}</pre>
                </div>
                <p className="mb-4 text-base leading-7">
                  Then add the form ID to your Webflow form:
                </p>
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<form id="newsletter-form" data-klaviyo-form>
  <!-- form fields -->
</form>

<form id="webinar-signup" data-klaviyo-form>
  <!-- form fields -->
</form>`}</pre>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-10 scroll-m-20">SMS & Email Subscriptions</h3>
                <p className="mb-6 text-base leading-7">
                  To collect both email and SMS subscriptions:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`<form data-klaviyo-form>
  <input type="email" name="email" placeholder="Your email" required>
  <input type="tel" name="phone" placeholder="Your phone for SMS updates">
  
  <div>
    <input type="checkbox" id="email-consent" name="email-consent" value="true" checked>
    <label for="email-consent">I agree to receive email updates</label>
  </div>
  
  <div>
    <input type="checkbox" id="sms-consent" name="sms-consent" value="true">
    <label for="sms-consent">I agree to receive SMS updates</label>
  </div>
  
  <button type="submit">Subscribe</button>
</form>`}</pre>
                </div>
              </div>
            </section>

            <section id="api-reference" className="mb-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">API Reference</h2>
                <p className="text-base leading-7">
                  Complete reference of all available configuration options.
                </p>
              </div>
              
              <div className="mt-8 mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Global Configuration</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">publicApiKey</h4>
                    <p className="text-base leading-7">
                      Your Klaviyo public API key (Site ID).
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">String | Required</code>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">defaultListId</h4>
                    <p className="text-base leading-7">
                      Default list ID for all forms (can be overridden per form).
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">String | Optional</code>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">debug</h4>
                    <p className="text-base leading-7">
                      Enable debug mode (console logging).
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">Boolean | Optional | Default: false</code>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">forms</h4>
                    <p className="text-base leading-7">
                      Form-specific configurations.
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">Object | Optional</code>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-10 scroll-m-20">Form Attributes</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">data-klaviyo-form</h4>
                    <p className="text-base leading-7">
                      Marks a form for Klaviyo integration.
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">Attribute | Required</code>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">data-klaviyo-list-id</h4>
                    <p className="text-base leading-7">
                      Specifies the Klaviyo list ID for this specific form.
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">Attribute | Optional</code>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-base">data-klaviyo-account-id</h4>
                    <p className="text-base leading-7">
                      Specifies the Klaviyo public API key for this specific form.
                    </p>
                    <code className="text-sm bg-muted/60 px-1.5 py-0.5 rounded font-mono">Attribute | Optional</code>
                  </div>
                </div>
              </div>
            </section>

            <section id="troubleshooting" className="mb-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">Troubleshooting</h2>
                <p className="text-base leading-7">
                  Common issues and how to resolve them.
                </p>
              </div>
              
              <div className="mt-8 mb-12 pl-6 border-l-2 border-muted">
                <h3 className="text-xl font-semibold mb-4 scroll-m-20">Common Issues</h3>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">Form submits but user isn&apos;t added to Klaviyo</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Verify your Klaviyo API key is correct</li>
                      <li>Check that the list ID is correct</li>
                      <li>Enable debug mode to see detailed error messages</li>
                      <li>Ensure email field is properly named (should be &quot;email&quot;)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">Custom fields not appearing in Klaviyo</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Verify field mapping configuration</li>
                      <li>Ensure field names in HTML match your configuration</li>
                      <li>Check that Klaviyo has the custom properties defined in account settings</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-base">Script loading errors</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Make sure the script is added to the footer section in Webflow</li>
                      <li>Check browser console for JavaScript errors</li>
                      <li>Verify you&apos;re using the latest version of the script</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-10 scroll-m-20">Debug Mode</h3>
                <p className="mb-6 text-base leading-7">
                  Enable debug mode to get detailed information in the browser console:
                </p>
                
                <div className="bg-muted/60 p-5 rounded-lg mb-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-foreground/90">{`window.initKlaviyoWebflow({
  publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
  debug: true
});`}</pre>
                </div>
                
                <p className="mb-4 text-base leading-7">
                  Then open your browser&apos;s developer tools (F12 or right-click → Inspect) and check the Console tab for detailed logs.
                </p>
              </div>
            </section>
            
            {/* New Version History Section */}
            <section id="version-history" className="mb-16">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">Version History</h2>
                <p className="text-base leading-7">
                  View the history of changes across different versions of KlaviyoFlow.
                </p>
              </div>
              
              <div className="mt-8 mb-12 pl-6 border-l-2 border-muted">
                <div className="relative pb-10">
                  <div className="absolute left-[-25.5px] top-2 h-6 w-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-primary"></span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 scroll-m-20">Version 1.2.0</h3>
                  <p className="text-sm text-muted-foreground mb-2">Released: November 1, 2023</p>
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium text-base">New Features</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Added support for Klaviyo multi-step forms</li>
                      <li>Improved error handling with customizable error messages</li>
                      <li>New callback options for success and error events</li>
                    </ul>
                    
                    <h4 className="font-medium text-base mt-4">Improvements</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>30% reduction in script size for faster loading</li>
                      <li>Enhanced field validation for phone numbers and email addresses</li>
                      <li>Better handling of international phone formats</li>
                    </ul>
                    
                    <h4 className="font-medium text-base mt-4">Bug Fixes</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Fixed issue with checkbox values not being properly captured</li>
                      <li>Resolved conflict with certain Webflow animations</li>
                    </ul>
                  </div>
                </div>
                
                <div className="relative pb-10">
                  <div className="absolute left-[-25.5px] top-2 h-6 w-6 rounded-full border-2 border-muted bg-background flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-muted"></span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 scroll-m-20">Version 1.1.0</h3>
                  <p className="text-sm text-muted-foreground mb-2">Released: September 15, 2023</p>
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium text-base">New Features</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Added support for SMS subscriptions</li>
                      <li>New consent tracking options for GDPR compliance</li>
                      <li>Added custom events for form submissions</li>
                    </ul>
                    
                    <h4 className="font-medium text-base mt-4">Improvements</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Improved form field detection</li>
                      <li>Better error reporting</li>
                    </ul>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-[-25.5px] top-2 h-6 w-6 rounded-full border-2 border-muted bg-background flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-muted"></span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 scroll-m-20">Version 1.0.0</h3>
                  <p className="text-sm text-muted-foreground mb-2">Released: August 1, 2023</p>
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium text-base">Initial Release</h4>
                    <ul className="space-y-2 list-disc list-inside text-base leading-7">
                      <li>Basic form to Klaviyo list integration</li>
                      <li>Support for email collection</li>
                      <li>Custom field mapping</li>
                      <li>Success/error message customization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-16 pt-8 border-t gap-4">
              {/* Documentation version notice */}
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                You&apos;re viewing documentation for version {selectedVersion.number} 
                {selectedVersion.status !== 'latest' && (
                  <span> — <Link href="#" className="text-primary hover:underline" onClick={() => setSelectedVersion(versions[0])}>View latest</Link></span>
                )}
              </p>
              
              <div className="order-1 sm:order-2 flex gap-4">
                <Button asChild variant="outline">
                  <Link href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="m12 19-7-7 7-7"></path>
                      <path d="M19 12H5"></path>
                    </svg>
                    Back to Home
                  </Link>
                </Button>
                
                <Button asChild>
                  <Link href="/playground">
                    Try the Playground
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}