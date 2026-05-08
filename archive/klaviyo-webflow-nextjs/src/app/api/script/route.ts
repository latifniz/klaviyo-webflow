import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Script version
const SCRIPT_VERSION = '1.1.0';

export async function GET(request: Request) {
  try {
    // Get version parameter if present for potential version-specific serving
    const url = new URL(request.url);
    const requestedVersion = url.searchParams.get('v');
    
    // Setup version tracking for analytics (optional)
    const clientInfo = {
      version: requestedVersion || SCRIPT_VERSION,
      referrer: request.headers.get('referer') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Log script usage (for analytics)
    console.log(`Script requested: ${JSON.stringify(clientInfo)}`);
    
    // Currently we only serve the latest version
    // Read the script content from our source
    const scriptPath = path.join(process.cwd(), 'src', 'index.js');
    
    console.log('Looking for script at:', scriptPath);
    
    // Check if the file exists
    if (!fs.existsSync(scriptPath)) {
      console.error('Script file not found at:', scriptPath);
      
      // Try alternate path (in case we're in production deployment)
      const altScriptPath = path.join(process.cwd(), '..', 'src', 'index.js');
      console.log('Trying alternate path:', altScriptPath);
      
      if (fs.existsSync(altScriptPath)) {
        const script = fs.readFileSync(altScriptPath, 'utf8');
        return createScriptResponse(script, requestedVersion);
      }
      
      return new NextResponse('Script file not found. Please contact support.', { status: 404 });
    }
    
    // Read the script content
    let script = fs.readFileSync(scriptPath, 'utf8');
    
    // Inject version information directly into the script for runtime version checking
    script = script.replace(
      /(const\s+VERSION\s*=\s*['"])(.+?)(['"])/,
      `$1${requestedVersion || SCRIPT_VERSION}$3`
    );
    
    return createScriptResponse(script, requestedVersion);
  } catch (error) {
    console.error('Error serving script:', error);
    return new NextResponse('Error serving script: ' + (error instanceof Error ? error.message : String(error)), { status: 500 });
  }
}

function createScriptResponse(script: string, requestedVersion: string | null) {
  // Create response with proper headers for production serving and CDN caching
  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // Long cache duration with a version parameter for cache busting
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Script-Version': requestedVersion || SCRIPT_VERSION,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Accept-Encoding',
    },
  });
} 