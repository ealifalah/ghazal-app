
import React, { useState, useRef, useEffect } from 'react';
import { LanguageLevel, Message, StudyMode } from './types';
import { generateTutorResponse } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import { 
  Send, Sparkles, Languages, RefreshCcw, 
  Mic, BookText, Type as TypeIcon, PenTool, Layout, 
  GraduationCap, Menu, X, ChevronLeft
} from 'lucide-react';

const App: React.FC = () => {
  const [level, setLevel] = useState<LanguageLevel>(LanguageLevel.B);
  const [mode, setMode] = useState<StudyMode>(StudyMode.GENERAL);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const welcomeMessage = async () => {
      setIsTyping(true);
      const prompt = `User has selected level ${level} and mode ${mode}. Introduce yourself as the teacher of Ghazal English School and invite the user to ask any question or start a conversation in this mode. Do not start teaching yet, wait for their question.`;
      const text = await generateTutorResponse(level, mode, [], prompt);
      const botMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: text || "Welcome to Ghazal English School! I'm your teacher. How can I assist you today?",
        timestamp: new Date()
      };
      setMessages([botMsg]);
      setIsTyping(false);
    };
    welcomeMessage();
  }, [level, mode]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await generateTutorResponse(level, mode, messages, input);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "Something went wrong. Could you please repeat that?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const modes = [
    { id: StudyMode.GENERAL, icon: Layout, label: 'جنرال', color: 'text-purple-600' },
    { id: StudyMode.SPEAKING, icon: Mic, label: 'اسپیکینگ', color: 'text-blue-600' },
    { id: StudyMode.GRAMMAR, icon: BookText, label: 'گرامر', color: 'text-emerald-600' },
    { id: StudyMode.VOCABULARY, icon: TypeIcon, label: 'وکب', color: 'text-amber-600' },
    { id: StudyMode.WRITING, icon: PenTool, label: 'رایتینگ', color: 'text-rose-600' },
  ];

  const levels = [
    { code: 'B', label: 'Beginner', value: LanguageLevel.B },
    { code: 'E', label: 'Elementary', value: LanguageLevel.E },
    { code: 'PI', label: 'Pre-Inter', value: LanguageLevel.PI },
    { code: 'I', label: 'Intermediate', value: LanguageLevel.I },
    { code: 'UI', label: 'Upper-Inter', value: LanguageLevel.UI },
    { code: 'ADV', label: 'Advanced', value: LanguageLevel.ADV },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-['Vazirmatn']">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="bg-blue-600 p-2 rounded-xl">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="font-bold text-lg sm:text-xl text-slate-800">Ghazal English School</h1>
          </div>
          
          <button 
            onClick={() => setMessages([])}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors flex items-center gap-2"
            title="شروع مجدد"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-0 lg:gap-6 overflow-hidden relative">
        
        {/* Sidebar Overlay for Mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Right Sidebar (Menu & Levels) */}
        <aside className={`
          fixed lg:sticky top-16 lg:top-24 bottom-0 right-0 z-40
          w-72 lg:w-80 bg-white lg:bg-transparent border-l lg:border-none
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          flex flex-col gap-6 p-6 lg:p-0 h-[calc(100vh-4rem)] lg:h-fit overflow-y-auto
        `}>
          {/* Section: Study Modes */}
          <div className="bg-white rounded-3xl shadow-lg lg:shadow-sm border border-slate-200 p-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
              <Languages size={14} />
              بخش آموزشی
            </h3>
            <div className="space-y-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all border
                    ${mode === m.id 
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/10' 
                      : 'border-transparent hover:bg-slate-50 opacity-70 hover:opacity-100'}`}
                >
                  <div className={`p-2 rounded-xl bg-white shadow-sm ${mode === m.id ? 'text-blue-600' : 'text-slate-400'}`}>
                    <m.icon size={20} className={mode === m.id ? '' : 'grayscale'} />
                  </div>
                  <span className={`text-sm font-bold ${mode === m.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {m.label}
                  </span>
                  {mode === m.id && <ChevronLeft size={16} className="mr-auto text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Levels */}
          <div className="bg-white rounded-3xl shadow-lg lg:shadow-sm border border-slate-200 p-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
              <Sparkles size={14} />
              انتخاب سطح
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl.code}
                  onClick={() => {
                    setLevel(lvl.value);
                    setIsMenuOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border
                    ${level === lvl.value 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 border-transparent text-slate-600 hover:border-slate-200'}`}
                >
                  <span className="text-sm font-black">{lvl.code}</span>
                  <span className="text-[10px] font-bold opacity-80">{lvl.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 hidden lg:block">
            <p className="text-[11px] text-amber-800 leading-relaxed text-right font-medium">
              💡 در بخش <span className="font-bold">گرامر</span> و <span className="font-bold">وکب</span>، بعد از توضیح برای شما تمرین طراحی می‌شود. در بخش <span className="font-bold">جنرال</span> فقط مثال ارائه می‌گردد.
            </p>
          </div>
        </aside>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white lg:rounded-3xl shadow-none lg:shadow-xl border-x lg:border border-slate-200 overflow-hidden min-h-[500px] transition-all relative z-10">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/20">
            {messages.length === 0 && !isTyping && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Sparkles size={48} className="text-blue-300 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-slate-400">Ghazal English School</h3>
                <p className="text-sm mt-2">منتظر سوال شما هستیم...</p>
              </div>
            )}
            
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex bg-white border border-slate-200 px-5 py-4 rounded-3xl rounded-tr-none gap-2 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 lg:p-6 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3 w-full">
              <div className="flex-1 relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="سوال خود را بپرسید..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none h-16 lg:h-20 transition-all shadow-sm english-text text-base bg-slate-50/50 hover:bg-white focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`p-4 lg:p-5 rounded-2xl flex items-center justify-center transition-all shadow-lg
                  ${!input.trim() || isTyping 
                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-500/20'}`}
              >
                <Send size={24} className="transform -rotate-45" />
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
