import React, { useState, useRef, useEffect } from 'react';
import { JobNotification } from '../types';
import { Sparkles, Send, Loader2, ArrowRightLeft, BookOpen, AlertCircle } from 'lucide-react';

interface AIPrepAdvisorProps {
  job?: JobNotification;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIPrepAdvisor({ job }: AIPrepAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: job 
        ? `Adarniya Aspirant! 🙏 I can assist you to decode the syllabus, prepare high-yielding study plans, or understand age criteria relaxations for **${job.shortTitle}**. Ask me any question or choose from the expert templates below!`
        : "Namaskar! 🙏 I am your official Career Box AI advisor. Select any notification from the dashboard or choose an action below to structure your exam preparations, understand qualification requirements, or format study timelines.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const testPrompts = job ? [
    { label: "📚 30-Day Preparation Plan", text: "Create a highly detailed 30-day subject wise study routine and time table tracker." },
    { label: "📝 Syllabus & Core Markings", text: "Explain the detailed exam pattern, selection process stages, subject subtopics, and mark distribution weights." },
    { label: "❓ 5-Question Quick Mock Set", text: "Provide a quick 5-question multiple choice question practice set representing standard questions with explanations." },
    { label: "💁 Simplify Age Relaxation & Eligibility", text: "Explain the exact minimum/maximum age thresholds and the eligibility criteria details for all reserve quotas." }
  ] : [
    { label: "🔥 General UPSC Prep Guide", text: "Provide a complete overview of Union Public Service Commission Civil Services roadmap, standard resource list, and CSAT strategies." },
    { label: "🚄 Crack SSC CGL as a Beginner", text: "What are the core pillars to clear SSC CGL Tier 1 and 2 in 6 months for a college graduate?" },
    { label: "🏦 Best Bank PO preparation resources", text: "Give me the best standard quantitative aptitude books and reasoning channels to crack IBPS examination." }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string | null) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend) return;

    if (!customPrompt) setInput('');
    setErrorStatus(null);

    const userMsg: Message = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/query-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: textToSend,
          context: job
        })
      });

      if (!response.ok) {
        throw new Error('Career Box Server is busy. Please try again in secondary turn.');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `assistant-msg-${Date.now()}`,
        sender: 'assistant',
        content: data.answer || "Main kshama chahta hu, I could not hear the answer. Can you try again?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      setErrorStatus(error.message || "Failed to make a connection to AI Gateway server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-advisor-wrapper" className="flex flex-col h-[520px] bg-white border-2 border-slate-900 rounded-md overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
      {/* Header with robust bold styling */}
      <div className="bg-red-700 text-white px-4 py-3 border-b-2 border-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-400 rounded border border-slate-900 animate-pulse">
            <Sparkles className="w-4 h-4 text-slate-900 stroke-[3]" />
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-wider leading-none">
              Career Box AI Guide Co-Pilot
            </h4>
            <p className="text-[10px] text-red-100 font-extrabold mt-1 select-none">
              Gemini AI Study Assistant 2026
            </p>
          </div>
        </div>
        {job && (
          <span className="text-[9px] bg-slate-900 text-yellow-400 font-black px-2 py-1 rounded border border-slate-800 uppercase tracking-widest select-none">
            CONTEXT: {job.shortTitle}
          </span>
        )}
      </div>

      {/* Messages Thread */}
      <div id="ai-chat-thread" className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded px-3.5 py-2.5 text-xs font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
              msg.sender === 'user'
                ? 'bg-red-700 text-white rounded-br-none'
                : 'bg-white text-slate-900 rounded-bl-none'
            }`}>
              {/* Message Content */}
              <div className="prose prose-sm whitespace-pre-wrap leading-relaxed break-words font-sans">
                {msg.content}
              </div>
              <span className={`block text-[9px] mt-1.5 text-right font-mono font-black ${
                msg.sender === 'user' ? 'text-red-200' : 'text-slate-500'
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-slate-900 rounded rounded-bl-none px-4 py-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center gap-2 font-bold text-xs text-slate-800">
              <Loader2 className="w-4 h-4 text-red-700 animate-spin stroke-[3]" />
              <span className="animate-pulse">
                Career Box Mentor is generating preparation timeline...
              </span>
            </div>
          </div>
        )}

        {errorStatus && (
          <div className="bg-rose-50 border-2 border-rose-600 p-3 rounded flex items-start gap-2.5 text-rose-900 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <p className="font-extrabold uppercase tracking-wider">Gateway Timeout Alert</p>
              <p>{errorStatus}</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Templates Prompt List in retro row */}
      <div className="px-3 py-2 bg-yellow-400 border-t-2 border-slate-900 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none items-center">
        <span className="text-[9px] bg-red-700 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
          ROUTINES
        </span>
        {testPrompts.map((p, idx) => (
          <button 
            key={idx}
            onClick={() => handleSend(p.text)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[10px] bg-white text-slate-900 font-extrabold hover:bg-slate-100 border-2 border-slate-900 rounded px-2.5 py-1.5 transition-all outline-none cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            <BookOpen className="w-3 h-3 text-red-700 stroke-[2.5]" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t-2 border-slate-900 flex items-center gap-2">
        <input 
          id="ai-advisor-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSend();
            }
          }}
          disabled={loading}
          placeholder="Ask anything (e.g. '30-day syllabus study plan', 'best mock tests scheme')..."
          className="flex-1 bg-slate-50 text-slate-900 font-bold placeholder-slate-400 text-xs rounded border-2 border-slate-900 px-3 py-2 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-200 transition-all font-sans disabled:opacity-50"
        />
        <button
          id="ai-advisor-send"
          disabled={loading || !input.trim()}
          onClick={() => handleSend()}
          className="p-2 bg-red-700 hover:bg-red-800 disabled:bg-slate-200 disabled:border-slate-400 disabled:text-slate-400 text-white rounded border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
