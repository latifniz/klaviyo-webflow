import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

// Script versions
const AVAILABLE_VERSIONS = ['1.0.0', '1.1.0'];

export async function GET(
  request: Request,
  { params }: { params: { version: string } }
) {
  try {
    // Extract the version from the URL path parameter
    let requestedVersion = params.version;
    
    // Handle format like "v1.1.0" by removing the "v" prefix
    if (requestedVersion.startsWith('v')) {
      requestedVersion = requestedVersion.substring(1);
    }
    
    // Validate that the requested version exists
    if (!AVAILABLE_VERSIONS.includes(requestedVersion)) {
      // Return 404 if version doesn't exist
      return notFound();
    }
    
    // Setup version tracking for analytics (optional)
    const clientInfo = {
      version: requestedVersion,
      referrer: request.headers.get('referer') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Log script usage (for analytics)
    console.log(`Specific version requested: ${JSON.stringify(clientInfo)}`);
    
    // Currently we only serve the latest version script file
    // In the future, you could have different script files for different versions
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
      `$1${requestedVersion}$3`
    );
    
    return createScriptResponse(script, requestedVersion);
  } catch (error) {
    console.error('Error serving script:', error);
    return new NextResponse('Error serving script: ' + (error instanceof Error ? error.message : String(error)), { status: 500 });
  }
}

function createScriptResponse(script: string, version: string) {
  // Create response with proper headers for production serving and CDN caching
  return new NextResponse(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // For versioned URLs, we can use a very long cache time because the URL changes when the version changes
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Script-Version': version,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Accept-Encoding',
    },
  });
} 