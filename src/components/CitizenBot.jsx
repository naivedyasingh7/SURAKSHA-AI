import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTIONS = [
  { id: 'cbi', text: '"A phone call claims my child is arrested."', trigger: 'arrest' },
  { id: 'telegram', text: '"Telegram task offering ₹5000/day."', trigger: 'telegram' },
  { id: 'upi', text: '"Verify safety of upi: transfer@ybl"', trigger: 'upi' }
];

const BOT_REPLIES = {
  'arrest': '🚨 <strong>IMMEDIATE ADVICE: DONT SEND MONEY</strong><br/><br/>This is a major impersonation scam. Cyber criminals pose as senior inspectors alleging your child is in custody, requesting "immediate settlement fees".<br/><br/><strong>ACTION PLAN:</strong><br/>1. Hang up. Do not trigger transfers.<br/>2. Dial your child directly to verify safety.<br/>3. File an immediate report at cybercrime.gov.in.',
  'telegram': '🚨 <strong>IMMEDIATE ADVICE: DONT SEND MONEY</strong><br/><br/>This is a common task scam sequence. Fraud rings pay small credits initially to build trust, then demand cash deposits for higher VIP commissions. You will lose the entire deposit.<br/><br/><strong>ACTION PLAN:</strong><br/>1. Never send verification deposits.<br/>2. Block the Telegram recruiter contact immediately.',
  'upi': '🚨 <strong>TELEMETRY CHECK: DONT SEND MONEY</strong><br/><br/>UPI Handle <code>transfer@ybl</code> has 14 complaints in our Cyber registry. It is flagged as an active mule account node.<br/><br/><strong>ACTION PLAN:</strong><br/>Do not initiate transactions or insert your UPI PIN.'
};

export default function CitizenBot() {
  const [messages, setMessages] = useState([
    {
      sender: 'SURAKSHA CITIZEN SHIELD',
      text: 'Hello, citizen. I am your real-time risk advisory assistant. Describe a suspicious scenario, paste messages, or submit suspect UPI handles to audit risk factors.',
      type: 'bot'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollChat = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChat();
  }, [messages, typing]);

  const handleSubmit = (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'CITIZEN', text: messageText, type: 'user' }]);
    setInputVal('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      let reply = 'I have analyzed your query. No matching threat signature found. Remember: government officials never demand wire transfers over calls, and Telegram tasks requiring deposit fees are scams. <strong>Advice: Don\'t send money.</strong>';

      const lower = messageText.toLowerCase();
      if (lower.includes('arrest') || lower.includes('police') || lower.includes('cbi')) {
        reply = BOT_REPLIES['arrest'];
      } else if (lower.includes('telegram') || lower.includes('job') || lower.includes('earn') || lower.includes('task')) {
        reply = BOT_REPLIES['telegram'];
      } else if (lower.includes('upi') || lower.includes('handle') || lower.includes('transfer@ybl')) {
        reply = BOT_REPLIES['upi'];
      }

      setMessages(prev => [...prev, { sender: 'SURAKSHA CITIZEN SHIELD', text: reply, type: 'bot' }]);
    }, 1200);
  };

  return (
    <div className="bg-black/40 border border-white/[0.05] rounded-xl flex flex-col h-[28rem] mt-8 overflow-hidden">
      {/* Messages Feed */}
      <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] flex flex-col gap-1.5 ${
              msg.type === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <span className={`text-[9px] uppercase font-bold tracking-widest flex items-center gap-1 font-mono ${
              msg.type === 'user' ? 'text-teal' : 'text-orange'
            }`}>
              {msg.type === 'user' ? <User className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
              {msg.sender}
            </span>
            <div
              className={`rounded-2xl px-4 py-3 text-xs leading-relaxed text-gray-300 font-sans border ${
                msg.type === 'user'
                  ? 'bg-teal/5 border-teal/15 rounded-tr-none'
                  : 'bg-orange/5 border-orange/15 rounded-tl-none'
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}

        {typing && (
          <div className="self-start flex flex-col gap-1.5 items-start">
            <span className="text-[9px] uppercase font-bold tracking-widest text-orange flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> SURAKSHA CITIZEN SHIELD
            </span>
            <div className="bg-orange/5 border border-orange/15 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-gray-500 font-mono italic animate-pulse">
              Analyzing threat vectors...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts buttons */}
      <div className="flex gap-2 px-6 pb-4 overflow-x-auto select-none shrink-0">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug.id}
            onClick={() => handleSubmit(sug.text.replace(/"/g, ''))}
            className="border border-white/[0.05] bg-white/[0.01] hover:border-teal/30 hover:bg-white/[0.02] text-gray-400 hover:text-white rounded-full px-4 py-1.5 text-[10px] tracking-wide font-sans cursor-pointer transition-colors shrink-0"
          >
            {sug.text}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="border-t border-white/[0.05] px-6 py-4 flex gap-3 items-center shrink-0">
        <input
          type="text"
          placeholder="Explain the incident or paste suspect handle..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(inputVal);
          }}
          className="flex-grow bg-black/50 border border-white/[0.05] focus:border-orange rounded-lg px-4 py-3 text-xs text-white outline-none transition-all duration-300 font-sans"
        />
        <button
          onClick={() => handleSubmit(inputVal)}
          className="bg-orange hover:bg-orange/95 text-white w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
