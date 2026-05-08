import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { VERSIONS, getLatestVersion } from '@/config/versions';
import { trackScriptUsage } from '@/utils/analytics';

export const GET = async (): Promise<Response> => {
  try {
    const latestVersion = getLatestVersion();

    // Get referrer for analytics
    const latestScriptPath = path.join(
      process.cwd(), 
      'public', 
      'scripts', 
      'versions', 
      latestVersion.file
    );
    
    // Try to get the actual script size
    let scriptSize = '15.2 KB'; // Default size
    try {
      // First check versioned script
      if (fs.existsSync(latestScriptPath)) {
        const stats = fs.statSync(latestScriptPath);
        scriptSize = `${(stats.size / 1024).toFixed(1)} KB`;
      } else {
        // Fall back to the legacy script path
        const legacyScriptPath = path.join(process.cwd(), '..', 'script-assets', 'webflow-to-klaviyo-script.js');
        if (fs.existsSync(legacyScriptPath)) {
          const stats = fs.statSync(legacyScriptPath);
          scriptSize = `${(stats.size / 1024).toFixed(1)} KB`;
        }
      }
    } catch (error) {
      console.error('Error getting script size:', error);
      // Use default size if there's an error
    }
    
    // Track API usage
    trackScriptUsage(latestVersion.number, null, null, {
      endpoint: 'version'
    });
    
    // Prepare API response with full version information
    const versionInfo = {
      // Latest version info
      version: latestVersion.number,
      status: latestVersion.status,
      api_revision: '2025-04-15',
      release_date: new Date(latestVersion.date).toISOString().split('T')[0],
      script_size: scriptSize,
      changes: latestVersion.changes,
      min_update_interval: 86400, // 24 hours in seconds
      
      // All available versions
      available_versions: VERSIONS.map(v => ({
        number: v.number,
        status: v.status,
        date: v.date
      }))
    };

    return NextResponse.json(versionInfo, {
      status: 200,
      headers: {
        // 1 hour cache with stale-while-revalidate for better performance
        'Cache-Control': 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error in version API:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error)
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 