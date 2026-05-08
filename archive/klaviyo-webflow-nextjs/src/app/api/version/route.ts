import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Version configuration
const VERSION_INFO = {
  version: '1.1.0',
  api_revision: '2025-04-15',
  release_date: new Date().toISOString(),
  script_size: '15.2 KB', // Adding script size information
  changes: [
    'Initial release of hosted script',
    'Support for multi-account configuration',
    'Advanced field mapping',
    'Phone number validation'
  ],
  min_update_interval: 86400 // 24 hours in seconds
};

export async function GET() {
  try {
    // Try to get the actual script size
    const scriptPath = path.join(process.cwd(), 'src', 'index.js');
    if (fs.existsSync(scriptPath)) {
      const stats = fs.statSync(scriptPath);
      const fileSizeInBytes = stats.size;
      // Convert bytes to KB and round to 1 decimal place
      const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(1);
      VERSION_INFO.script_size = `${fileSizeInKB} KB`;
    }
  } catch (error) {
    console.error('Error getting script size:', error);
    // Use default size if there's an error
  }

  return NextResponse.json(VERSION_INFO, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 