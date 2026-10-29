import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Info,
  BookOpen,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { sendChatMessage } from '../api';

const QUICK_PROMPTS = [
  '🎒 What should be packed in a 72-hour flood emergency go-bag?',
  '📊 How do I interpret the River Level and Rainfall indicators?',
  '⚠️ What are the golden rules of safety during active floodwaters?',
  '🛡️ What are the post-flood sanitation and disease prevention steps?',
  '📐 How is the 0-100 disaster risk score calculated transparently?'
];

export default function AiAssistantView({ activeLocation }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '### 🤝 Welcome to DATHEON AI Assistant\n\nI am your disaster preparedness and decision-support guide for the **AI Manthan 2.0 Hackathon**.\n\nI can explain:\n- **72-Hour Survival Go-Bag Essentials**\n- **Understanding Catchment Risk Indicators** (Rainfall, River Gauge Levels, Terrain Susceptibility)\n- **Life-Safety Protocols** during flash floods and dam spillover\n- **Post-Flood Recovery & Sanitation Protocols** (water disinfection, structural checks)\n\n*Select a prompt below or type your emergency readiness question.*',
      sources: ['NDMA Guidelines', 'Sendai Framework for Disaster Risk Reduction', 'Red Cross Protocols'],
      followups: [
        'What should be packed in a 72-hour flood emergency go-bag?',
        'How do I interpret the River Level and Rainfall indicators?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const locationContext = activeLocation ? `${activeLocation.name} (${activeLocation.risk_category} Risk)` : 'General';
      const res = await sendChatMessage(query, historyPayload, locationContext);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.reply,
          sources: res.data.sources_consulted,
          followups: res.data.suggested_followups
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, an error occurred while processing your request. Please check your connectivity and try again.',
          sources: ['System Diagnostic']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-navy-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Disaster Preparedness AI Assistant
          <span className="text-xs bg-navy-800 text-flood-cyan border border-navy-700 px-2 py-0.5 rounded-full font-mono">
            Feature 6
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Ask questions about flood risk indicators, 72-hour survival checklists, life safety rules, and Sendai Framework guidelines.
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="bg-navy-900 border border-navy-750 rounded-xl shadow-xl flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header Bar */}
        <div className="p-3.5 bg-navy-850 border-b border-navy-750 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-flood-blue/20 text-flood-cyan flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">DATHEON AI Emergency Guidance</span>
              <span className="text-[10px] text-emerald-400">Ground-truth verified knowledge base active</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 hidden sm:block">
            Sources: NDMA • Sendai Framework • Red Cross
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-flood-blue text-white shadow-md'
                      : 'bg-navy-800 text-flood-cyan border border-navy-700 shadow-md'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                    isUser
                      ? 'bg-flood-blue text-white rounded-tr-none shadow-md'
                      : 'bg-navy-850 text-slate-100 rounded-tl-none border border-navy-750 shadow-md'
                  }`}
                >
                  <div className="prose prose-invert prose-xs max-w-none whitespace-pre-line">
                    {m.content}
                  </div>

                  {/* Sources Consulted Tag */}
                  {!isUser && m.sources && m.sources.length > 0 && (
                    <div className="pt-2 border-t border-navy-750/80 text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <BookOpen className="w-3 h-3 text-flood-cyan" />
                      <span>Sources:</span>
                      {m.sources.map((src, i) => (
                        <span key={i} className="bg-navy-900 px-1.5 py-0.5 rounded border border-navy-800 text-slate-300">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {!isUser && m.followups && m.followups.length > 0 && (
                    <div className="pt-1.5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-semibold">Suggested Questions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.followups.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSend(q)}
                            className="text-[10px] text-flood-cyan bg-navy-900 hover:bg-navy-800 border border-navy-750 px-2 py-1 rounded-md text-left transition"
                          >
                            → {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-lg bg-navy-800 text-flood-cyan flex items-center justify-center shrink-0 border border-navy-700">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-navy-850 rounded-xl border border-navy-750 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-flood-cyan animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-flood-cyan animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-flood-cyan animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-slate-400 ml-1">Consulting disaster guidelines...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Pills */}
        <div className="px-4 py-2 bg-navy-850 border-t border-navy-750 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-navy-900 border-t border-navy-750">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a disaster preparedness question (e.g., 'What to do if flood waters rise quickly?')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-navy-850 border border-navy-700 rounded-lg px-3.5 py-2.5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-flood-blue font-sans"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-flood-blue hover:bg-flood-blue/90 text-white rounded-lg transition disabled:opacity-40"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Educational decision-support assistant. Does not issue official evacuation mandates. Follow NDMA directives.
          </p>
        </div>
      </div>
    </div>
  );
}
