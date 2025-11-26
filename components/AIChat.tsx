
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ChevronRight, Terminal, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToAI } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import AIConfigModal from './AIConfigModal';

interface AIChatProps {
  language: Language;
}

const AIChat: React.FC<AIChatProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initialText = language === 'en' 
      ? 'SYSTEM READY. AWAITING INPUT...'
      : '系统就绪。等待输入...';
      
    setMessages([{ role: 'model', text: initialText }]);
  }, [language]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 100);

    // Pass the full history to the service for OpenAI context
    const responseText = await sendMessageToAI(input, updatedHistory);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const uiText = {
    title: 'TERMINAL_V1',
    placeholder: '_',
  };

  return (
    <>
      <AIConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} language={language} />
      
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto font-mono">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="mb-4 w-[90vw] md:w-[400px] bg-black border border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
            >
              {/* Header */}
              <div className="bg-[#00f0ff]/10 p-2 flex justify-between items-center border-b border-[#00f0ff]/30">
                <div className="flex items-center gap-2 text-[#00f0ff]">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs tracking-widest">{uiText.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsConfigOpen(true)}
                    className="text-[#00f0ff] hover:text-white transition-colors"
                    title="Configure AI Model"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-[#00f0ff] hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div 
                ref={chatContainerRef}
                className="h-64 overflow-y-auto p-4 space-y-2 scroll-smooth bg-black/90"
              >
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-[#00f0ff]'}`}
                  >
                    <span className="opacity-50 mr-2">{msg.role === 'user' ? '>' : '#'}</span>
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="text-[#00f0ff] text-sm animate-pulse">
                    # PROCESSING_REQUEST...
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-[#00f0ff]/30 bg-black">
                <div className="flex gap-2 items-center">
                  <span className="text-[#00f0ff]">{'>'}</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={uiText.placeholder}
                    className="flex-1 bg-transparent text-white placeholder-[#00f0ff]/30 text-sm focus:outline-none caret-[#00f0ff]"
                    autoFocus
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="text-[#00f0ff] hover:text-white transition-colors disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-black border border-[#00f0ff] flex items-center justify-center hover:bg-[#00f0ff]/10 transition-colors group"
        >
          {isOpen ? (
            <span className="w-3 h-3 bg-[#00f0ff]" />
          ) : (
            <MessageSquare className="w-5 h-5 text-[#00f0ff]" />
          )}
        </motion.button>
      </div>
    </>
  );
};

export default AIChat;
