import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { isValidVersion, getVersionByNumber } from '@/config/versions';
import { trackScriptUsage, trackError } from '@/utils/analytics';
import type { RouteHandler } from '@/types/route';

interface VersionParams {
  version: string;
}

export const GET: RouteHandler<VersionParams> = async (
  request,
  context
) => {
  try {
    // Extract the version from the URL path parameter
    let requestedVersion = context.params.version;
    
    // Get referrer and user agent for analytics
    const referrer = request.headers.get('referer');
    const userAgent = request.headers.get('user-agent');
    
    // Handle format like "v1.1.0" by removing the "v" prefix
    if (requestedVersion.startsWith('v')) {
      requestedVersion = requestedVersion.substring(1);
    }
    
    // Validate that the requested version exists
    if (!isValidVersion(requestedVersion)) {
      // Track invalid version requests for monitoring
      trackError('invalid_version', `Invalid version requested: ${requestedVersion}`, {
        referrer,
        userAgent,
        requestUrl: request.url
      });
      
      // Return 404 if version doesn't exist
      return notFound();
    }
    
    // Get the version information
    const version = getVersionByNumber(requestedVersion)!;
    
    // Track script usage for analytics
    trackScriptUsage(version.number, referrer, userAgent, {
      method: 'path_param'
    });
    
    // Define script paths to check in order of preference
    const scriptPaths = [
      // 1. Versioned script in public directory
      path.join(process.cwd(), 'public', 'scripts', 'versions', version.file),
      // 2. Legacy paths for backward compatibility
      path.join(process.cwd(), 'public', 'scripts', 'webflow-to-klaviyo-script.js'),
      path.join(process.cwd(), 'public', 'scripts', 'klaviyo-webflow.min.js'),
      // 3. External script directory
      path.join(process.cwd(), '..', 'script-assets', 'webflow-to-klaviyo-script.js'),
      // 4. External minified version
      path.join(process.cwd(), '..', 'script-assets', 'dist', 'klaviyo-webflow.min.js')
    ];
    
    // Check each path in order
    let scriptContent: string | null = null;
    let scriptPath: string | null = null;
    
    for (const path of scriptPaths) {
      if (fs.existsSync(path)) {
        scriptPath = path;
        scriptContent = fs.readFileSync(path, 'utf8');
        break;
      }
    }
    
    // If no script found, serve an embedded development stub
    if (!scriptContent) {
      console.log(`No script files found for version ${version.number}, serving embedded development stub`);
      trackError('script_not_found', `No script files found for version ${version.number}`);
      
      const embeddedScript = `
/**
 * Klaviyo-Webflow Integration Script (Development Stub)
 * @version ${version.number}
 * @warning This is a development stub and not intended for production use
 */
(function() {
  // Version info for update checks
  const VERSION = '${version.number}';
  
  // Initialize the Klaviyo integration
  window.KlaviyoWebflow = {
    version: VERSION,
    init: function(options) {
      console.log('Klaviyo Webflow integration initialized with options:', options);
      return this;
    },
    trackForm: function(form, options) {
      console.log('Form tracked:', form);
      return this;
    },
    subscribe: function(email, listId, options) {
      console.log('Subscribing email:', email, 'to list:', listId);
      return this;
    }
  };
  
  console.log('Klaviyo Webflow integration loaded (DEVELOPMENT STUB) - VERSION: ' + VERSION);
  
  // Set up auto-form tracking
  document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[data-klaviyo-form]');
    forms.forEach(function(form) {
      window.KlaviyoWebflow.trackForm(form);
    });
  });
})();
      `;
      
      return createScriptResponse(embeddedScript, version.number);
    }
    
    // Inject version information into the script
    const versionPattern = /(const\s+VERSION\s*=\s*['"])(.+?)(['"])/;
    if (versionPattern.test(scriptContent)) {
      scriptContent = scriptContent.replace(versionPattern, `$1${version.number}$3`);
    }
    
    console.log(`Successfully prepared script for delivery from ${scriptPath}`);
    return createScriptResponse(scriptContent, version.number);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error serving script:', error);
    trackError('script_serving_error', errorMessage);
    
    return new NextResponse(`Error serving script: ${errorMessage}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
};

function createScriptResponse(script: string, versionNumber: string) {
  // Create response with proper headers for production serving and CDN caching
  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // For versioned URLs, we can use a very long cache time because the URL changes when the version changes
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Script-Version': versionNumber,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Accept-Encoding',
    },
  });
} 