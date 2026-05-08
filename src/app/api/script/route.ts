import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLatestVersion, getVersionByNumber } from '@/config/versions';
import { trackScriptUsage, trackError } from '@/utils/analytics';

export const GET = async (request: NextRequest): Promise<Response> => {
  try {
    // Get version parameter if present for query-based version selection
    const url = new URL(request.url);
    const requestedVersionQuery = url.searchParams.get('v');
    
    // Get referrer and user agent for analytics
    const referrer = request.headers.get('referer');
    const userAgent = request.headers.get('user-agent');
    
    // Determine which version to serve
    let version;
    if (requestedVersionQuery) {
      // If version is specified in query, use that version if valid
      version = getVersionByNumber(requestedVersionQuery);
      
      // If invalid version requested, fall back to latest
      if (!version) {
        trackError('invalid_version', `Invalid version requested: ${requestedVersionQuery}`, {
          referrer,
          userAgent,
          requestUrl: request.url
        });
        version = getLatestVersion();
      }
    } else {
      // Otherwise use the latest version
      version = getLatestVersion();
    }
    
    // Track script usage for analytics
    trackScriptUsage(version.number, referrer, userAgent, {
      method: 'query_param',
      requested_version: requestedVersionQuery
    });
    
    // Define script paths to check in order of preference
    const scriptPaths = [
      // 1. Versioned script in public directory
      path.join(process.cwd(), 'public', 'scripts', 'versions', version.file),
      // 2. Generic latest script
      path.join(process.cwd(), 'public', 'scripts', 'klaviyo-webflow.min.js'),
      // 3. Legacy path for backward compatibility
      path.join(process.cwd(), 'public', 'scripts', 'webflow-to-klaviyo-script.js'),
      // 4. External script directory
      path.join(process.cwd(), '..', 'script-assets', 'webflow-to-klaviyo-script.js'),
      // 5. External minified version
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
      console.log('No script files found, serving embedded development stub');
      trackError('script_not_found', 'No script files found, serving embedded development stub');
      
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
      // Long cache duration for immutable content with version information
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Script-Version': versionNumber,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Accept-Encoding',
    },
  });
} 