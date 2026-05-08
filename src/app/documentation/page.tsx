"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VERSIONS } from "@/config/versions";

export default function DocumentationPage() {
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0]);
  
  return (
    <div className="py-10 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          <aside className="hidden md:block sticky top-24 self-start h-[calc(100vh-8rem)] overflow-auto pr-6 border-r">
            {/* Version selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Version:</h4>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
                  {selectedVersion.status}
                </span>
              </div>
              <select 
                value={selectedVersion.number}
                onChange={(e) => {
                  const version = VERSIONS.find(v => v.number === e.target.value);
                  if (version) setSelectedVersion(version);
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                {VERSIONS.map((version) => (
                  <option key={version.number} value={version.number}>
                    {version.number} {version.status === 'latest' ? '(Latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </aside>
          <section id="version-history" className="mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight scroll-m-20">Version History</h2>
              <p className="text-base leading-7">
                Changes and updates to the Klaviyo-Webflow integration.
              </p>
            </div>
            
            <div className="mt-8 space-y-8">
              {VERSIONS.map((version) => (
                <div key={version.number} className="pl-6 border-l-2 border-muted">
                  <div className="flex items-start gap-2 mb-3">
                    <h3 className="text-xl font-semibold">{version.number}</h3>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                      {version.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Released on {version.date}</p>
                  
                  <ul className="list-disc list-inside text-base leading-7 mb-6">
                    {version.changes.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 