'use client';

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Mic,
  Send,
  MessageSquare,
  Play,
  Pause,
  StopCircle,
  User,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useSessionTracking } from "@/hooks/useSessionTracking";

// INTERFACES
interface Message {
  id: string;
  content: string | string[];
  role: "user" | "assistant";
  timestamp: Date;
  followUpQuestions?: string[];
  isDetailedResponse?: boolean;
}

interface ChatbotConfig {
  sources: { urls: string[]; documents: string[]; additionalInfo: string };
  settings: {
    tone: string;
    timeout: number;
    voiceGender: string;
    speechEnabled: boolean;
    responseLength: string;
    updateFrequency: string;
  };
  appearance: {
    icon: string;
    avatar: string;
    fontSize: number;
    position: string;
    headerText: string;
    showAvatar: boolean;
    widgetWidth: number;
    borderRadius: number;
    primaryColor: string;
    widgetHeight: number;
    showTimestamp: boolean;
    welcomeMessage: string;
    placeholderText: string;
  };
}

interface ChatbotData {
  id: string;
  name: string;
  status: string;
  config: ChatbotConfig;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

const renderWithLinks = (text: string) => {
  const processedText = text.replace(/\\n/g, "\n");
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const html = processedText.replace(
    linkRegex,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$2</a>'
  );
  return { __html: html };
};

// Utility to get icon src from icon value
const getIconSrc = (icon: string) => {
  if (icon?.startsWith('uploaded:')) {
    return `/uploaded-icons/${icon.replace('uploaded:', '')}`;
  }
  return `/icons/${icon || 'BotIcon1'}.png`;
};

// CORE CHATBOT COMPONENT
const ChatbotCore = ({
  chatbotData,
  isIframe,
}: {
  chatbotData: ChatbotData;
  isIframe: boolean;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [threadId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const volumeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RETRIES = 2;
  const { trackInteraction } = useSessionTracking({
    chatbotId: chatbotData.id,
    companyId: chatbotData.companyId,
    threadId,
  });
  const [voiceBotResponse, setVoiceBotResponse] = useState<string | null>(null);
  const [voiceBotThinking, setVoiceBotThinking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [canShowDetailedButton, setCanShowDetailedButton] = useState(false);

  useEffect(() => {
    if (chatbotData.config.appearance.welcomeMessage) {
      setMessages([
        {
          id: uuidv4(),
          content: chatbotData.config.appearance.welcomeMessage,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatbotData.config.appearance.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (
    messageContent: string,
    isDetailed: boolean = false
  ) => {
    if (!messageContent.trim()) return;

    setCanShowDetailedButton(false);

    trackInteraction("chat_message_sent");
    const userMessage: Message = {
      id: uuidv4(),
      content: messageContent,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    if (messageContent === inputMessage) setInputMessage("");
    setIsSending(true);
    try {
      const response = await fetch(
        "https://bot.aipromptora.com/AgentAPI/Agents",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: messageContent,
            thread_id: threadId,
            company_id: chatbotData.id,
            chatbot_id: chatbotData.id,
            uuid: uuidv4(),
            is_detailed_request: isDetailed,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to get response from chatbot");

      const data = await response.json();
      const followUpQuestions: string[] = [];
      let finalContent: string | string[] =
        "Sorry, I could not process your request.";

      try {
        const parsedOuter = JSON.parse(data.content);
        if (typeof parsedOuter === "object" && parsedOuter !== null) {
          Object.keys(parsedOuter).forEach((key) => {
            if (key.startsWith("Follow-up Question") && parsedOuter[key]) {
              followUpQuestions.push(parsedOuter[key]);
            }
          });
        }
        let rawResponse = parsedOuter.Response || data.content;
        try {
          const parsedInner = JSON.parse(rawResponse);
          finalContent = Array.isArray(parsedInner) ? parsedInner : rawResponse;
        } catch (e) {
          finalContent = rawResponse;
        }
      } catch (err) {
        finalContent = data.content;
      }
      
      if (typeof finalContent === "string") {
        finalContent = finalContent.replace(/\\n/g, "\n");
      } else if (Array.isArray(finalContent)) {
        finalContent = finalContent.map((item) =>
          typeof item === "string" ? item.replace(/\\n/g, "\n") : item
        );
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        content: finalContent,
        role: "assistant",
        timestamp: new Date(),
        followUpQuestions:
          followUpQuestions.length > 0 ? followUpQuestions : undefined,
        isDetailedResponse: isDetailed,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (!isDetailed) {
        setCanShowDetailedButton(true);
      }

    } catch (err) {
      console.error("Error sending message:", err);
      trackInteraction("chat_error");
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          content:
            "Sorry, there was an error processing your message. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleDetailedResponseClick = () => {
    handleSendMessage("can you please provide the detail response", true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage, false);
    }
  };

  const { appearance, settings } = chatbotData.config;
  const lastAssistantMessageIndex = messages
    .map((m) => m.role)
    .lastIndexOf("assistant");

  const renderModeToggle = () => (
    <div
      className="flex items-center rounded-full overflow-hidden border border-primary/40 bg-white"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }}
    >
      <label className="flex-1 cursor-pointer">
        <input
          type="radio"
          name="chat-mode"
          checked={mode === "text"}
          onChange={() => setMode("text")}
          disabled={!settings.speechEnabled && mode !== "text"}
          className="hidden peer"
        />
        <span
          className={`flex items-center justify-center w-12 h-12 transition-colors duration-150 ${
            mode === "text"
              ? "bg-white text-[#212c45]"
              : "bg-[#212c45] text-white"
          }`}
          style={{ fontSize: 22 }}
        >
          <MessageSquare size={22} />
        </span>
      </label>
      <label className="flex-1 cursor-pointer">
        <input
          type="radio"
          name="chat-mode"
          checked={mode === "voice"}
          onChange={() => settings.speechEnabled && setMode("voice")}
          disabled={!settings.speechEnabled}
          className="hidden peer"
        />
        <span
          className={`flex items-center justify-center w-12 h-12 transition-colors duration-150 ${
            mode === "voice"
              ? "bg-white text-[#212c45]"
              : "bg-[#212c45] text-white"
          }`}
          style={{ fontSize: 22 }}
        >
          <Mic size={22} />
        </span>
      </label>
    </div>
  );

  const renderHeader = () => (
     <div
      className="h-16 flex items-center px-6 flex-shrink-0 border-b justify-between"
      style={{
        backgroundColor: appearance.primaryColor,
        borderBottomColor: isIframe ? "rgba(255,255,255,0.1)" : undefined,
      }}
    >
      <div className="flex items-center gap-4">
        <img
          src={getIconSrc(appearance.icon)}
          alt="Bot Icon"
          className="w-10 h-10 rounded-full bg-white p-1"
        />
        <div className="text-white font-medium text-lg">
          {appearance.headerText}
        </div>
      </div>
      <div>{renderModeToggle()}</div>
    </div>
  );

  const renderTextUI = () => (
    <div className="flex flex-col h-full w-full">
      {renderHeader()}
      <div className="flex-1 min-h-0 flex flex-col">
        <div
          className={`flex-1 p-4 sm:p-6 flex flex-col space-y-4 overflow-y-auto min-h-0 ${
            isIframe ? "bg-transparent" : "bg-muted/20"
          }`}
          style={{ fontSize: `${appearance.fontSize}px` }}
        >
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            const isLastAssistantMessage = index === lastAssistantMessageIndex;
            const showDetailedButtonOnThisMessage =
              isLastAssistantMessage && !isSending && canShowDetailedButton;

            return (
              <div
                key={message.id}
                className={`flex items-end gap-3 animate-fadeIn ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <img
                    src={
                      appearance.showAvatar
                        ? `/icons/${appearance.avatar}.png`
                        : getIconSrc(appearance.icon)
                    }
                    alt="Assistant Avatar"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}

                <div className={`flex flex-col max-w-[85%]`}>
                  <div
                    className={`relative p-3 md:p-4 shadow-md ${
                      isUser
                        ? "bg-primary text-white rounded-t-2xl rounded-bl-2xl"
                        : "bg-white text-gray-900 rounded-t-2xl rounded-br-2xl"
                    }`}
                    style={{
                      backgroundColor: isUser
                        ? appearance.primaryColor
                        : undefined,
                    }}
                  >
                    <div className={showDetailedButtonOnThisMessage ? "pb-10" : ""}>
                      {Array.isArray(message.content)
                        ? message.content.map((line, idx) => (
                            <p
                              key={idx}
                              className="mb-1 last:mb-0"
                              dangerouslySetInnerHTML={renderWithLinks(line)}
                            />
                          ))
                        : String(message.content)
                            .split("\n")
                            .map((line, idx) => (
                              <p
                                key={idx}
                                className="mb-1 last:mb-0"
                                dangerouslySetInnerHTML={renderWithLinks(line)}
                              />
                            ))}
                    </div>

                    {showDetailedButtonOnThisMessage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDetailedResponseClick}
                        className="absolute bottom-2 right-2 h-auto py-1 px-2.5 text-xs bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer text-primary border border-gray-200 hover:border-primary/70 hover:shadow-md hover:-translate-y-px active:scale-[0.98] active:shadow-sm transition-all"
                      >
                        <Sparkles className="w-3 h-3 mr-1.5 flex-shrink-0" />
                        See Detailed Response
                      </Button>
                    )}
                  </div>

                  {appearance.showTimestamp && (
                    <div
                      className={`mt-1 text-xs text-muted-foreground ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
          
          {messages[lastAssistantMessageIndex]?.followUpQuestions &&
            !isSending && (
              <div className="flex flex-col items-start gap-2 mt-2 animate-fadeIn pl-11">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Suggested questions:
                </p>
                {messages[lastAssistantMessageIndex].followUpQuestions?.map(
                  (question, qIndex) => (
                    <Button
                      key={qIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(question)}
                      disabled={isSending}
                      className="h-auto py-1.5 px-3 text-left bg-white shadow-sm cursor-pointer text-primary border border-gray-200 hover:border-primary/70 hover:shadow-md hover:-translate-y-px active:scale-[0.98] active:shadow-sm transition-all whitespace-normal break-words max-w-xs"
                    >
                      <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0" />
                      {question}
                    </Button>
                  )
                )}
              </div>
            )}

          {isSending && (
            <div className="flex items-end gap-3 animate-fadeIn">
              <img
                src={getIconSrc(appearance.icon)}
                alt="Bot Icon"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-white text-gray-900 p-4 rounded-t-2xl rounded-br-2xl shadow-md">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          className={`p-6 flex-shrink-0 ${
            isIframe
              ? "bg-transparent border-t border-white/10"
              : "border-t bg-background"
          }`}
        >
          <div className="relative max-w-4xl mx-auto">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              className={`w-full rounded-full pl-6 pr-12 py-3 focus:ring-1 focus:ring-primary/30 focus:outline-none transition-all text-base ${
                isIframe
                  ? "bg-white/10 text-white placeholder:text-white/60 border-white/20 focus:border-white/50"
                  : "bg-background border-border focus:border-primary"
              }`}
              placeholder={appearance.placeholderText}
            />
            <Button
              size="icon"
              disabled={isSending || !inputMessage.trim()}
              onClick={() => handleSendMessage(inputMessage, false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 hover:scale-110 transition-all duration-200"
              style={{ backgroundColor: appearance.primaryColor }}
            >
              <Send size={20} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0">
        {renderTextUI()}
      </div>
    </div>
  );
};

// PARENT/CONTAINER COMPONENT
const ChatbotPage = () => {
  const params = useParams();
  const chatbotId = params?.chatbotId;
  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isIframe, setIsIframe] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const isInsideIframe = window.self !== window.top;
    setIsIframe(isInsideIframe);

    if (isInsideIframe) {
      document.documentElement.style.background = "transparent";
      document.body.style.background = "transparent";
    }

    const handler = (event: MessageEvent) => {
      if (event.data === "aip-chat-minimized") setIsMinimized(true);
      if (event.data === "aip-chat-open") setIsMinimized(false);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [isIframe]);

  useEffect(() => {
    let styleTag;
    if (isMinimized) {
      document.body.classList.add("aip-chat-minimized");
      styleTag = document.createElement("style");
      styleTag.id = "aip-chat-minimized-style";
      styleTag.innerHTML = `
        .aip-chat-minimized * {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          color: inherit !important;
        }
        .aip-chat-minimized {
          background: transparent !important;
        }
      `;
      document.head.appendChild(styleTag);
    } else {
      document.body.classList.remove("aip-chat-minimized");
      const existing = document.getElementById("aip-chat-minimized-style");
      if (existing) document.head.removeChild(existing);
    }
    return () => {
      document.body.classList.remove("aip-chat-minimized");
      const existing = document.getElementById("aip-chat-minimized-style");
      if (existing) document.head.removeChild(existing);
    };
  }, [isMinimized]);

  useEffect(() => {
    const fetchChatbotConfig = async () => {
      if (!chatbotId) {
        setError("No chatbot ID provided.");
        setLoading(false);
        return;
      }
      try {
        // For demo purposes, create a mock chatbot config
        const mockChatbotData: ChatbotData = {
          id: chatbotId as string,
          name: "Demo Chatbot",
          status: "active",
          companyId: "demo-company",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          config: {
            sources: {
              urls: [],
              documents: [],
              additionalInfo: "This is a demo chatbot for testing purposes."
            },
            settings: {
              tone: "friendly",
              timeout: 30,
              voiceGender: "neutral",
              speechEnabled: true,
              responseLength: "medium",
              updateFrequency: "daily"
            },
            appearance: {
              icon: "BotIcon1",
              avatar: "BotAvatar1",
              fontSize: 14,
              position: "bottom-right",
              headerText: "SmartAssist Bot",
              showAvatar: true,
              widgetWidth: 400,
              borderRadius: 15,
              primaryColor: "#3B82F6",
              widgetHeight: 600,
              showTimestamp: true,
              welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?",
              placeholderText: "Type your message here..."
            }
          }
        };
        
        setChatbotData(mockChatbotData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load chatbot configuration");
        console.error("Error fetching chatbot config:", err);
        setLoading(false);
      }
    };
    fetchChatbotConfig();
  }, [chatbotId]);

  const getResponsiveDimensions = () => {
    if (isIframe)
      return {
        width: "100%",
        height: "100%",
        position: "relative" as const,
        bottom: "auto",
        right: "auto",
      };
    if (window.innerWidth < 640)
      return {
        width: "100%",
        height: "100vh",
        position: "fixed" as const,
        bottom: 0,
        right: 0,
        borderRadius: 15,
      };
    return {
      width: "100%",
      height: "90vh",
      position: "relative" as const,
      bottom: "auto",
      right: "auto",
      borderRadius: 15,
    };
  };

  const dimensions = getResponsiveDimensions();

  return (
    <div
      className={`${isIframe || isMinimized ? "h-full" : "min-h-screen bg-background"}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isIframe || isMinimized ? 0 : "1rem",
        height: "100vh",
        backgroundColor: isIframe || isMinimized ? "transparent" : undefined,
      }}
    >
      <Card
        className={`overflow-hidden flex flex-col ${
          isIframe || isMinimized ? "bg-transparent shadow-none border-none" : "shadow-lg"
        }`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          position: dimensions.position,
          bottom: dimensions.bottom,
          right: dimensions.right,
          borderRadius: dimensions.borderRadius,
          maxWidth: "100%",
          maxHeight: "100%",
          background: isIframe || isMinimized ? "transparent" : undefined,
          boxShadow: isIframe || isMinimized ? "none" : undefined,
          border: isIframe || isMinimized ? "none" : undefined,
        }}
      >
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500 p-4">{error}</div>
          </div>
        )}
        {!loading && chatbotData && (
          <ChatbotCore chatbotData={chatbotData} isIframe={isIframe} />
        )}
      </Card>
    </div>
  );
};

export default ChatbotPage; 