"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckIcon, ArrowRightIcon, Code, Zap, Search, Shield, Mail, LayoutList, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [animationActive, setAnimationActive] = useState(false);
  
  useEffect(() => {
    // Start the animation after a small delay
    const timer = setTimeout(() => {
      setAnimationActive(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section - Completely Rebuilt */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-small-black/[0.02] -z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-full max-w-4xl h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>
        
        {/* Main content container */}
        <div className="container relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                Open Source Project
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
                Webflow to Klaviyo <span className="text-primary">Form Integration</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-[42rem]">
                A simple script that connects your Webflow forms to Klaviyo lists. Created for the Webflow community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="px-8 h-12 rounded-full">
                  <Link href="/playground">Try It Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 h-12 rounded-full">
                  <Link href="/documentation">Documentation</Link>
                </Button>
              </div>
            </div>
            
            {/* Integration Visualization - Completely Rebuilt */}
            <div className="flex-1 w-full max-w-[600px] relative">
              {/* Visual interaction container */}
              <div className="relative">
                {/* Background glow effects */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/10 dark:bg-blue-400/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600/10 dark:bg-indigo-400/10 rounded-full blur-xl"></div>
                
                {/* Integration container */}
                <div className="relative rounded-xl p-6 md:p-8 overflow-hidden bg-black border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-indigo-950/20 to-purple-950/30"></div>
                  
                  {/* Interface components wrapper */}
                  <div className="relative z-10">
                    {/* Desktop layout (side by side) */}
                    <div className="hidden md:flex items-center justify-between relative">
                      {/* Webflow Form */}
                      <div className="w-[45%] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300" id="webflow-box">
                        {/* Window header */}
                        <div className="bg-gray-800 px-4 py-2 flex items-center">
                          <div className="flex space-x-2 mr-4">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-gray-400 text-sm font-medium">Webflow Form</div>
                        </div>
                        
                        {/* Form content */}
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-gray-400 text-xs mb-1">Email</label>
                              <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                                user@example.com
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-400 text-xs mb-1">Name</label>
                              <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                                Jane Smith
                              </div>
                            </div>
                            <div className="pt-2">
                              <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded">
                                Subscribe
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Form attribute */}
                        <div className="border-t border-gray-800 px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">Attribute:</span>
                            <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded font-mono">
                              data-klaviyo-form
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connection Line - Desktop */}
                      <div className="absolute left-1/2 top-1/2 w-[10%] h-0.5 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        {/* Line base */}
                        <div className="w-full h-full bg-gradient-to-r from-blue-500/70 via-indigo-500/70 to-purple-500/70"></div>
                        
                        {/* Center Node */}
                        <div className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-glow-md z-10"></div>
                        
                        {/* Animated flow overlay */}
                        <div className={`absolute inset-0 flex items-center ${animationActive ? 'animate-pulse-connection' : ''}`}>
                          <div className="relative w-full h-full overflow-hidden">
                            {/* Data flow particles */}
                            <div className={`absolute inset-0 ${animationActive ? 'animate-data-flow' : ''}`}>
                              <div className="absolute top-0 left-[5%] w-2 h-2 bg-blue-400/80 rounded-full transform -translate-y-1/2"></div>
                              <div className="absolute top-0 left-[25%] w-1.5 h-1.5 bg-indigo-400/80 rounded-full transform -translate-y-1/2 delay-75"></div>
                              <div className="absolute top-0 left-[50%] w-2.5 h-2.5 bg-white/40 rounded-full transform -translate-y-1/2 delay-100"></div>
                              <div className="absolute top-0 left-[75%] w-1.5 h-1.5 bg-purple-400/80 rounded-full transform -translate-y-1/2 delay-150"></div>
                              <div className="absolute top-0 left-[95%] w-2 h-2 bg-indigo-400/80 rounded-full transform -translate-y-1/2 delay-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Klaviyo System */}
                      <div className="w-[45%] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300" id="klaviyo-box">
                        {/* Window header */}
                        <div className="bg-indigo-900/50 px-4 py-2 flex items-center">
                          <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>
                          <div className="text-gray-300 text-sm font-medium">Klaviyo System</div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="text-gray-400 text-xs mb-2">Subscriber added to list</div>
                              <div className="flex items-center">
                                <div className="h-6 w-6 bg-green-900/30 rounded-full flex items-center justify-center mr-2">
                                  <CheckIcon className="h-3 w-3 text-green-500" />
                                </div>
                                <span className="text-white text-sm">Jane Smith</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-gray-400 text-xs mb-1">Properties</div>
                              <div className="bg-gray-800 border border-gray-700 rounded p-3 font-mono text-xs">
                                <span className="text-gray-300">&#123;</span><br />
                                <span className="ml-4 text-blue-400">&quot;email&quot;</span>: <span className="text-green-400">&quot;user@example.com&quot;</span>,<br />
                                <span className="ml-4 text-blue-400">&quot;first_name&quot;</span>: <span className="text-green-400">&quot;Jane&quot;</span><br />
                                <span className="text-gray-300">&#125;</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status bar */}
                        <div className="border-t border-gray-800 px-4 py-2 flex justify-between items-center">
                          <span className="text-xs text-gray-400">List: Newsletter</span>
                          <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                            Subscribed
                          </span>
                        </div>
                      </div>
                      
                      {/* Integration Script Label - Desktop */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[3rem] z-20">
                        <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-full px-3 py-1">
                          <span className="text-xs text-gray-300">Integration Script</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile layout (stacked) */}
                    <div className="flex md:hidden flex-col gap-8 relative">
                      {/* Webflow Form */}
                      <div className="w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300" id="webflow-box-mobile">
                        {/* Window header */}
                        <div className="bg-gray-800 px-4 py-2 flex items-center">
                          <div className="flex space-x-2 mr-4">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-gray-400 text-sm font-medium">Webflow Form</div>
                        </div>
                        
                        {/* Form content */}
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-gray-400 text-xs mb-1">Email</label>
                              <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                                user@example.com
                              </div>
                            </div>
                            <div>
                              <label className="block text-gray-400 text-xs mb-1">Name</label>
                              <div className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                                Jane Smith
                              </div>
                            </div>
                            <div className="pt-2">
                              <button className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded">
                                Subscribe
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Form attribute */}
                        <div className="border-t border-gray-800 px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">Attribute:</span>
                            <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 rounded font-mono">
                              data-klaviyo-form
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Connection Line - Mobile */}
                      <div className="absolute left-1/2 top-[calc(50%-1.5rem)] w-0.5 h-[3rem] -translate-x-1/2 flex items-center justify-center">
                        {/* Line base */}
                        <div className="w-full h-full bg-gradient-to-b from-blue-500/70 via-indigo-500/70 to-purple-500/70"></div>
                        
                        {/* Center Node */}
                        <div className="absolute w-3 h-3 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 shadow-glow-md z-10"></div>
                        
                        {/* Animated flow overlay */}
                        <div className={`absolute inset-0 flex items-center ${animationActive ? 'animate-pulse-connection' : ''}`}>
                          <div className="relative w-full h-full overflow-hidden">
                            {/* Data flow particles */}
                            <div className={`absolute inset-0 ${animationActive ? 'animate-data-flow-vertical' : ''}`}>
                              <div className="absolute left-0 top-[5%] h-2 w-2 bg-blue-400/80 rounded-full transform -translate-x-1/2"></div>
                              <div className="absolute left-0 top-[25%] h-1.5 w-1.5 bg-indigo-400/80 rounded-full transform -translate-x-1/2 delay-75"></div>
                              <div className="absolute left-0 top-[50%] h-2.5 w-2.5 bg-white/40 rounded-full transform -translate-x-1/2 delay-100"></div>
                              <div className="absolute left-0 top-[75%] h-1.5 w-1.5 bg-purple-400/80 rounded-full transform -translate-x-1/2 delay-150"></div>
                              <div className="absolute left-0 top-[95%] h-2 w-2 bg-indigo-400/80 rounded-full transform -translate-x-1/2 delay-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Integration Script Label - Mobile */}
                      <div className="absolute left-1/2 top-[calc(50%-0.25rem)] -translate-x-1/2 z-20">
                        <div className="bg-gray-800 border border-gray-700 shadow-xl rounded-full px-3 py-1">
                          <span className="text-xs text-gray-300">Integration Script</span>
                        </div>
                      </div>
                      
                      {/* Klaviyo System */}
                      <div className="w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300" id="klaviyo-box-mobile">
                        {/* Window header */}
                        <div className="bg-indigo-900/50 px-4 py-2 flex items-center">
                          <div className="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>
                          <div className="text-gray-300 text-sm font-medium">Klaviyo System</div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="text-gray-400 text-xs mb-2">Subscriber added to list</div>
                              <div className="flex items-center">
                                <div className="h-6 w-6 bg-green-900/30 rounded-full flex items-center justify-center mr-2">
                                  <CheckIcon className="h-3 w-3 text-green-500" />
                                </div>
                                <span className="text-white text-sm">Jane Smith</span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-gray-400 text-xs mb-1">Properties</div>
                              <div className="bg-gray-800 border border-gray-700 rounded p-3 font-mono text-xs">
                                <span className="text-gray-300">&#123;</span><br />
                                <span className="ml-4 text-blue-400">&quot;email&quot;</span>: <span className="text-green-400">&quot;user@example.com&quot;</span>,<br />
                                <span className="ml-4 text-blue-400">&quot;first_name&quot;</span>: <span className="text-green-400">&quot;Jane&quot;</span><br />
                                <span className="text-gray-300">&#125;</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status bar */}
                        <div className="border-t border-gray-800 px-4 py-2 flex justify-between items-center">
                          <span className="text-xs text-gray-400">List: Newsletter</span>
                          <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded">
                            Subscribed
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Steps indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <span className="flex h-5 w-5 rounded-full bg-blue-900/50 text-blue-400 items-center justify-center text-[10px] font-medium">1</span>
                          <span>Add script</span>
                        </div>
                        <ArrowRightIcon className="h-3 w-3 text-gray-600" />
                        <div className="flex items-center space-x-2">
                          <span className="flex h-5 w-5 rounded-full bg-indigo-900/50 text-indigo-400 items-center justify-center text-[10px] font-medium">2</span>
                          <span>Tag form</span>
                        </div>
                        <ArrowRightIcon className="h-3 w-3 text-gray-600" />
                        <div className="flex items-center space-x-2">
                          <span className="flex h-5 w-5 rounded-full bg-green-900/50 text-green-400 items-center justify-center text-[10px] font-medium">3</span>
                          <span>Done!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-muted/30 relative">
        <div className="absolute inset-0 bg-grid-small-black/[0.03] -z-10"></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Connect your Webflow forms to Klaviyo in three steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center bg-card border rounded-xl p-8 shadow-sm relative">
              <div className="absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <span className="text-lg font-bold">1</span>
              </div>
              <div className="h-20"></div>
              <h3 className="text-xl font-semibold mb-3">Add the script</h3>
              <p className="text-muted-foreground">Copy the integration script to your Webflow site&apos;s custom code settings.</p>
              <Link href="/script" className="text-primary hover:underline text-sm flex items-center mt-2">
                <ExternalLink className="h-3 w-3 mr-1" />
                Get the script
              </Link>
            </div>
            <div className="flex flex-col items-center text-center bg-card border rounded-xl p-8 shadow-sm relative">
              <div className="absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <span className="text-lg font-bold">2</span>
              </div>
              <div className="h-20"></div>
              <h3 className="text-xl font-semibold mb-3">Configure Klaviyo details</h3>
              <p className="text-muted-foreground">Add your Klaviyo API key and list ID to establish the connection.</p>
            </div>
            <div className="flex flex-col items-center text-center bg-card border rounded-xl p-8 shadow-sm relative">
              <div className="absolute -top-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <span className="text-lg font-bold">3</span>
              </div>
              <div className="h-20"></div>
              <h3 className="text-xl font-semibold mb-3">Tag your forms</h3>
              <p className="text-muted-foreground">Add data attributes to any form you want to connect to Klaviyo.</p>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <Button asChild size="lg" className="rounded-full group">
              <Link href="/documentation" className="flex items-center">
                View Full Instructions 
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Integration Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for a seamless Webflow to Klaviyo connection
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col p-8 rounded-xl border bg-card shadow-sm h-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Setup</h3>
              <p className="text-muted-foreground mb-4">A script tag and a few form attributes are all you need to get started.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">No custom code needed</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Works with Webflow forms</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-8 rounded-xl border bg-card shadow-sm h-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Field Mapping</h3>
              <p className="text-muted-foreground mb-4">Maps form fields to Klaviyo properties with support for custom fields.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Standard field mapping</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Custom field support</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-8 rounded-xl border bg-card shadow-sm h-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <LayoutList className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-List Support</h3>
              <p className="text-muted-foreground mb-4">Connect different forms to different Klaviyo lists as needed.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Multiple list targeting</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Per-form configuration</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-8 rounded-xl border bg-card shadow-sm h-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Consent Tracking</h3>
              <p className="text-muted-foreground mb-4">Built-in consent tracking options for compliance purposes.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Consent checkboxes</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">GDPR considerations</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-8 rounded-xl border bg-card shadow-sm h-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Events</h3>
              <p className="text-muted-foreground mb-4">Track form submissions as custom events in Klaviyo.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Form submission tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Custom event properties</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-8 rounded-xl border bg-card shadow-sm h-full">
              <div className="bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Form Validation</h3>
              <p className="text-muted-foreground mb-4">Basic validation for email formats and required fields.</p>
              <ul className="space-y-2 mt-auto">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Email format checks</span>
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Required field validation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 md:py-28 bg-muted/30 relative">
        <div className="absolute inset-0 bg-grid-small-black/[0.03] -z-10"></div>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Try Before You Implement
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Interactive Playground</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Experiment with different form configurations and see exactly how your data flows into Klaviyo.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <CheckIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Test forms instantly</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try different field configurations and see immediate results
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <CheckIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">Validation previews</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      See how email validation and required fields work in real-time
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                    <CheckIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">API payload inspection</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      View the exact data structure sent to Klaviyo for each submission
                    </p>
                  </div>
                </li>
              </ul>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/playground">Open Playground</Link>
              </Button>
            </div>
            <div>
              <div className="bg-card border rounded-xl overflow-hidden shadow-lg">
                <div className="border-b p-3 bg-muted/50">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="h-5 w-[180px] bg-muted rounded ml-2"></div>
                  </div>
                </div>
                <div className="divide-y">
                  <div className="p-6">
                    <h3 className="font-medium text-lg mb-4">Klaviyo Integration Playground</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <div className="h-10 rounded-md border bg-input px-3 py-2 text-sm flex items-center">
                          example@email.com
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <div className="h-10 rounded-md border bg-input px-3 py-2 text-sm flex items-center">
                          John
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Klaviyo List</label>
                        <div className="h-10 rounded-md border bg-input px-3 py-2 text-sm flex items-center">
                          <span className="text-muted-foreground">Select list...</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded border border-primary bg-primary flex items-center justify-center">
                          <CheckIcon className="h-3 w-3 text-white" />
                        </div>
                        <label className="text-sm">Subscribe to marketing emails</label>
                      </div>
                      <div className="pt-2">
                        <div className="bg-primary text-primary-foreground rounded-md h-10 px-4 flex items-center justify-center font-medium">
                          Submit Form
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-sm font-medium mb-3">API Request Preview</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-xs">
                      <div className="text-blue-500">POST /api/klaviyo/track-submission</div>
                      <div className="mt-2 text-muted-foreground">
                        &#123;<br />
                        &nbsp;&nbsp;&quot;email&quot;: &quot;example@email.com&quot;,<br />
                        &nbsp;&nbsp;&quot;firstName&quot;: &quot;John&quot;,<br />
                        &nbsp;&nbsp;&quot;listId&quot;: &quot;xyzABC123&quot;,<br />
                        &nbsp;&nbsp;&quot;consent&quot;: true<br />
                        &#125;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Common questions about the Webflow to Klaviyo integration</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Do I need to know how to code?</h3>
                <p className="text-muted-foreground">No coding is required. The integration uses data attributes on standard Webflow forms.</p>
              </div>
              <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Which Webflow forms are supported?</h3>
                <p className="text-muted-foreground">All native Webflow forms are supported, including Form Blocks and custom Form elements.</p>
              </div>
              <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Can I use multiple Klaviyo lists?</h3>
                <p className="text-muted-foreground">Yes, different forms can connect to different Klaviyo lists based on the data attributes you set.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Will this affect page performance?</h3>
                <p className="text-muted-foreground">The script is lightweight and loads asynchronously to minimize any impact on page loading.</p>
              </div>
              <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Is this GDPR compliant?</h3>
                <p className="text-muted-foreground">The integration includes consent tracking options that can be configured to help with GDPR requirements.</p>
              </div>
              <div className="border rounded-xl p-6 bg-card">
                <h3 className="text-xl font-semibold mb-2">Where can I get help?</h3>
                <p className="text-muted-foreground">This is an open-source project with documentation. Professional implementation help is available through <a href="https://stackpack.pro" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">StackPack</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 md:py-28 bg-muted/30 relative">
        <div className="absolute inset-0 bg-grid-small-black/[0.03] -z-10"></div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              Community Project
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Free and Open Source</h2>
            <p className="text-xl text-muted-foreground mb-10">
              This project is available for free use by the Webflow community. The code is open source and available for contributions.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="p-8 bg-card rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Use It Freely</h3>
                <ul className="text-left space-y-3">
                  <li className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-1 rounded-full">
                      <CheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>No licensing fees</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-1 rounded-full">
                      <CheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>No usage restrictions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 bg-primary/10 p-1 rounded-full">
                      <CheckIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span>Open source code</span>
                  </li>
                </ul>
              </div>
              <div className="p-8 bg-card rounded-xl border">
                <h3 className="text-xl font-semibold mb-4">Professional Help</h3>
                <p className="text-muted-foreground mb-6">Need implementation assistance with your Webflow project?</p>
                <Button asChild variant="default" size="lg" className="rounded-full">
                  <a href="https://stackpack.pro" target="_blank" rel="noopener noreferrer">Contact StackPack</a>
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Created by <a href="https://stackpack.pro" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Javin Towers</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-background relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-full max-w-4xl h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connect your Webflow forms to Klaviyo with this free integration tool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 h-12 rounded-full">
                <Link href="/playground">Try It Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 h-12 rounded-full">
                <Link href="/documentation">Read the Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
