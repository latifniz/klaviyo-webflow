/**
 * Version configuration for the Klaviyo to Webflow integration script
 * This file centralizes all version information and provides utility functions
 */

export interface ScriptVersion {
  version: string;
  releaseDate: string;
  status: 'latest' | 'stable' | 'legacy' | 'beta';
  changes: string[];
  filePath: string;
  minifiedPath: string;
}

/**
 * Array of all script versions with their details
 * Newest versions should be added to the top of the array
 */
export const VERSIONS: ScriptVersion[] = [
  {
    version: '1.2.0',
    releaseDate: '2023-11-15',
    status: 'latest',
    changes: [
      'Added SMS subscription capability',
      'Improved error handling with detailed messages',
      'Better compatibility with complex Webflow forms',
      'Added version auto-update notification',
      'Performance optimizations'
    ],
    filePath: '/scripts/versions/klaviyo-webflow-1.2.0.js',
    minifiedPath: '/scripts/versions/klaviyo-webflow-1.2.0.min.js'
  },
  {
    version: '1.1.0',
    releaseDate: '2023-08-10',
    status: 'stable',
    changes: [
      'Custom success message support',
      'Improved form validation',
      'Added support for multi-list subscriptions',
      'Better error handling',
      'Documentation improvements'
    ],
    filePath: '/scripts/versions/klaviyo-webflow-1.1.0.js',
    minifiedPath: '/scripts/versions/klaviyo-webflow-1.1.0.min.js'
  },
  {
    version: '1.0.0',
    releaseDate: '2023-05-20',
    status: 'legacy',
    changes: [
      'Initial release',
      'Basic form submission to Klaviyo',
      'Custom field mapping',
      'Basic error handling'
    ],
    filePath: '/scripts/versions/klaviyo-webflow-1.0.0.js',
    minifiedPath: '/scripts/versions/klaviyo-webflow-1.0.0.min.js'
  }
];

/**
 * Get the latest version of the script
 */
export function getLatestVersion(): ScriptVersion {
  return VERSIONS.find(v => v.status === 'latest') || VERSIONS[0];
}

/**
 * Get a specific version by version number
 * @param versionNumber The version number to find (e.g., "1.1.0")
 */
export function getVersionByNumber(versionNumber: string): ScriptVersion | null {
  return VERSIONS.find(v => v.version === versionNumber) || null;
}

/**
 * Check if a version number is valid
 * @param versionNumber The version number to check
 */
export function isValidVersion(versionNumber: string): boolean {
  return VERSIONS.some(v => v.version === versionNumber);
} 