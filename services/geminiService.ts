import { GoogleGenerativeAI } from "@google/generative-ai";
import { LanguageLevel, Message, StudyMode } from "../types";

// 1. دریافت کلید از متغیر استاندارد Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error("⛔ CRITICAL ERROR: API Key is missing! Check Vercel Environment Variables.");
}

// 2. استفاده از کلاس استاندارد GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(apiKey);

const LEVEL_PROMPTS: Record<string, string> = {
  [LanguageLevel.B]: "The student is at Beginner level. Focus on basic greetings, numbers, and 'to be' verbs. 80% English, 20% Persian.",
  [LanguageLevel.E]: "The student is at Elementary level. Focus on daily activities and present continuous. 90% English.",
  [LanguageLevel.PI]: "The student is at Pre-Intermediate level. Focus on future tense and comparatives. 95% English.",
  [LanguageLevel.I]: "The student is at Intermediate level. Focus on modals and environment. 95% English.",
  [LanguageLevel.UI]: "The student is at Upper-Intermediate level. Focus on abstract discussions. 100% English.",
  [LanguageLevel.ADV]: "The student is at Advanced level. Professional communication. 100% English."
};

const MODE_PROMPTS: Record<StudyMode, string> = {
  [StudyMode.GENERAL]: "Act as a general English tutor. Explain clearly with examples.",
  [StudyMode.SPEAKING]: "Focus on conversational flow. Correct errors gently.",
  [StudyMode.GRAMMAR]: "Explain the grammar rule, give examples, and ask a fill-in-the-blank question.",
  [StudyMode.VOCABULARY]: "Explain meaning, usage, and give a quiz question.",
  [StudyMode.WRITING]: "Improve written expression and punctuation."
};

export const generateTutorResponse = async (
  level: LanguageLevel,
  mode: StudyMode,
  chatHistory: Message[],
  userInput: string
) => {
  // مدل استاندارد و پایدار
  const modelName = 'gemini-1.5-flash'; 

  const systemInstruction = `
  You are an expert English Teacher at "Ghazal English School".
  Level: ${LEVEL_PROMPTS[level]}.
  Current Mode: ${MODE_PROMPTS[mode]}.
  Structure responses using Markdown.
  `;

  try {
    // 3. روش صحیح دریافت مدل در کتابخانه استاندارد
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: systemInstruction
    });

    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: history
    });

    const result = await chat.sendMessage(userInput);
    return result.response.text();
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// تابع کمکی برای جلوگیری از ارور بیلد
export const generateAudio = async (text: string): Promise<string | null> => {
    return null;
};
