
import React, { useState } from 'react';
import { Message } from '../types';
import { Play, Volume2, CheckCircle2, User, GraduationCap } from 'lucide-react';
import { generateAudio } from '../services/geminiService';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeech = async () => {
    if (isPlaying) return;
    try {
      setIsPlaying(true);
      const audioData = await generateAudio(message.text);
      if (audioData) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Audio generation failed', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className={`flex w-full mb-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] sm:max-w-[70%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-1 
          ${isModel ? 'bg-blue-600 text-white ml-3' : 'bg-emerald-600 text-white mr-3'}`}>
          {isModel ? <GraduationCap size={20} /> : <User size={20} />}
        </div>
        
        <div className={`flex flex-col ${isModel ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm sm:text-base transition-all
            ${isModel 
              ? 'bg-white text-slate-800 rounded-tr-none border border-slate-100' 
              : 'bg-emerald-600 text-white rounded-tl-none'}`}>
            
            <div className={`${isModel ? 'english-text' : 'text-right'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.text}
              </p>
            </div>

            {isModel && (
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                <button 
                  onClick={handleSpeech}
                  disabled={isPlaying}
                  className={`p-1.5 rounded-full hover:bg-slate-50 text-slate-500 transition-colors ${isPlaying ? 'animate-pulse text-blue-500' : ''}`}
                  title="Listen to pronunciation"
                >
                  <Volume2 size={18} />
                </button>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">AI TUTOR</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 mx-2">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
