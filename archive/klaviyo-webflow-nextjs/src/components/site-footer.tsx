import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-2">
                <span className="inline-block font-bold">
                  <span className="text-primary">Klaviyo</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary">Webflow</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Connect Webflow forms to Klaviyo in minutes without any coding.
              </p>
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/documentation" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/playground" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    Playground
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.klaviyo.com/help" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Klaviyo Help Center
                  </a>
                </li>
                <li>
                  <a 
                    href="https://university.webflow.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Webflow University
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/javron/klaviyo-webflow" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:support@example.com"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    support@example.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/example"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Klaviyo to Webflow Integration. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/javron/klaviyo-webflow" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a 
              href="https://twitter.com/example" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 