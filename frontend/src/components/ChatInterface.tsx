"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatInterface() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (response.ok) {
                const data = await response.json();
                const aiMessage = { role: "assistant", content: data.response };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not get response." }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Error: Network issue." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white flex items-center gap-2">
                <div className="p-2 bg-violet-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">AI Financial Advisor</h2>
                    <p className="text-xs text-gray-500">Powered by Gemini 2.0</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Ask me anything about your finances!</p>
                        <p className="text-sm mt-2">"How can I save more?"</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-100" : "bg-violet-100"
                            }`}>
                            {msg.role === "user" ? (
                                <User className="w-4 h-4 text-blue-600" />
                            ) : (
                                <Bot className="w-4 h-4 text-violet-600" />
                            )}
                        </div>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none"
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-violet-600" />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your question..."
                        className="flex-1 p-3 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
