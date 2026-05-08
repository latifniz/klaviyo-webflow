/**
 * Track script usage for analytics purposes
 * @param version Script version being served
 * @param referrer Referrer URL (domain using the script)
 * @param userAgent User agent of the request
 * @param params Additional parameters to track
 */
export function trackScriptUsage(
  version: string, 
  referrer: string | null = null, 
  userAgent: string | null = null,
  params: Record<string, any> = {}
) {
  // Log request information for development
  console.log(`Script usage - Version: ${version}, Referrer: ${referrer || 'unknown'}, UA: ${userAgent || 'unknown'}`);
  
  // In production, send data to analytics service
  if (process.env.ANALYTICS_ENDPOINT) {
    try {
      fetch(process.env.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          version, 
          referrer: referrer || 'unknown', 
          userAgent: userAgent || 'unknown',
          timestamp: new Date().toISOString(),
          ...params
        })
      }).catch(err => console.error('Analytics error:', err));
    } catch (error) {
      // Fail silently - analytics should never break the main functionality
      console.error('Failed to send analytics:', error);
    }
  }
}

/**
 * Track errors for monitoring and debugging
 * @param errorType Type of error that occurred
 * @param errorMessage Error message
 * @param context Additional context about the error
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  context: Record<string, any> = {}
) {
  console.error(`Error: [${errorType}] ${errorMessage}`, context);
  
  // In production, send to error monitoring service
  if (process.env.ERROR_MONITORING_ENDPOINT) {
    try {
      fetch(process.env.ERROR_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: errorType,
          message: errorMessage,
          context,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Error reporting failed:', err));
    } catch (error) {
      // Just log to console if error reporting fails
      console.error('Failed to report error:', error);
    }
  }
} 