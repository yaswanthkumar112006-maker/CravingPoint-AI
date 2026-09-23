/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Bot, Flame, ArrowRight } from "lucide-react";

export function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: "Namaste! ✨ I am your **CravingPoint Gourmet AI Concierge**. How can I help you choose today? Ask for spicy biryani recommendations, healthy salads, or coupon deals!"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Recommend spicy South Indian dishes",
    "What are active promo discount codes?",
    "Show authentic dessert platters"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: "ai", text: data.reply || "I am currently calculating gourmet pairings. Try again in a moment!" }]);
      } else {
        throw new Error();
      }
    } catch {
      // Fallback
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            sender: "ai", 
            text: "Based on top diner ratings, I highly recommend ordering the **Special Ghee Roast Dosa** from **Swarnamukhii Multicuisine** paired with **Hyderabadi Dum Biryani** from **Biryani Hub**! Use coupon **CRAVING50** for 50% discount! 🍛✨" 
          }
        ]);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (raw: string) => {
    return raw.split("\n").map((line, idx) => {
      let formatted = line;
      const regex = /\*\*(.*?)\*\*/g;
      formatted = formatted.replace(regex, "<strong>$1</strong>");
      
      if (line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-700 font-medium mb-1" dangerouslySetInnerHTML={{ __html: formatted.replace("- ", "") }} />
        );
      }
      return (
        <p key={idx} className="mb-1.5 leading-relaxed text-gray-800 font-medium" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div id="cp-ai-chat-widget" className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 bg-gradient-to-tr from-[#E23744] to-[#FF6838] text-white px-5 py-3.5 rounded-full shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide">Craving AI</span>
          <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Ask
          </span>
        </button>
      )}

      {/* CHAT MODAL */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-[90vw] max-w-[380px] h-[520px] flex flex-col overflow-hidden animate-fade-in text-left">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-4.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E23744] to-[#FF6838] flex items-center justify-center shadow-md">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-black text-white">Gourmet Concierge</h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Powered by Gemini AI</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/70 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#E23744] text-white rounded-tr-none font-medium"
                      : "bg-white border border-gray-200/80 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.sender === "ai" ? formatText(msg.text) : <p>{msg.text}</p>}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-gray-200/80 rounded-2xl rounded-tl-none p-3.5 flex items-center space-x-2 text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-[#E23744] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#E23744] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#E23744] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="p-2.5 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto scrollbar-hide">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset)}
                className="whitespace-nowrap bg-gray-100 hover:bg-red-50 hover:text-[#E23744] text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors shrink-0"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask Craving AI for recommendations..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:bg-white font-medium placeholder:text-gray-400 text-gray-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-[#E23744] hover:bg-[#D02B38] text-white p-2.5 rounded-xl disabled:opacity-40 transition-colors shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
