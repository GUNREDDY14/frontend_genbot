'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Settings, Palette, Eye, Plus, Trash2, Sparkles, Zap, Globe, MessageCircle, Upload, FileText, X, Mic, MicOff, Volume2 } from "lucide-react";

interface ChatbotFormData {
  name: string;
  welcomeMessage: string;
  placeholderText: string;
  tone: string;
  primaryColor: string;
  icon: string;
  responseLength: string;
  urls: string[];
  filePaths: string[];
  additionalInfo: string;
}

export default function CreateChatbotPage() {
  const router = useRouter();
  const { user, companyId } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [scrapingStatus, setScrapingStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [scrapingStarted, setScrapingStarted] = useState(false);
  const [chatbotId, setChatbotId] = useState<string>('');
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [botData, setBotData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date, followUpQuestions?: string[], isLoading?: boolean}>>([]);
  const [threadId, setThreadId] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [showVoiceScreen, setShowVoiceScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [generatedIframe, setGeneratedIframe] = useState<string>('');
  
  const [formData, setFormData] = useState<ChatbotFormData>({
    name: '',
    welcomeMessage: 'Hello! How can I help you today?',
    placeholderText: 'Type your message...',
    tone: 'friendly',
    primaryColor: '#3B82F6',
    icon: 'BotIcon1',
    responseLength: 'medium',
    urls: [''],
    filePaths: [],
    additionalInfo: ''
  });

  const handleInputChange = (field: keyof ChatbotFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.urls];
    newUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      urls: newUrls
    }));
  };

  // File upload states and handlers
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      // Accept common document types
      const validTypes = [
        'text/plain',
        'text/csv',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/json',
        'text/markdown'
      ];
      return validTypes.includes(file.type) || file.name.endsWith('.md') || file.name.endsWith('.txt');
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Some files were skipped",
        description: "Only text, PDF, Word, CSV, JSON, and Markdown files are supported.",
        variant: "destructive"
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Update form data with file paths (in a real app, you'd upload these to a server first)
    const newFilePaths = validFiles.map(file => file.name); // In production, this would be actual server paths
    setFormData(prev => ({
      ...prev,
      filePaths: [...prev.filePaths, ...newFilePaths]
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      filePaths: prev.filePaths.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Generate random UUID for chatbot_id and thread_id
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Initialize UUIDs on component mount
  React.useEffect(() => {
    if (!chatbotId) setChatbotId(generateUUID());
    if (!threadId) setThreadId(generateUUID());
  }, []);

  // Auto-scroll to bottom when new messages are added
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Check if companyId is available
  React.useEffect(() => {
    if (!companyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a chatbot.",
        variant: "destructive"
      });
      router.push('/auth/signin');
    }
  }, [companyId, router, toast]);

  // Background scraping function
  const startBackgroundScraping = async () => {
    if (!companyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a chatbot.",
        variant: "destructive"
      });
      return;
    }

    const userUrl = formData.urls[0]?.trim();
    const validFilePaths = formData.filePaths;

    if (!userUrl && validFilePaths.length === 0) {
      return;
    }

    setScrapingStatus('processing');
    setScrapingStarted(true);
    
    try {
      // Use the existing company_id from state
      const url = userUrl || "https://example.com/";
      const file_path = validFilePaths.length > 0 ? validFilePaths[0] : "";

      console.log('Starting scraping request with payload:', {
            url: url,
        company_id: companyId,
        file_path: file_path
      });

      const response = await fetch('http://127.0.0.1:8000/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          url: url,
          company_id: companyId,
          file_path: file_path
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`Scraping request failed with status: ${response.status}. Error: ${errorText}`);
      }

      // Check if response is a file download (CSV) or JSON
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      let result;
      if (contentType && contentType.includes('text/csv')) {
        // Handle CSV file response (successful scraping)
        console.log('Received CSV file response - scraping successful');
        result = { success: true, message: 'CSV file received', type: 'file' };
      } else {
        // Handle JSON response (no content case or error)
        try {
          const responseText = await response.text();
          console.log('Raw response text:', responseText);
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Invalid response format from server');
        }
      }
      
      console.log('Scraping result:', result);
      setScrapingStatus('completed');

      // Show appropriate success message
      if (result.type === 'file') {
      toast({
        title: "Scraping Complete!",
          description: `Successfully processed and indexed the knowledge source. Data has been stored.`
        });
      } else if (result.message) {
        toast({
          title: "Scraping Complete!",
          description: result.message
        });
      } else {
        toast({
          title: "Scraping Complete!",
          description: `Successfully processed the knowledge source.`
        });
      }

    } catch (error) {
      const errorObj = error as Error;
      console.error('Scraping error details:', {
        message: errorObj.message,
        stack: errorObj.stack,
        name: errorObj.name
      });
      setScrapingStatus('failed');
      
      // More specific error messages
      let errorMessage = "Failed to process knowledge sources. Please try again.";
      if (errorObj.message.includes('fetch')) {
        errorMessage = "Network error: Could not connect to the server. Please check if the backend is running.";
      } else if (errorObj.message.includes('CORS')) {
        errorMessage = "CORS error: Server configuration issue. Please check backend CORS settings.";
      } else if (errorObj.message.includes('JSON')) {
        errorMessage = "Server response error: Invalid response format.";
      }

      toast({
        title: "Scraping Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Function to send basic info to backend
  const sendBasicInfo = async () => {
    if (!companyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a chatbot.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a chatbot name.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const payload = {
        company_id: companyId,
        chatbot_id: chatbotId,
        chatbot_name: formData.name,
        welcome_message: formData.welcomeMessage,
        input_placeholder: formData.placeholderText
      };

      console.log('Sending basic info with payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/insert/basic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Basic info request failed:', errorText);
        throw new Error(`Failed to save basic info: ${response.status}`);
      }

      const result = await response.json();
      console.log('Basic info saved successfully:', result);
      
      toast({
        title: "Basic Info Saved!",
        description: "Your chatbot's basic information has been saved successfully."
      });

      return true;
    } catch (error) {
      const errorObj = error as Error;
      console.error('Error saving basic info:', errorObj);
      
      toast({
        title: "Save Failed",
        description: "Failed to save basic information. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Function to send appearance info to backend
  const sendAppearanceInfo = async () => {
    if (!companyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a chatbot.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const payload = {
        company_id: companyId,
        chatbot_id: chatbotId,
        color_code: formData.primaryColor
      };

      console.log('Sending appearance info with payload:', payload);

      const response = await fetch('http://127.0.0.1:5015/appearance/appearance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Appearance info request failed:', errorText);
        throw new Error(`Failed to save appearance info: ${response.status}`);
      }

      const result = await response.json();
      console.log('Appearance info saved successfully:', result);
      
      toast({
        title: "Appearance Saved!",
        description: "Your chatbot's appearance has been saved successfully."
      });

      return true;
    } catch (error) {
      const errorObj = error as Error;
      console.error('Error saving appearance info:', errorObj);
      
      toast({
        title: "Save Failed",
        description: "Failed to save appearance information. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Function to handle opening the bot chat screen
  const handleOpenBot = async () => {
    if (!companyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a chatbot.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        company_id: companyId,
        chatbot_id: chatbotId
      };

      console.log('Fetching bot data with payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/extract/get-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bot data fetch failed:', errorText);
        throw new Error(`Failed to fetch bot data: ${response.status}`);
      }

      const result = await response.json();
      console.log('Bot data fetched successfully:', result);
      
      setBotData(result);
      
      // Initialize chat with welcome message
      const welcomeMessage = {
        id: generateUUID(),
        text: result.basic_info.welcome_message,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
      
      // Switch to chat screen
      setShowChatScreen(true);

    } catch (error) {
      const errorObj = error as Error;
      console.error('Error fetching bot data:', errorObj);
      
      toast({
        title: "Failed to Open Bot",
        description: "Could not load your chatbot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation function for step 2
  const validateStep2 = () => {
    const userUrl = formData.urls[0]?.trim();
    const validFilePaths = formData.filePaths;

    if (!userUrl && validFilePaths.length === 0) {
      toast({
        title: "No Sources Found",
        description: "Please add a URL or upload a file before proceeding.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  // Handle Next button click
  const handleNext = async () => {
    // If we're on Step 1 (Basic Info), send basic info to backend
    if (currentStep === 1) {
      const success = await sendBasicInfo();
      if (!success) {
        return; // Don't proceed if saving failed
      }
    }
    
    // If we're on Step 2 (Behavior), validate and start background scraping
    if (currentStep === 2) {
      if (!validateStep2()) {
        return; // Don't proceed if validation failed
      }
      // Start background scraping (non-blocking)
      if (!scrapingStarted) {
        startBackgroundScraping();
      }
    }
    
    // If we're on Step 3 (Appearance), send appearance info to backend
    if (currentStep === 3) {
      const success = await sendAppearanceInfo();
      if (!success) {
        return; // Don't proceed if saving failed
      }
    }
    
    // Proceed to next step immediately
    setCurrentStep(Math.min(steps.length, currentStep + 1));
  };



  const steps = [
    { id: 1, title: "Basic Info", icon: Bot },
    { id: 2, title: "Behavior", icon: Settings },
    { id: 3, title: "Appearance", icon: Palette },
    { id: 4, title: "Preview", icon: Eye },
    { id: 5, title: "Complete", icon: Sparkles }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="group">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Bot className="w-4 h-4 text-primary" />
                Chatbot Name *
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Customer Support Bot"
                  className="h-12 pl-4 pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Choose a descriptive name for your chatbot</p>
            </div>
            
            <div className="group">
              <Label htmlFor="welcomeMessage" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <MessageCircle className="w-4 h-4 text-primary" />
                Welcome Message
              </Label>
              <Textarea
                id="welcomeMessage"
                value={formData.welcomeMessage}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                placeholder="Hello! I'm here to help you. What can I assist you with today?"
                className="min-h-[100px] p-4 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30 resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">The first message users will see when they start chatting</p>
            </div>
            
            <div className="group">
              <Label htmlFor="placeholderText" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Zap className="w-4 h-4 text-primary" />
                Input Placeholder
              </Label>
              <div className="relative">
                <Input
                  id="placeholderText"
                  value={formData.placeholderText}
                  onChange={(e) => handleInputChange('placeholderText', e.target.value)}
                  placeholder="Type your message here..."
                  className="h-12 pl-4 pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Placeholder text shown in the chat input field</p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-8">
            <div className="group">
              <Label htmlFor="tone" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Settings className="w-4 h-4 text-primary" />
                Chatbot Tone
              </Label>
              <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">🙂 Friendly</SelectItem>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="casual">😊 Casual</SelectItem>
                  <SelectItem value="formal">🎩 Formal</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">How your chatbot should communicate with users</p>
            </div>
            
            <div className="group">
              <Label htmlFor="responseLength" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Zap className="w-4 h-4 text-primary" />
                Response Length
              </Label>
              <Select value={formData.responseLength} onValueChange={(value) => handleInputChange('responseLength', value)}>
                <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30">
                  <SelectValue placeholder="Select response length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">📝 Short (1-2 sentences)</SelectItem>
                  <SelectItem value="medium">📄 Medium (1 paragraph)</SelectItem>
                  <SelectItem value="long">📚 Long (Detailed responses)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">How detailed should the chatbot responses be</p>
            </div>
            
            <div className="group">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Globe className="w-4 h-4 text-primary" />
                Knowledge Source (URL)
              </Label>
              <div className="relative">
                      <Input
                  value={formData.urls[0] || ''}
                  onChange={(e) => handleUrlChange(0, e.target.value)}
                        placeholder="https://example.com/documentation"
                        className="h-12 pl-4 pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 hover:border-primary/30"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
              <p className="text-xs text-muted-foreground mt-2">Single URL that your chatbot can learn from to provide better answers</p>
            </div>

            {/* File Upload Section */}
            <div className="group">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Upload className="w-4 h-4 text-primary" />
                Upload Documents
              </Label>
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
                  isDragOver 
                    ? 'border-primary bg-primary/10 scale-105' 
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept=".txt,.pdf,.doc,.docx,.csv,.json,.md"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragOver 
                      ? 'bg-primary/20 scale-110' 
                      : 'bg-primary/10'
                  }`}>
                    <Upload className={`w-8 h-8 transition-all duration-300 ${
                      isDragOver ? 'text-primary scale-110' : 'text-primary'
                    }`} />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">
                      {isDragOver ? 'Drop files here' : 'Drop files or click to upload'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, Word, Text, CSV, JSON, and Markdown files
                    </p>
                  </div>
                  
                  {!isDragOver && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="pointer-events-none"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">Uploaded Files ({uploadedFiles.length})</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 bg-background/80 border border-border/50 rounded-lg hover:bg-background transition-colors duration-200 animate-slideInUp"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Upload documents that contain information your chatbot should know about
              </p>
            </div>

            {/* Scraping Info */}
            {(formData.urls[0]?.trim() || formData.filePaths.length > 0) && (
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 animate-slideInUp">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Ready for Processing</span>
                </div>
                <p className="text-sm text-blue-800">
                  When you click "Next", we'll process {formData.urls[0]?.trim() ? 'the URL' : ''} 
                  {formData.urls[0]?.trim() && formData.filePaths.length > 0 ? ' and ' : ''}
                  {formData.filePaths.length > 0 ? `${formData.filePaths.length} file${formData.filePaths.length !== 1 ? 's' : ''}` : ''} 
                  {' '}to extract knowledge for your chatbot.
                </p>
              </div>
            )}
            
            <div className="group">
              <Label htmlFor="additionalInfo" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                Additional Information
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any specific instructions, context, or guidelines for your chatbot's behavior..."
                className="min-h-[120px] p-4 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30 resize-none"
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-2">Extra context to help your chatbot understand your business or use case</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8">
            <div className="group">
              <Label htmlFor="primaryColor" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Palette className="w-4 h-4 text-primary" />
                Primary Color
              </Label>
              <div className="flex gap-3">
                <div className="relative">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-20 h-12 p-1 border-2 border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: formData.primaryColor }}></div>
                </div>
                <div className="flex-1">
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    placeholder="#3B82F6"
                    className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30 font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">This color will be used for buttons, accents, and branding</p>
            </div>
            
            <div className="group">
              <Label htmlFor="icon" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Bot className="w-4 h-4 text-primary" />
                Bot Icon Style
              </Label>
              <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
                <SelectTrigger className="h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 group-hover:border-primary/30">
                  <SelectValue placeholder="Select icon style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BotIcon1">🤖 Modern Robot</SelectItem>
                  <SelectItem value="BotIcon2">💬 Chat Bubble</SelectItem>
                  <SelectItem value="BotIcon3">⚡ Lightning Bot</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">Choose the visual style for your chatbot's avatar</p>
            </div>

            <div className="group">
              <Label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Eye className="w-4 h-4 text-primary" />
                Color Preview
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('primaryColor', color)}
                    className={`h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      formData.primaryColor === color 
                        ? 'border-gray-400 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <span className="sr-only">Select {color}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Quick color selection or use the color picker above</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Review Your Chatbot</h3>
              <p className="text-muted-foreground text-lg">
                Everything looks great! Review the settings before creating your chatbot.
              </p>
            </div>
            
            <div className="grid gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Basic Information</span>
                </div>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{formData.name || 'Unnamed Chatbot'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tone:</span>
                    <span className="font-medium capitalize">{formData.tone}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Behavior Settings</span>
                </div>
                <div className="space-y-2 text-sm text-purple-800">
                  <div className="flex justify-between">
                    <span>Response Length:</span>
                    <span className="font-medium capitalize">{formData.responseLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Knowledge Source:</span>
                    <span className="font-medium">{formData.urls[0]?.trim() ? '1 URL' : '0 URLs'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded Files:</span>
                    <span className="font-medium">{formData.filePaths.length} Documents</span>
                  </div>
                  {formData.filePaths.length > 0 && (
                    <div className="mt-3 p-2 bg-white/60 rounded border">
                      <p className="text-xs text-purple-600 font-medium mb-1">Files:</p>
                      <div className="space-y-1">
                        {formData.filePaths.slice(0, 3).map((filePath, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-purple-700">
                            <FileText className="w-3 h-3" />
                            <span className="truncate">{filePath}</span>
                          </div>
                        ))}
                        {formData.filePaths.length > 3 && (
                          <div className="text-xs text-purple-600 font-medium">
                            +{formData.filePaths.length - 3} more files
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Appearance</span>
                </div>
                <div className="space-y-2 text-sm text-emerald-800">
                  <div className="flex justify-between items-center">
                    <span>Primary Color:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg" style={{backgroundColor: formData.primaryColor}}></div>
                      <span className="font-medium font-mono">{formData.primaryColor}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Icon Style:</span>
                    <span className="font-medium">{formData.icon}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-900">Messages</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-amber-700 font-medium">Welcome Message:</span>
                    <div className="mt-1 p-2 bg-white rounded border text-amber-800 italic">
                      "{formData.welcomeMessage}"
                    </div>
                  </div>
                  <div>
                    <span className="text-amber-700 font-medium">Input Placeholder:</span>
                    <div className="mt-1 p-2 bg-white rounded border text-amber-800 italic">
                      "{formData.placeholderText}"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600 animate-pulse" />
                <span className="font-semibold text-green-900">Ready to Create!</span>
                <Sparkles className="w-5 h-5 text-green-600 animate-pulse" />
              </div>
              <p className="text-green-700 text-sm">
                Your chatbot configuration is complete. Click "Create Chatbot" to bring it to life!
              </p>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              {scrapingStatus === 'processing' ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Processing Your Content</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    The scraping and indexing of the website is in process. Please wait...
                  </p>
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </>
              ) : scrapingStatus === 'completed' ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Your Bot is Ready!</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    Your chatbot has been successfully created and trained with your content.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleOpenBot}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Bot className="w-4 h-4 mr-2" />
                      )}
                      Open Your Bot
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGenerateIframe}
                      disabled={isLoading}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Generate iFrame
                    </Button>
                  </div>
                </>
              ) : scrapingStatus === 'failed' ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                    <X className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Processing Failed</h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    There was an error processing your content. Please try again.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => {
                        setScrapingStatus('idle');
                        setScrapingStarted(false);
                        setCurrentStep(2);
                      }}
                      variant="outline"
                      className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Go Back
                    </Button>
                    <Button
                      onClick={() => {
                        setScrapingStatus('idle');
                        setScrapingStarted(false);
                        startBackgroundScraping();
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Try Again
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Almost Ready!</h3>
                  <p className="text-muted-foreground text-lg">
                    Your chatbot is being prepared...
                  </p>
                </>
              )}
            </div>

            {scrapingStatus === 'completed' && (
              <div className="grid gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Chatbot Details</span>
                  </div>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium text-green-600">✅ Ready</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Knowledge Source:</span>
                      <span className="font-medium">✅ Processed</span>
                    </div>
                  </div>
                </div>

                {/* Embed Code Section */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Website Integration</span>
                  </div>
                  <p className="text-sm text-blue-800 mb-4">
                    Choose your preferred integration method. Both will add a floating chatbot widget to the bottom-right corner of your website.
                  </p>
                  
                  {/* Default iFrame Code (before generation) */}
                  {!generatedIframe && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">Embed Code</h4>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Click Generate</span>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-sm font-mono text-gray-400">
                        <div>{'<!-- Click "Generate iFrame" to create working embed code -->'}</div>
                        <div className="text-blue-400">{`<div id="genbot-chatbot-container"></div>`}</div>
                        <div className="text-yellow-400">{'<script>'}</div>
                        <div className="ml-2">{'// Chatbot integration script will appear here'}</div>
                        <div className="ml-2">{'// after clicking "Generate iFrame"'}</div>
                        <div className="text-yellow-400">{'</script>'}</div>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Click "Generate iFrame" below to create working embed code with your bot's configuration.
                      </p>
                    </div>
                  )}

                  {/* Generated iFrame Code (after generation) */}
                  {generatedIframe && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">✅ Working Embed Code</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Ready to Use</span>
                      </div>
                      <div className="relative">
                        <div className="bg-gray-900 rounded-lg p-3 text-sm font-mono text-green-400 max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap">{generatedIframe}</pre>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedIframe);
                            toast({
                              title: "Working Code Copied!",
                              description: "The embed code has been copied to your clipboard."
                            });
                          }}
                          className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-green-700 mt-2">
                        ✅ This code will create a working chatbot widget when pasted into your HTML.
                      </p>
                    </div>
                  )}

                  {/* Generate Button */}
                  <div className="mb-4">
                    <Button
                      onClick={handleGenerateIframe}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Globe className="w-4 h-4 mr-2" />
                      )}
                      {generatedIframe ? 'Regenerate iFrame' : 'Generate iFrame'}
                    </Button>
                  </div>
                  
                  {/* Widget Preview */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="text-xs font-medium text-blue-900 mb-2">Widget Preview:</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-xs text-blue-800">
                        <div className="font-medium">{formData.name || 'AI Assistant'}</div>
                        <div className="opacity-75">Floating widget • Bottom-right corner</div>
                      </div>
                    </div>
                  </div>
                  

                  
                  {/* Instructions */}
                  <div className="mt-4 text-xs text-blue-700">
                    <div className="font-medium mb-1">How to Use:</div>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Click "Generate iFrame" to create working embed code</li>
                      <li>Copy the generated code using the "Copy" button</li>
                      <li>Paste it before the closing {'</body>'} tag in your HTML file</li>
                      <li>The chatbot widget will appear on your website and work immediately</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderPreview = () => {
    return (
      <div className="h-full flex flex-col animate-fadeIn">
        {/* Chat Header */}
        <div className="p-4 border-b shadow-sm" style={{backgroundColor: `${formData.primaryColor}15`}}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105" 
                style={{backgroundColor: formData.primaryColor}}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground">{formData.name || 'Your Chatbot'}</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-muted-foreground">Online • Typically replies instantly</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white overflow-y-auto">
          {/* Bot Welcome Message */}
          <div className="flex gap-3 animate-slideInLeft">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" 
              style={{backgroundColor: formData.primaryColor}}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 max-w-xs">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-3 text-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                {formData.welcomeMessage || 'Hello! How can I help you today?'}
              </div>
              <div className="text-xs text-muted-foreground mt-1 ml-1">Just now</div>
            </div>
          </div>
          
          {/* User Message */}
          <div className="flex justify-end animate-slideInRight" style={{ animationDelay: '0.5s' }}>
            <div className="max-w-xs">
              <div 
                className="text-white rounded-2xl rounded-tr-md p-3 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                style={{backgroundColor: formData.primaryColor}}
              >
                This is a sample user message to show how the chat will look with your chosen color scheme.
              </div>
              <div className="text-xs text-muted-foreground mt-1 mr-1 text-right">Just now</div>
            </div>
          </div>
          
          {/* Bot Response */}
          <div className="flex gap-3 animate-slideInLeft" style={{ animationDelay: '1s' }}>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" 
              style={{backgroundColor: formData.primaryColor}}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 max-w-xs">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-3 text-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                Perfect! I'm configured with a <strong>{formData.tone}</strong> tone and will provide <strong>{formData.responseLength}</strong> responses. I'm ready to help your customers! 🚀
              </div>
              <div className="text-xs text-muted-foreground mt-1 ml-1">Just now</div>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex gap-3 animate-slideInLeft" style={{ animationDelay: '1.5s' }}>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" 
              style={{backgroundColor: formData.primaryColor}}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-3 shadow-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State Example */}
          <div className="flex gap-3 animate-slideInLeft" style={{ animationDelay: '2s' }}>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" 
              style={{backgroundColor: formData.primaryColor}}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t bg-white shadow-lg">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder={formData.placeholderText || 'Type your message...'}
                className="pr-12 h-12 bg-gray-50 border-gray-200 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                disabled
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button className="p-1 hover:bg-gray-200 rounded transition-colors duration-200">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <Button 
              size="sm" 
              className="h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105" 
              style={{backgroundColor: formData.primaryColor}}
            >
              <span className="mr-2">Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </div>
          <div className="flex items-center justify-center mt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              Powered by GenBotAI
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to send a message in chat
  const sendChatMessage = async (message: string) => {
    if (!message.trim() || !botData || isSendingMessage || !companyId) return;

    setIsSendingMessage(true);

    // Add user message
    const userMessage = {
      id: generateUUID(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Add a temporary loading message that will be replaced
    const loadingMessageId = generateUUID();
    const loadingMessage = {
      id: loadingMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      const payload = {
        prompt: message,
        thread_id: threadId,
        company_id: companyId,
        chatbot_id: chatbotId,
        uuid: ""
      };

      console.log('Sending chat message with payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/text_agent/Agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API request failed:', errorText);
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Chat API response:', result);

      // Parse the content JSON
      let parsedContent;
      try {
        parsedContent = JSON.parse(result.content);
      } catch (parseError) {
        console.error('Failed to parse content JSON:', parseError);
        throw new Error('Invalid response format from chat API');
      }

      // Extract response and follow-up questions
      const botResponseText = parsedContent.Response || "I apologize, but I couldn't generate a proper response.";
      const followUpQuestions = [
        parsedContent["Follow-up Question1"],
        parsedContent["Follow-up Question2"],
        parsedContent["Follow-up Question3"]
      ].filter(q => q && q.trim()); // Filter out empty questions

      // Remove the loading message and add the actual response
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));

      // Add bot response with follow-up questions
      const botResponse = {
        id: generateUUID(),
        text: botResponseText,
        isUser: false,
        timestamp: new Date(),
        followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined
      };

      setChatMessages(prev => [...prev, botResponse]);

    } catch (error) {
      const errorObj = error as Error;
      console.error('Error sending chat message:', errorObj);
      
      // Remove the loading message
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      // Add error message
      const errorResponse = {
        id: generateUUID(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Message Failed",
        description: "Could not send your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Function to generate iframe by fetching bot data from API
  const handleGenerateIframe = async () => {
    if (!companyId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a chatbot.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        company_id: companyId,
        chatbot_id: chatbotId
      };

      console.log('Fetching bot data for iframe with payload:', payload);

      const response = await fetch('http://127.0.0.1:8000/extract/get-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Bot data fetch failed:', errorText);
        throw new Error(`Failed to fetch bot data: ${response.status}`);
      }

      const result = await response.json();
      console.log('Bot data fetched successfully:', result);
      
      // Generate iframe code with fetched data
      const iframeCode = generateIframeWithData(result);
      setGeneratedIframe(iframeCode);
      
      // Copy to clipboard
      navigator.clipboard.writeText(iframeCode);
      
      toast({
        title: "iFrame Generated & Copied!",
        description: "The iframe code has been generated and copied to your clipboard."
      });

    } catch (error) {
      const errorObj = error as Error;
      console.error('Error generating iframe:', errorObj);
      
      toast({
        title: "Failed to Generate iFrame",
        description: "Could not generate iframe code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate iframe code with actual bot data from API
  const generateIframeWithData = (botData: any) => {
    return `<!-- GenBotAI Chatbot iFrame -->
<div id="genbot-chatbot-${botData.basic_info.chatbot_id}"></div>
<script>
  (function() {
    // Bot Configuration from API
    const config = {
      companyId: '${botData.basic_info.company_id}',
      chatbotId: '${botData.basic_info.chatbot_id}',
      apiUrl: 'http://127.0.0.1:8000',
      botName: '${botData.basic_info.chatbot_name}',
      welcomeMessage: '${botData.basic_info.welcome_message}',
      placeholder: '${botData.basic_info.input_placeholder}',
      primaryColor: '${botData.appearance.color_code}'
    };

    // Create chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'genbot-widget-container';
    chatbotContainer.style.cssText = \`
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    \`;
    
    // Create toggle button
    const toggleButton = document.createElement('div');
    toggleButton.style.cssText = \`
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, \${config.primaryColor}, \${config.primaryColor}dd);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    \`;
    
    // Add bot icon
    toggleButton.innerHTML = \`
      <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21ZM14 13V11H16V13H18V15H16V17H14V15H12V13H14Z"/>
      </svg>
    \`;
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.style.cssText = \`
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    \`;
    
    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = \`
      background: linear-gradient(135deg, \${config.primaryColor}, \${config.primaryColor}dd);
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    \`;
    chatHeader.innerHTML = \`
      <div style="width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21ZM14 13V11H16V13H18V15H16V17H14V15H12V13H14Z"/>
        </svg>
      </div>
      <div>
        <div style="font-size: 16px;">\${config.botName}</div>
        <div style="font-size: 12px; opacity: 0.9;">Online • Typically replies instantly</div>
      </div>
    \`;
    
    // Chat messages area
    const chatMessages = document.createElement('div');
    chatMessages.style.cssText = \`
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f9fafb;
    \`;
    
    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = \`
      background: white;
      padding: 12px 16px;
      border-radius: 18px 18px 18px 4px;
      margin-bottom: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-size: 14px;
      line-height: 1.4;
    \`;
    welcomeMsg.textContent = config.welcomeMessage;
    chatMessages.appendChild(welcomeMsg);
    
    // Chat input area
    const chatInput = document.createElement('div');
    chatInput.style.cssText = \`
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      background: white;
    \`;
    
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = \`
      display: flex;
      gap: 8px;
      align-items: center;
    \`;
    
    const messageInput = document.createElement('input');
    messageInput.type = 'text';
    messageInput.placeholder = config.placeholder;
    messageInput.style.cssText = \`
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      outline: none;
      font-size: 14px;
    \`;
    
    const sendButton = document.createElement('button');
    sendButton.style.cssText = \`
      width: 36px;
      height: 36px;
      background: \${config.primaryColor};
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    \`;
    sendButton.innerHTML = \`
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    \`;
    
    // Generate unique thread ID for this session
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    const threadId = generateUUID();
    
    // Handle message sending with real API integration
    async function sendMessage() {
      const message = messageInput.value.trim();
      if (!message) return;
      
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.cssText = \`
        text-align: right;
        margin-bottom: 12px;
      \`;
      userMsg.innerHTML = \`
        <div style="display: inline-block; background: \${config.primaryColor}; color: white; padding: 12px 16px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 14px; line-height: 1.4;">
          \${message}
        </div>
      \`;
      chatMessages.appendChild(userMsg);
      
      // Clear input and scroll
      messageInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      try {
        // Call your chat API
        const response = await fetch(\`\${config.apiUrl}/text_agent/Agents\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            thread_id: threadId,
            company_id: config.companyId,
            chatbot_id: config.chatbotId,
            uuid: ""
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          const parsedContent = JSON.parse(result.content);
          const botResponseText = parsedContent.Response || "I apologize, but I couldn't generate a proper response.";
          
          // Add bot response
          const botMsg = document.createElement('div');
          botMsg.style.cssText = \`margin-bottom: 12px;\`;
          botMsg.innerHTML = \`
            <div style="background: white; padding: 12px 16px; border-radius: 18px 18px 18px 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-size: 14px; line-height: 1.4; max-width: 80%;">
              \${botResponseText}
            </div>
          \`;
          chatMessages.appendChild(botMsg);
          
          // Add follow-up questions if available
          const followUpQuestions = [
            parsedContent["Follow-up Question1"],
            parsedContent["Follow-up Question2"],
            parsedContent["Follow-up Question3"]
          ].filter(q => q && q.trim());
          
          if (followUpQuestions.length > 0) {
            const followUpContainer = document.createElement('div');
            followUpContainer.style.cssText = \`margin-bottom: 12px; margin-left: 0;\`;
            
            const followUpLabel = document.createElement('p');
            followUpLabel.style.cssText = \`font-size: 12px; color: #6b7280; font-weight: 500; margin-bottom: 8px;\`;
            followUpLabel.textContent = 'You might also ask:';
            followUpContainer.appendChild(followUpLabel);
            
            followUpQuestions.forEach(question => {
              const questionBtn = document.createElement('button');
              questionBtn.style.cssText = \`
                display: block; width: 100%; text-align: left; padding: 8px 12px; 
                background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; 
                font-size: 12px; color: #374151; margin-bottom: 6px; cursor: pointer;
                transition: all 0.2s ease;
              \`;
              questionBtn.textContent = question;
              questionBtn.onmouseover = () => questionBtn.style.background = '#f3f4f6';
              questionBtn.onmouseout = () => questionBtn.style.background = '#f9fafb';
              questionBtn.onclick = () => {
                messageInput.value = question;
                sendMessage();
              };
              followUpContainer.appendChild(questionBtn);
            });
            
            chatMessages.appendChild(followUpContainer);
          }
          
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = \`margin-bottom: 12px;\`;
        errorMsg.innerHTML = \`
          <div style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 12px 16px; border-radius: 18px 18px 18px 4px; font-size: 14px; line-height: 1.4; max-width: 80%;">
            Sorry, I'm having trouble processing your request. Please try again.
          </div>
        \`;
        chatMessages.appendChild(errorMsg);
      }
      
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Assemble chat window
    inputContainer.appendChild(messageInput);
    inputContainer.appendChild(sendButton);
    chatInput.appendChild(inputContainer);
    
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(chatMessages);
    chatWindow.appendChild(chatInput);
    
    // Assemble container
    chatbotContainer.appendChild(toggleButton);
    chatbotContainer.appendChild(chatWindow);
    
    // Add event listeners
    let isOpen = false;
    toggleButton.addEventListener('click', function() {
      isOpen = !isOpen;
      if (isOpen) {
        chatWindow.style.display = 'flex';
        toggleButton.style.transform = 'scale(0.9)';
      } else {
        chatWindow.style.display = 'none';
        toggleButton.style.transform = 'scale(1)';
      }
    });
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Add to page
    document.body.appendChild(chatbotContainer);
    
    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = \`
      @media (max-width: 768px) {
        #genbot-widget-container div[style*="width: 350px"] {
          width: calc(100vw - 40px) !important;
          right: 20px !important;
          left: 20px !important;
        }
      }
    \`;
    document.head.appendChild(style);
  })();
</script>`;
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        sendVoiceMessage(audioBlob);
      };
      
      setAudioChunks([]);
      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const sendVoiceMessage = async (audioBlob: Blob) => {
    if (!botData || isProcessingVoice || !companyId) return;

    setIsProcessingVoice(true);

    // Add a temporary loading message for voice processing
    const loadingMessageId = generateUUID();
    const loadingMessage = {
      id: loadingMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('company_id', companyId);
      formData.append('thread_id', threadId);
      formData.append('chatbot_id', chatbotId);
      formData.append('uuid', '');

      console.log('Sending voice message with form data');

      const response = await fetch('http://127.0.0.1:8000/speech_agent/speech-to-speech', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Voice API request failed:', errorText);
        throw new Error(`Voice API failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Voice API response:', result);

      // Remove the loading message
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));

      // Add user message (transcribed text)
      const userMessage = {
        id: generateUUID(),
        text: result.prompt_text,
        isUser: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, userMessage]);

      // Extract follow-up questions from voice response
      let followUpQuestions: string[] = [];
      try {
        // Try to parse response_text as JSON first
        const parsedResponse = JSON.parse(result.response_text);
        followUpQuestions = [
          parsedResponse["Follow-up Question1"],
          parsedResponse["Follow-up Question2"],
          parsedResponse["Follow-up Question3"]
        ].filter(q => q && typeof q === 'string' && q.trim().length > 0);
      } catch (e) {
        // If response_text is not JSON, check if result has follow-up questions directly
        followUpQuestions = [
          result["Follow-up Question1"],
          result["Follow-up Question2"],
          result["Follow-up Question3"]
        ].filter(q => q && typeof q === 'string' && q.trim().length > 0);
      }

      // Add bot response with follow-up questions
      const botResponse = {
        id: generateUUID(),
        text: result.response_text,
        isUser: false,
        timestamp: new Date(),
        followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined
      };
      setChatMessages(prev => [...prev, botResponse]);

      // Play the audio response
      if (result.audio_base64) {
        const audioData = `data:audio/wav;base64,${result.audio_base64}`;
        const audio = new Audio(audioData);
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }

    } catch (error) {
      const errorObj = error as Error;
      console.error('Error processing voice message:', errorObj);
      
      // Remove the loading message
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      
      toast({
        title: "Voice Processing Failed",
        description: "Could not process your voice message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // If showing voice screen, render the voice interface
  if (showVoiceScreen && botData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        {/* Voice Header */}
        <div className="border-b bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceScreen(false)}
                  className="hover:bg-gray-100 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Chat
                </Button>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: botData.appearance.color_code }}
                  >
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Voice Chat with {botData.basic_info.chatbot_name}</h1>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Voice mode • Tap to speak</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Interface */}
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <div className="text-center space-y-8">
            {/* Voice Animation */}
            <div className="relative">
              <div 
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isRecording ? 'scale-110 animate-pulse' : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: isRecording ? '#ef4444' : botData.appearance.color_code,
                  boxShadow: isRecording ? '0 0 0 0 rgba(239, 68, 68, 0.7)' : undefined
                }}
              >
                {isProcessingVoice ? (
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isRecording ? (
                  <MicOff className="w-12 h-12 text-white" />
                ) : (
                  <Mic className="w-12 h-12 text-white" />
                )}
              </div>
              
              {/* Recording Animation Rings */}
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
            </div>

            {/* Status Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {isProcessingVoice ? 'Processing...' : isRecording ? 'Listening...' : 'Tap to speak'}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {isProcessingVoice 
                  ? 'Converting your speech and generating response...'
                  : isRecording 
                    ? 'Speak now, tap again when finished'
                    : 'Have a voice conversation with your AI assistant'
                }
              </p>
            </div>

            {/* Record Button */}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessingVoice}
              className={`w-20 h-20 rounded-full text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
              style={{ 
                backgroundColor: isRecording ? undefined : botData.appearance.color_code 
              }}
            >
              {isProcessingVoice ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isRecording ? (
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>

            {/* Instructions */}
            <div className="max-w-md mx-auto text-sm text-gray-500 space-y-1">
              <p>• Tap the microphone to start recording</p>
              <p>• Speak your question or message</p>
              <p>• Tap again to stop and send</p>
              <p>• The AI will respond with voice and text</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If showing chat screen, render the chat interface
  if (showChatScreen && botData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Chat Header */}
        <div className="border-b bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatScreen(false)}
                  className="hover:bg-gray-100 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Setup
                </Button>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: botData.appearance.color_code }}
                  >
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{botData.basic_info.chatbot_name}</h1>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Online • Ready to chat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white" style={{ height: 'calc(100% - 80px)' }}>
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!message.isUser && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-md flex-shrink-0"
                        style={{ backgroundColor: botData.appearance.color_code }}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.isUser ? 'order-1' : 'order-2'}`}>
                      {message.isLoading ? (
                        // Loading state with animated typing indicator
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md p-4 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.isUser 
                              ? 'text-white rounded-tr-md' 
                              : 'bg-white border border-gray-200 rounded-tl-md'
                          }`}
                          style={{ 
                            backgroundColor: message.isUser ? botData.appearance.color_code : undefined 
                          }}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                      )}
                      
                      {/* Follow-up Questions */}
                      {!message.isUser && !message.isLoading && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-600 font-medium">You might also ask:</p>
                          {message.followUpQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => sendChatMessage(question)}
                              disabled={isSendingMessage}
                              className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="text-gray-700">{question}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={isSendingMessage ? "AI is thinking..." : botData.basic_info.input_placeholder}
                  disabled={isSendingMessage}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isSendingMessage) {
                      const target = e.target as HTMLInputElement;
                      sendChatMessage(target.value);
                      target.value = '';
                    }
                  }}
                />
                <Button
                  onClick={() => setShowVoiceScreen(true)}
                  disabled={isSendingMessage}
                  variant="outline"
                  className="px-4 py-3 rounded-full border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mic className="w-4 h-4 text-gray-600" />
                </Button>
                <Button
                  onClick={(e) => {
                    if (!isSendingMessage) {
                      const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement;
                      sendChatMessage(input.value);
                      input.value = '';
                    }
                  }}
                  disabled={isSendingMessage}
                  className="px-6 py-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: botData.appearance.color_code }}
                >
                  {isSendingMessage ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </Button>
              </div>
              
              {/* Loading indicator below input */}
              {isSendingMessage && (
                <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>AI is processing your message...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-500"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b bg-card/80 backdrop-blur-lg shadow-xl border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="hover:bg-primary/10 transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Create Chatbot
                    </h1>
                  </div>
                  <p className="text-muted-foreground text-lg">Set up your AI chatbot in a few simple steps</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Step {currentStep} of {steps.length}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="border-b bg-card/60 backdrop-blur-sm border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-6 overflow-x-auto">
              <div className="flex items-center gap-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex items-center gap-3 group">
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          currentStep >= step.id
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                        {currentStep >= step.id && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-ping opacity-75"></div>
                        )}
                      </div>
                      <div className="hidden sm:block">
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {currentStep > step.id ? 'Completed' : currentStep === step.id ? 'Current' : 'Pending'}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 rounded-full mx-4 transition-all duration-500 ${
                        currentStep > step.id 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                          : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`grid gap-8 ${currentStep === 5 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Form Section */}
            <div className="animate-slideInLeft">
              <Card className="bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-border/30">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {React.createElement(steps[currentStep - 1]?.icon, { className: "w-4 h-4 text-white" })}
                    </div>
                    Step {currentStep}: {steps[currentStep - 1]?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="animate-fadeIn">
                    {renderStepContent()}
                  </div>
                  
                  <div className="flex justify-between mt-10">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1 || currentStep === 5}
                      className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                          <div className="flex items-center space-x-2">
                            <span>Next</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                      </Button>
                    ) : currentStep === 4 ? (
                      <Button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4" />
                            <span>Create Chatbot</span>
                          </div>
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section - Hide on step 5 */}
            {currentStep !== 5 && (
            <div className="animate-slideInRight">
              <Card className="h-[700px] bg-card/80 backdrop-blur-lg border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-300 sticky top-8">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-border/30">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    Live Preview
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                  <div className="h-full border rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-white animate-fadeIn">
                    {renderPreview()}
                  </div>
                </CardContent>
              </Card>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}