import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, BookOpen, TrendingUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import detailsOfColleges from '../data/Detais of colleges.json';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your AI educational guidance assistant. I can help you with course recommendations, career advice, admission guidance, and answer any questions about your educational journey. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      icon: BookOpen,
      text: "What courses are best for my interests?",
      question: "I'm interested in technology and innovation. What courses would you recommend for someone with my background?"
    },
    {
      icon: TrendingUp,
      text: "Which fields have the best job prospects?",
      question: "Which career fields are expected to have the highest demand and growth in the next 5-10 years?"
    },
    {
      icon: Lightbulb,
      text: "How do I choose the right institution?",
      question: "What factors should I consider when choosing between different educational institutions?"
    },
    {
      icon: HelpCircle,
      text: "What's the admission process like?",
      question: "Can you explain the typical admission process for engineering colleges in India?"
    }
  ];

  // Check API key configuration on component mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('API Key Debug:', {
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined',
      allEnvVars: Object.keys(import.meta.env),
      hasViteGeminiKey: 'VITE_GEMINI_API_KEY' in import.meta.env
    });
    setApiKeyConfigured(!!apiKey);
    
    if (!apiKey) {
      setMessages([{
        id: '1',
        text: "Hello! I'm your AI educational guidance assistant. However, I'm not properly configured at the moment. Please make sure the Gemini API key is set up in the environment variables (VITE_GEMINI_API_KEY). Once configured, I'll be able to help you with course recommendations, career advice, and admission guidance.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simple local pre-check to avoid hitting the AI when we can answer from data
  const getLocalAnswer = async (userMessage: string): Promise<string | null> => {
    const msg = userMessage.trim().toLowerCase();
    // Pattern: colleges in <district>
    const match = msg.match(/colleges\s+in\s+([a-z\s]+)\??$/i);
    if (match) {
      const district = match[1].trim();
      const results = (detailsOfColleges as any[]).filter((c) =>
        typeof c.District === 'string' && c.District.trim().toLowerCase() === district.toLowerCase()
      );
      if (results.length > 0) {
        const names = results.slice(0, 10).map((c) => c['College Name']).filter(Boolean);
        return `Here are some colleges in ${district} (top ${Math.min(10, results.length)}):\n- ` + names.join('\n- ');
      }
      return `I couldn't find colleges in "${district}" from local data. You can try another district or ask the AI for guidance.`;
    }

    // fees of <college>
    const feeMatch = msg.match(/fees\s+of\s+(.+?)\??$/i);
    if (feeMatch) {
      const name = feeMatch[1].trim();
      const item = (detailsOfColleges as any[]).find((c) =>
        typeof c['College Name'] === 'string' && c['College Name'].toLowerCase().includes(name.toLowerCase())
      );
      if (item) {
        const fees = item['Tuition Fee'] || item['Fees'] || item['Average Fees'] || 'Not available';
        return `Approximate fees for ${item['College Name']}: ${fees}`;
      }
      return `I couldn't find fee details for "${name}" in local data.`;
    }

    // location of <college>
    const locMatch = msg.match(/location\s+of\s+(.+?)\??$/i);
    if (locMatch) {
      const name = locMatch[1].trim();
      const item = (detailsOfColleges as any[]).find((c) =>
        typeof c['College Name'] === 'string' && c['College Name'].toLowerCase().includes(name.toLowerCase())
      );
      if (item) {
        const addr = [item['Address'], item['District'], item['Pincode']].filter(Boolean).join(', ');
        return `Location of ${item['College Name']}: ${addr || 'Not available'}`;
      }
      return `I couldn't find location details for "${name}" in local data.`;
    }

    // courses in <field> (basic extract from branch codes)
    const courseMatch = msg.match(/courses\s+in\s+([a-z\s]+)\??$/i);
    if (courseMatch) {
      const field = courseMatch[1].trim();
      // naive: list distinct branch codes/names containing the field
      const branchNames = new Set<string>();
      (detailsOfColleges as any[]).forEach((college) => {
        Object.keys(college).forEach((key) => {
          if (key.startsWith('Branch Code ') && college[key] && String(college[key]).trim() !== '') {
            const code = key.replace('Branch Code ', '');
            const name = code; // we only have code; expose code as proxy
            if (name.toLowerCase().includes(field.toLowerCase())) {
              branchNames.add(name);
            }
          }
        });
      });
      if (branchNames.size > 0) {
        const list = Array.from(branchNames).slice(0, 10);
        return `Courses matching "${field}" (by branch code):\n- ` + list.join('\n- ');
      }
      return `No local course entries matched "${field}". Try asking the AI for broader guidance.`;
    }
    return null;
  };

  const generateAIResponse = async (userMessage: string, retryCount = 0): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

    const prompt = `You are an educational guidance assistant specializing in helping students with course selection, career advice, and admission guidance. Focus on providing detailed, accurate, and helpful information about educational opportunities, particularly in India. Be friendly and encouraging while maintaining professionalism. Keep responses concise but informative.

User question: ${userMessage}`;

    // 1) Try Netlify serverless proxy first (avoids client-side CORS and key restrictions)
    try {
      const proxyResp = await fetch('/.netlify/functions/ai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: prompt }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.8,
            topK: 10
          }
        })
      });

      if (proxyResp.ok) {
        const data = await proxyResp.json();
        // Gemini response extraction
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
          || data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('\n')
          || data?.text
          || '';
        if (text) return text;
      } else {
        console.warn('Proxy call failed with status:', proxyResp.status);
      }
    } catch (proxyError) {
      console.warn('Proxy not available or failed, falling back to client SDK.', proxyError);
    }

    // 2) Fallback to client SDK if proxy isn’t available
    try {
      if (!apiKey) {
        console.error('Gemini API key is missing for client SDK');
        return "I apologize, but I'm not properly configured. Please check the API key configuration.";
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
          topP: 0.8,
          topK: 10
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Detailed error in AI response:', error);
      if (error instanceof Error) {
        if (error.message.includes('API_KEY_INVALID')) {
          return 'Authentication error: Please check if the API key is correct.';
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
          if (retryCount < 2) {
            const delay = Math.pow(2, retryCount + 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateAIResponse(userMessage, retryCount + 1);
          }
          return '⚠️ I\'m answering too many students at once. Please wait ~30–60 seconds and try again.';
        }
      }
      return 'I apologize, but I encountered an error. Please try again.';
    }
  };

  // Simple in-memory request queue to avoid parallel API calls
  let processing = false;
  const queueRef = useRef<(() => Promise<void>)[]>([]);
  const processQueue = async () => {
    if (processing || queueRef.current.length === 0) return;
    processing = true;
    const job = queueRef.current.shift();
    if (job) {
      await job();
    }
    processing = false;
    // process next
    if (queueRef.current.length > 0) {
      processQueue();
    }
  };
  const enqueue = (fn: () => Promise<void>) => {
    queueRef.current.push(fn);
    processQueue();
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // First, try local data answer
    const local = await getLocalAnswer(textToSend);
    if (local) {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: local,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      return;
    }

    // Otherwise, queue AI call to prevent rate spikes
    enqueue(async () => {
      try {
        const aiResponse = await generateAIResponse(textToSend);
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('Error in chat:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I encountered an error. Please try again.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI Educational Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Get instant guidance on courses, careers, and admissions
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: '70vh' }}>
          {/* Chat Messages + Quick Questions in scrollable area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>
                    </div>

                    {/* Message Bubble */}
                    <div className={`px-4 py-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.text}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex mr-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />

            {/* Quick Questions (render inside scrollable area so input stays fixed) */}
            {messages.length === 1 && apiKeyConfigured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 bg-white/0"
              >
                <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickQuestions.map((q, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSendMessage(q.question)}
                      className="flex items-center space-x-2 text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <q.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{q.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={apiKeyConfigured ? "Ask me anything about courses, careers, or admissions..." : "API key not configured. Please set up VITE_GEMINI_API_KEY."}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <motion.button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  inputText.trim() && !isTyping
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;