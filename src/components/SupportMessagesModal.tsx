import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Headphones,
  CheckCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface SupportMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'support' | 'user';
  text: string;
  time: string;
}

export const SupportMessagesModal: React.FC<SupportMessagesModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'support',
      text: 'Hello! Welcome to Quotex Priority Support. How can we assist you today?',
      time: '10:00 AM'
    },
    {
      id: '2',
      sender: 'support',
      text: 'Our team is available 24/7 for deposit assistance, withdrawal tracking, and account questions.',
      time: '10:01 AM'
    }
  ]);

  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let reply = 'Thank you for reaching out. An agent is reviewing your query right now.';
      if (currentInput.includes('deposit') || currentInput.includes('paisa') || currentInput.includes('jazzcash')) {
        reply = 'Deposits via Easypaisa, JazzCash, and Crypto are credited instantly with 0% fee. If you need manual confirmation, please send your transaction screenshot!';
      } else if (currentInput.includes('withdraw') || currentInput.includes('nikal')) {
        reply = 'Withdrawals are processed swiftly to your verified account. Standard processing time is 5 to 30 minutes.';
      } else if (currentInput.includes('menu') || currentInput.includes('lock') || currentInput.includes('pin') || currentInput.includes('1234')) {
        reply = 'The trading menu lock PIN is 1234. You can change your PIN anytime inside the Menu Security settings!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'support',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md h-[550px] max-h-[90vh] bg-[#0c1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Support & Helpdesk</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  ONLINE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                24/7 dedicated support team
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-xs'
                    : 'bg-[#151e30] border border-white/10 text-slate-200 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/[0.08] bg-black/30 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black cursor-pointer transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
