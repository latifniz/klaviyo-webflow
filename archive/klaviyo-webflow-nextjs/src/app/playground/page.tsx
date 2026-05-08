"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Zap, 
  Settings, 
  Layout, 
  Send, 
  Copy, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  EyeIcon,
  CodeIcon,
  Clipboard,
  HelpCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Field type definition
interface FieldMapping {
  id: string;
  webflowField: string;
  klaviyoProperty: string;
  required: boolean;
}

// Define interface for form data
interface FormData {
  email: string;
  first_name?: string;
  phone_number?: string;
  company?: string;
  consent?: boolean;
  [key: string]: string | boolean | undefined;
}

// Update submitResult type
interface SubmitResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Step type for the wizard
type Step = 'setup' | 'mapping' | 'preview' | 'code';

export default function PlaygroundPage() {
  // Active step state
  const [activeStep, setActiveStep] = useState<Step>('setup');
  
  // Form state
  const [apiKey, setApiKey] = useState<string>("");
  const [listId, setListId] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [debugMode, setDebugMode] = useState<boolean>(false);
  
  // Field mapping state
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { id: "email", webflowField: "email", klaviyoProperty: "email", required: true },
    { id: "name", webflowField: "name", klaviyoProperty: "first_name", required: false }
  ]);
  
  // Generated code state
  const [installationCode, setInstallationCode] = useState<string>(`<!-- Klaviyo to Webflow Integration -->
<script src="https://your-domain.com/api/script"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    KlaviyoWebflow.init({
      publicApiKey: 'YOUR_API_KEY',
      defaultListId: 'YOUR_LIST_ID',
      debug: false
    });
  });
</script>`);
  
  const [formCode, setFormCode] = useState<string>(`<!-- Add these attributes to your Webflow form element -->
<form data-klaviyo-form data-klaviyo-list-id="YOUR_LIST_ID">
  <!-- Your form content -->
</form>`);

  // Test form state
  const [testEmail, setTestEmail] = useState<string>("");
  const [testName, setTestName] = useState<string>("");
  const [testPhone, setTestPhone] = useState<string>("");
  const [testCompany, setTestCompany] = useState<string>("");
  const [testConsent, setTestConsent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  // Code highlight state
  const [flashInstallation, setFlashInstallation] = useState<boolean>(false);
  const [flashForm, setFlashForm] = useState<boolean>(false);
  
  // Refs
  const installationCodeRef = useRef<HTMLDivElement>(null);
  const formCodeRef = useRef<HTMLDivElement>(null);

  // Generate code based on configuration
  const generateInstallationCode = () => {
    const configOptions = [];
    
    if (apiKey) {
      configOptions.push(`publicApiKey: '${apiKey}'`);
    } else {
      configOptions.push("publicApiKey: 'YOUR_API_KEY'");
    }
    
    if (listId) {
      configOptions.push(`defaultListId: '${listId}'`);
    } else {
      configOptions.push("defaultListId: 'YOUR_LIST_ID'");
    }
    
    configOptions.push(`debug: ${debugMode}`);
    
    if (successMessage) {
      configOptions.push(`successMessage: '${successMessage}'`);
    }
    
    if (redirectUrl) {
      configOptions.push(`redirectUrl: '${redirectUrl}'`);
    }
    
    // Generate field mapping configuration
    if (fieldMappings.length > 2) {
      const fieldMappingConfig = fieldMappings
        .filter(field => field.id !== "email" && field.id !== "name") // Exclude default fields
        .reduce((acc: Record<string, { property: string; required: boolean }>, field) => {
          if (field.webflowField && field.klaviyoProperty) {
            acc[field.webflowField] = {
              property: field.klaviyoProperty,
              required: field.required
            };
          }
          return acc;
        }, {});
      
      if (Object.keys(fieldMappingConfig).length > 0) {
        configOptions.push(`fieldMapping: ${JSON.stringify(fieldMappingConfig, null, 2)}`);
      }
    }
    
    // Get current origin for the script URL
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-site.com';
    
    const newInstallationCode = `<!-- Klaviyo to Webflow Integration -->
<script src="${origin}/api/script"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    KlaviyoWebflow.init({
      ${configOptions.join(',\n      ')}
    });
  });
</script>`;
    
    const newFormCode = `<!-- Add these attributes to your Webflow form element -->
<form data-klaviyo-form data-klaviyo-list-id="${listId || 'YOUR_LIST_ID'}">
  <!-- Your form content -->
</form>`;
    
    setInstallationCode(newInstallationCode);
    setFormCode(newFormCode);
    
    // Auto-advance to code view
    setActiveStep('code');
    
    // Trigger flash highlight
    setFlashInstallation(true);
    setFlashForm(true);
    
    // Reset flash after animation
    setTimeout(() => {
      setFlashInstallation(false);
      setFlashForm(false);
    }, 1500);
    
    toast.success("Integration code generated successfully!");
  };

  // Copy code to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${type} code copied to clipboard!`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  // Add new field mapping
  const addFieldMapping = () => {
    const newId = `field-${Date.now()}`;
    setFieldMappings([
      ...fieldMappings,
      { id: newId, webflowField: "", klaviyoProperty: "", required: false }
    ]);
  };

  // Remove field mapping
  const removeFieldMapping = (id: string) => {
    setFieldMappings(fieldMappings.filter(field => field.id !== id));
  };

  // Update field mapping
  const updateFieldMapping = (id: string, key: keyof FieldMapping, value: unknown) => {
    setFieldMappings(
      fieldMappings.map(field => 
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  // Handle test form submission
  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!apiKey) {
      toast.error("Please enter your Klaviyo API key");
      return;
    }
    
    if (!listId) {
      toast.error("Please enter your Klaviyo List ID");
      return;
    }
    
    if (!testEmail) {
      toast.error("Email is required");
      return;
    }
    
    // Prepare data based on field mappings
    const formData: FormData = {
      email: testEmail,
    };
    
    // Add additional fields if they have values
    if (testName) formData.first_name = testName;
    if (testPhone) formData.phone_number = testPhone;
    if (testCompany) formData.company = testCompany;
    if (testConsent !== undefined) formData.consent = testConsent;
    
    // Simulated API call
    setIsSubmitting(true);
    setSubmitResult(null);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Add list ID to the data
      const submissionData = {
        ...formData,
        list_id: listId
      };
      
      if (Math.random() > 0.2) { // 80% success rate
        // Successful submission
        setSubmitResult({
          success: true,
          message: "Form submitted successfully! In a live environment, this data would be sent to Klaviyo.",
          data: submissionData
        });
        
        // Toast notification
        toast.success("Test submission successful!");
      } else {
        // Simulate error
        setSubmitResult({
          success: false,
          message: "Error submitting to Klaviyo API. Please check your credentials and try again.",
          data: submissionData
        });
        
        // Toast notification
        toast.error("Test submission failed (simulated error)");
      }
    }, 1200);
  };

  // Reset the form
  const resetForm = () => {
    setTestEmail("");
    setTestName("");
    setTestPhone("");
    setTestCompany("");
    setTestConsent(false);
    setSubmitResult(null);
    toast.info("Test form reset");
  };
  
  // Check if the step is complete
  const isStepComplete = (step: Step): boolean => {
    switch (step) {
      case 'setup':
        return !!apiKey && !!listId;
      case 'mapping':
        return fieldMappings.length > 0 && fieldMappings.every(field => 
          field.webflowField && field.klaviyoProperty);
      case 'preview':
        return submitResult?.success === true;
      case 'code':
        return true;
      default:
        return false;
    }
  };
  
  // Navigate to next step
  const goToNextStep = () => {
    const steps: Step[] = ['setup', 'mapping', 'preview', 'code'];
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };
  
  // Navigate to previous step
  const goToPrevStep = () => {
    const steps: Step[] = ['setup', 'mapping', 'preview', 'code'];
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1]);
    }
  };
  
  // Preview the generated code
  const previewCode = () => {
    generateInstallationCode();
  };

  // Render step indicator
  const StepIndicator = () => {
    const steps = [
      { id: 'setup', label: 'Configure', icon: <Settings className="h-4 w-4" /> },
      { id: 'mapping', label: 'Field Mapping', icon: <Layout className="h-4 w-4" /> },
      { id: 'preview', label: 'Test Form', icon: <EyeIcon className="h-4 w-4" /> },
      { id: 'code', label: 'Get Code', icon: <CodeIcon className="h-4 w-4" /> }
    ];
    
    return (
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-8 px-4">
        {steps.map((step, index) => {
          const isActive = activeStep === step.id;
          const isComplete = isStepComplete(step.id as Step);
          const isClickable = index === 0 || isStepComplete(steps[index - 1].id as Step);
          
          return (
            <div key={step.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => isClickable && setActiveStep(step.id as Step)}
                disabled={!isClickable}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2' 
                    : isComplete 
                      ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                      : 'bg-muted text-muted-foreground'
                } ${!isClickable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {isComplete && !isActive ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
                
                <span className="absolute top-full mt-1 text-xs font-medium">
                  {step.label}
                </span>
              </button>
              
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 ${
                  isComplete ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-muted/20">
      {/* Header Bar */}
      <header className="border-b bg-card/60 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Klaviyo Integration Builder</h1>
            </div>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/documentation" className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Documentation</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    View full integration documentation
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button variant="default" size="sm" onClick={previewCode}>
                <Zap className="h-4 w-4 mr-2" />
                <span>Generate Code</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Step Indicator */}
        <StepIndicator />
        
        {/* Content Area */}
        <div className="bg-card rounded-xl border shadow-md overflow-hidden">
          {/* Setup Step */}
          {activeStep === 'setup' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Basic Configuration</h2>
                  <p className="text-muted-foreground">Set up your Klaviyo API connection</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="klaviyo-api-key" className="text-base">Klaviyo Public API Key</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Found in your Klaviyo account under Settings &gt; API Keys
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="klaviyo-api-key" 
                      placeholder="pk_..." 
                      className="h-11"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your Klaviyo Public API Key starts with &quot;pk_&quot;
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="klaviyo-list-id" className="text-base">Klaviyo List ID</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Found in your Klaviyo account under Lists &gt; [Your List] &gt; Settings
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="klaviyo-list-id" 
                      placeholder="ABC123..." 
                      className="h-11"
                      value={listId}
                      onChange={(e) => setListId(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      The unique identifier for your subscriber list
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="success-message" className="text-base">Success Message (optional)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Message to display after successful form submission
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="success-message" 
                      placeholder="Thanks for subscribing!" 
                      className="h-11"
                      value={successMessage}
                      onChange={(e) => setSuccessMessage(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="redirect-url" className="text-base">Redirect URL (optional)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Redirect users to this URL after successful submission
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input 
                      id="redirect-url" 
                      type="url" 
                      placeholder="https://example.com/thank-you" 
                      className="h-11"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox 
                      id="debug-mode" 
                      checked={debugMode}
                      onCheckedChange={(checked) => setDebugMode(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="debug-mode" className="text-sm font-medium">
                          Enable Debug Mode
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Shows detailed logs in browser console for troubleshooting
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Logs detailed information to console for debugging
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-between">
                <div></div>
                <Button 
                  onClick={goToNextStep}
                  disabled={!isStepComplete('setup')}
                  size="lg"
                  className="gap-2"
                >
                  Next: Field Mapping
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Field Mapping Step */}
          {activeStep === 'mapping' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Layout className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Field Mapping</h2>
                  <p className="text-muted-foreground">Map your Webflow form fields to Klaviyo properties</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary" />
                  How Field Mapping Works
                </h3>
                <p className="text-sm text-muted-foreground">
                  Match your Webflow form field names with corresponding Klaviyo properties. 
                  The email field is required and cannot be removed. You can add custom fields 
                  to collect additional information.
                </p>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Webflow Field Name</div>
                  <div>Klaviyo Property</div>
                  <div className="px-3">Required</div>
                  <div className="w-11"></div>
                </div>
                
                {fieldMappings.map((field) => (
                  <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-end">
                    <div className="space-y-2">
                      <Input 
                        value={field.webflowField} 
                        onChange={(e) => updateFieldMapping(field.id, 'webflowField', e.target.value)}
                        readOnly={field.id === 'email'}
                        className={`h-11 ${field.id === 'email' ? 'bg-muted/40' : ''}`} 
                        placeholder="e.g., name, phone, company"
                      />
                      {field.id === 'email' && (
                        <p className="text-xs text-muted-foreground">Required email field</p>
                      )}
                    </div>
                    <div>
                      <Input 
                        value={field.klaviyoProperty} 
                        onChange={(e) => updateFieldMapping(field.id, 'klaviyoProperty', e.target.value)}
                        readOnly={field.id === 'email'}
                        className={`h-11 ${field.id === 'email' ? 'bg-muted/40' : ''}`}
                        placeholder="e.g., first_name, phone_number" 
                      />
                    </div>
                    <div className="flex items-center justify-center h-11 px-3">
                      <Checkbox 
                        id={`required-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(checked) => updateFieldMapping(field.id, 'required', checked)}
                        disabled={field.id === 'email'}
                      />
                    </div>
                    {field.id !== 'email' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFieldMapping(field.id)}
                        className="h-11 w-11"
                        aria-label="Remove field"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    ) : (
                      <div className="w-11 h-11"></div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mb-8">
                <Button variant="outline" size="sm" onClick={addFieldMapping} className="h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Field
                </Button>
              </div>
              
              <div className="mt-10 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={goToPrevStep}
                  size="lg"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                
                <Button 
                  onClick={goToNextStep}
                  disabled={!isStepComplete('mapping')}
                  size="lg" 
                  className="gap-2"
                >
                  Next: Test Form
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Preview Step */}
          {activeStep === 'preview' && (
            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <EyeIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">Test Your Integration</h2>
                    <p className="text-muted-foreground">Preview how your form will work</p>
                  </div>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 mb-6">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>This is a simulation only. No actual data will be sent to Klaviyo.</span>
                  </p>
                </div>
                
                <form className="space-y-5" onSubmit={handleTestSubmit}>
                  <div className="space-y-3">
                    <Label htmlFor="test-email" className="text-base">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="test-email" 
                      name="email" 
                      type="email" 
                      required 
                      className="h-11" 
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="test-name" className="text-base">First Name</Label>
                    <Input 
                      id="test-name" 
                      name="name" 
                      className="h-11"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="test-phone" className="text-base">Phone Number</Label>
                    <Input 
                      id="test-phone" 
                      name="phone" 
                      type="tel" 
                      className="h-11"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="test-company" className="text-base">Company</Label>
                    <Input 
                      id="test-company" 
                      name="company" 
                      className="h-11"
                      value={testCompany}
                      onChange={(e) => setTestCompany(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox 
                      id="test-consent" 
                      checked={testConsent}
                      onCheckedChange={(checked) => setTestConsent(checked as boolean)}
                    />
                    <Label htmlFor="test-consent" className="text-base font-normal">
                      I agree to receive marketing emails
                    </Label>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="h-11 flex-1"
                      disabled={isSubmitting || !apiKey || !listId || !testEmail}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : "Submit Test Form"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11"
                      onClick={resetForm}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="p-8 bg-muted/5">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Results Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See what data will be sent to Klaviyo
                  </p>
                </div>
                
                {submitResult ? (
                  <div className={`p-5 rounded-lg ${
                    submitResult.success 
                      ? "bg-green-50 border border-green-100 text-green-800 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300"
                      : "bg-red-50 border border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-300"
                  }`}>
                    <div className="flex items-start gap-3 mb-4">
                      {submitResult.success ? (
                        <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{submitResult.success ? "Success!" : "Error"}</p>
                        <p className="text-sm mt-1">{submitResult.message}</p>
                      </div>
                    </div>
                    
                    {submitResult.data && (
                      <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">API Payload</p>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => copyToClipboard(JSON.stringify(submitResult.data, null, 2), "Payload")}
                          >
                            <Clipboard className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-white/50 dark:bg-black/20 rounded-md p-3 overflow-x-auto">
                          <pre className="text-xs text-slate-800 dark:text-slate-200">
                            {JSON.stringify(submitResult.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 border border-dashed rounded-lg bg-muted/20">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <Send className="h-6 w-6 text-primary/70" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Data Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Submit the test form to see a preview of the data that would be sent to Klaviyo
                    </p>
                  </div>
                )}
                
                <div className="mt-10 flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={goToPrevStep}
                    size="lg"
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button 
                    onClick={previewCode}
                    size="lg"
                    className="gap-2"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Code
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Code Step */}
          {activeStep === 'code' && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CodeIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">Implementation Code</h2>
                  <p className="text-muted-foreground">Copy these snippets to your Webflow site</p>
                </div>
              </div>
              
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">1</span>
                    <h3 className="text-base font-medium">Add this script to your Webflow site&apos;s head section</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto h-8"
                      onClick={() => copyToClipboard(installationCode, "Setup")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <div 
                    ref={installationCodeRef} 
                    className={`bg-muted/50 dark:bg-slate-900/50 p-5 rounded-lg overflow-x-auto transition-colors duration-300 ${flashInstallation ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                  >
                    <pre className="text-sm font-mono text-foreground/90">{installationCode}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    Add this to your site-wide header code in Webflow&apos;s custom code settings
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">2</span>
                    <h3 className="text-base font-medium">Add these attributes to your Webflow form</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto h-8"
                      onClick={() => copyToClipboard(formCode, "Form")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  
                  <div 
                    ref={formCodeRef} 
                    className={`bg-muted/50 dark:bg-slate-900/50 p-5 rounded-lg overflow-x-auto transition-colors duration-300 ${flashForm ? 'bg-primary/10 dark:bg-primary/20' : ''}`}
                  >
                    <pre className="text-sm font-mono text-foreground/90">{formCode}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    Add these attributes to each form you want to connect to Klaviyo
                  </p>
                </div>
                
                <div className="p-5 bg-blue-50 border border-blue-100 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/30 dark:text-blue-300 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ready to implement?</p>
                      <p className="text-sm mt-1">
                        Copy these code snippets to your Webflow site. For detailed implementation 
                        instructions, check the <Link href="/documentation" className="text-blue-600 dark:text-blue-400 underline underline-offset-2">documentation</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={goToPrevStep}
                  size="lg"
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Testing
                </Button>
                
                <Button asChild size="lg" className="gap-2" variant="default">
                  <Link href="/documentation" className="flex items-center">
                    View Full Documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-16 border-t py-10 bg-muted/30">
        <div className="container">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              This is a free and open-source tool created by <a href="https://stackpack.pro" className="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer">Javin Towers</a>.
              Need implementation help? <a href="https://stackpack.pro" className="text-primary font-medium hover:underline" target="_blank" rel="noopener noreferrer">Contact StackPack</a> for professional assistance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 