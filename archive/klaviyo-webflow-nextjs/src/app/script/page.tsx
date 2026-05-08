"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy, ExternalLink, Code, Github, Clock, Info } from "lucide-react";
import { toast } from "sonner";

export default function ScriptPage() {
  const [latestVersion, setLatestVersion] = useState<string>("1.1.0");
  const [scriptSize, setScriptSize] = useState<string>("15.2 KB");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  // Get version info when component mounts
  useEffect(() => {
    fetch('/api/version')
      .then(res => res.json())
      .then(data => {
        setLatestVersion(data.version);
        
        // Format release date
        const releaseDate = new Date(data.release_date);
        setLastUpdated(releaseDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        }));
        
        // Calculate script size based on response data if available
        if (data.script_size) {
          setScriptSize(data.script_size);
        }
      })
      .catch(err => {
        console.error("Error fetching version info:", err);
      });
  }, []);
  
  // Copy script URL to clipboard
  const copyScriptUrl = () => {
    // Use window.location to get the current origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const scriptUrl = `${origin}/api/script`;
    
    navigator.clipboard.writeText(scriptUrl)
      .then(() => {
        toast.success("Script URL copied to clipboard");
      })
      .catch(err => {
        toast.error("Failed to copy URL");
        console.error("Failed to copy:", err);
      });
  };

  // Available versions for dropdown selector
  const AVAILABLE_VERSIONS = ['1.0.0', '1.1.0'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-1">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Klaviyo-Webflow Integration Script</h1>
                <p className="text-xl text-muted-foreground">
                  A lightweight, professional script for connecting Webflow forms to Klaviyo
                </p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="inline-flex items-center gap-1.5 text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                    <Code className="h-3.5 w-3.5" />
                    <span>v{latestVersion}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full">
                    <Download className="h-3.5 w-3.5" />
                    <span>{scriptSize}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{lastUpdated || "Recently updated"}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <Button asChild size="lg" className="rounded-full">
                    <a href="/api/script" download="klaviyo-webflow-integration.js">
                      <Download className="mr-2 h-4 w-4" />
                      Download Latest Script
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full" onClick={copyScriptUrl}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Script URL
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 md:w-64 border rounded-xl bg-card p-6">
              <h3 className="font-medium text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/documentation" className="text-primary hover:underline flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/playground" className="text-primary hover:underline flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Playground
                  </Link>
                </li>
                <li>
                  <a href="https://github.com/yourusername/klaviyo-webflow" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Installation Instructions */}
          <div className="border rounded-xl bg-card overflow-hidden mb-12">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Installation Instructions</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">1. Add the script to your Webflow site</h3>
                <p className="text-muted-foreground mb-4">
                  Copy the script tag below and paste it into your Webflow site&apos;s custom code section
                  (under Site Settings &gt; Custom Code &gt; Footer Code).
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>
                      {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/script"></script>`}
                    </code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      navigator.clipboard.writeText(`<script src="${origin}/api/script"></script>`);
                      toast.success("Code copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md dark:bg-blue-900/20 dark:border-blue-900/30">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Versioning Options
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    For production use, you can pin to a specific version to prevent unexpected changes:
                  </p>
                  <div className="space-y-2">
                    {AVAILABLE_VERSIONS.map(version => (
                      <div key={version} className="relative">
                        <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                          <code>
                            {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/script/v${version}"></script>`}
                          </code>
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-1 top-1 h-6 w-6 p-0"
                          onClick={() => {
                            const origin = typeof window !== 'undefined' ? window.location.origin : '';
                            navigator.clipboard.writeText(`<script src="${origin}/api/script/v${version}"></script>`);
                            toast.success(`v${version} URL copied`);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">2. Initialize with your Klaviyo information</h3>
                <p className="text-muted-foreground mb-4">
                  Add this initialization script with your Klaviyo public API key and list ID.
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>
                      {`<script>
  document.addEventListener('DOMContentLoaded', function() {
    KlaviyoWebflow.init({
      publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
      defaultListId: 'YOUR_KLAVIYO_LIST_ID',
      debug: false
    });
  });
</script>`}
                    </code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`<script>
  document.addEventListener('DOMContentLoaded', function() {
    KlaviyoWebflow.init({
      publicApiKey: 'YOUR_KLAVIYO_PUBLIC_API_KEY',
      defaultListId: 'YOUR_KLAVIYO_LIST_ID',
      debug: false
    });
  });
</script>`);
                      toast.success("Code copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">3. Add attributes to your Webflow forms</h3>
                <p className="text-muted-foreground mb-4">
                  Add the <code className="bg-muted px-1.5 py-0.5 rounded text-sm">data-klaviyo-form</code> attribute to any form you want to connect to Klaviyo.
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    <code>
                      {`<!-- In the Webflow Designer, add these custom attributes to your form -->
<form data-klaviyo-form data-klaviyo-list-id="YOUR_LIST_ID">
  <!-- Your form fields will be automatically mapped to Klaviyo fields -->
</form>`}
                    </code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`<!-- In the Webflow Designer, add these custom attributes to your form -->
<form data-klaviyo-form data-klaviyo-list-id="YOUR_LIST_ID">
  <!-- Your form fields will be automatically mapped to Klaviyo fields -->
</form>`);
                      toast.success("Code copied to clipboard");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Version Information */}
          <div className="border rounded-xl bg-card overflow-hidden mb-12">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Script Details</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Version History</h3>
                  <ul className="space-y-4">
                    <li className="border-l-2 border-primary pl-4 py-1">
                      <div className="font-medium">Version 1.1.0</div>
                      <div className="text-sm text-muted-foreground">Released: {lastUpdated || "Recently"}</div>
                      <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                        <li>Added multi-account support</li>
                        <li>Improved field mapping capabilities</li>
                        <li>Added phone number validation</li>
                        <li>Enhanced error handling</li>
                      </ul>
                    </li>
                    <li className="border-l-2 border-muted pl-4 py-1">
                      <div className="font-medium">Version 1.0.0</div>
                      <div className="text-sm text-muted-foreground">Initial release</div>
                      <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                        <li>Basic Webflow to Klaviyo integration</li>
                        <li>Support for email and name fields</li>
                        <li>List subscription functionality</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Technical Details</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span>{scriptSize}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Load Strategy:</span>
                      <span>Asynchronous</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Dependencies:</span>
                      <span>None (self-contained)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Browser Support:</span>
                      <span>All modern browsers</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Klaviyo API Version:</span>
                      <span>2025-04-15</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">CDN Caching:</span>
                      <span>Yes, 1 year with version pinning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              For detailed instructions and advanced usage, refer to our complete documentation.
            </p>
            <Button asChild variant="default" size="lg" className="rounded-full">
              <Link href="/documentation">
                View Documentation
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 