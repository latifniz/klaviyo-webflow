import { getLatestVersion, getVersionByNumber } from '../config/versions';
import { trackScriptUsage, trackError } from './analytics';

interface VersionInfo {
  current: string;
  latest: string;
  isLatest: boolean;
  updateAvailable: boolean;
  updateUrl: string;
}

const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const VERSION_CHECK_ENDPOINT = 'https://api.klaviyowebflow.com/version-check';
const UPDATE_URL = 'https://klaviyowebflow.com/documentation#version-history';

/**
 * Checks if a version update is available
 * @param currentVersion The current version of the script
 * @returns Promise with version information
 */
export async function checkVersionUpdate(currentVersion: string): Promise<VersionInfo> {
  try {
    // Track usage with version information
    trackScriptUsage(currentVersion, null, null, { event: 'version_check' });
    
    // Get the latest version from our config
    const latestVersion = getLatestVersion();
    const current = getVersionByNumber(currentVersion);
    
    if (!current) {
      throw new Error(`Invalid current version: ${currentVersion}`);
    }
    
    // Try to fetch the latest version info from the API
    let remoteLatestVersion = latestVersion.version;
    try {
      const response = await fetch(`${VERSION_CHECK_ENDPOINT}?current=${currentVersion}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        remoteLatestVersion = data.latestVersion || latestVersion.version;
      }
    } catch (error) {
      // Fallback to local configuration if API call fails
      console.debug('Failed to check for updates from API, using local version info');
    }
    
    // Compare versions
    const isLatest = currentVersion === remoteLatestVersion;
    const updateAvailable = !isLatest;
    
    return {
      current: currentVersion,
      latest: remoteLatestVersion,
      isLatest,
      updateAvailable,
      updateUrl: UPDATE_URL
    };
  } catch (error) {
    trackError('version_check_failed', error instanceof Error ? error.message : String(error));
    
    // Return safe defaults
    return {
      current: currentVersion,
      latest: currentVersion,
      isLatest: true,
      updateAvailable: false,
      updateUrl: UPDATE_URL
    };
  }
}

/**
 * Shows a notification if an update is available
 * @param versionInfo Version information from checkVersionUpdate
 * @param elementId Optional ID of an element to show the notification in
 */
export function showUpdateNotification(versionInfo: VersionInfo, elementId?: string): void {
  if (!versionInfo.updateAvailable) return;
  
  try {
    // Create notification message
    const message = `Update available: Version ${versionInfo.latest} is now available. You're currently using version ${versionInfo.current}.`;
    
    if (elementId) {
      // Show in specified element
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `
          <div class="klaviyo-update-notification">
            <p>${message}</p>
            <a href="${versionInfo.updateUrl}" target="_blank" rel="noopener">View update</a>
          </div>
        `;
      }
    } else {
      // Or show in console
      console.info(`[Klaviyo-Webflow] ${message} View update: ${versionInfo.updateUrl}`);
    }
  } catch (error) {
    trackError('update_notification_failed', error instanceof Error ? error.message : String(error));
  }
}

/**
 * Schedules a periodic check for updates
 * @param currentVersion The current version of the script
 * @param notificationElementId Optional element ID for displaying notifications
 */
export function setupVersionChecker(currentVersion: string, notificationElementId?: string): void {
  // Check immediately on initialization
  checkVersionUpdate(currentVersion).then(versionInfo => {
    showUpdateNotification(versionInfo, notificationElementId);
  });
  
  // Schedule periodic checks
  const lastCheckTime = localStorage.getItem('klaviyo_webflow_update_check');
  const shouldCheck = !lastCheckTime || (Date.now() - parseInt(lastCheckTime)) > UPDATE_CHECK_INTERVAL;
  
  if (shouldCheck) {
    // Record check time
    localStorage.setItem('klaviyo_webflow_update_check', Date.now().toString());
    
    // Schedule next check
    setTimeout(() => {
      checkVersionUpdate(currentVersion).then(versionInfo => {
        showUpdateNotification(versionInfo, notificationElementId);
      });
    }, UPDATE_CHECK_INTERVAL);
  }
} 