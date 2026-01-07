import { GoogleGenAI } from "@google/genai";
import { LanguageLevel, Message, StudyMode } from "../types";

// دریافت کلید API به روش استاندارد Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!apiKey) {
  console.error("⛔ CRITICAL ERROR: API Key is missing! Please set VITE_GEMINI_API_KEY in Vercel Environment Variables.");
}

const ai = new GoogleGenAI({ apiKey });

const LEVEL_PROMPTS: Record<string, string> = {
  [LanguageLevel.B]: "The student is at Beginner level (Top Notch Fundamentals). Focus on basic greetings, alphabet, numbers, and simple present 'to be' verbs. Use basic vocabulary and present tense. Use 80% English, 20% Persian for explanations.",
  [LanguageLevel.E]: "The student is at Elementary level (Top Notch 1). Focus on daily activities, present continuous, and past tense. Use basic vocabulary and present tense. Use 90% English.",
  [LanguageLevel.PI]: "The student is at Pre-Intermediate level (Top Notch 2). Focus on health, future with 'going to', and comparatives. Encourage more English output. Use 95% English.",
  [LanguageLevel.I]: "The student is at Intermediate level (Top Notch 3). Focus on present perfect, modals, and environment. Conduct 70% of the conversation in English.",
  [LanguageLevel.UI]: "The student is at Upper-Intermediate level (Summit 1). Focus on gerunds, infinitives, and abstract discussions. Use 90% English.",
  [LanguageLevel.ADV]: "The student is at Advanced level (Summit 2). Focus on professional communication, conditionals, and nuance. Conduct the session entirely in English."
};

const MODE_PROMPTS: Record<StudyMode, string> = {
  [StudyMode.GENERAL]: "Act as a general English tutor. When a user asks a question, explain the concept clearly and provide 2-3 practical examples. No exercises needed unless asked.",
  [StudyMode.SPEAKING]: "Focus on conversational flow. Encourage the user to speak more. Correct their errors gently and guide them to express their thoughts better.",
  [StudyMode.GRAMMAR]: "Analyze the user's question or sentence. 1) Explain the rule clearly. 2) Provide 3 clear examples. 3) End your response with a small, simple fill-in-the-blank exercise.",
  [StudyMode.VOCABULARY]: "Focus on the words the user is interested in. 1) Explain the meaning and usage. 2) Provide 3 example sentences. 3) End your response with a multiple-choice quiz question.",
  [StudyMode.WRITING]: "Help the user improve their written expression. Provide feedback on punctuation and structure. Guide them to rewrite their sentences more naturally."
};

export const generateTutorResponse = async (
  level: LanguageLevel,
  mode: StudyMode,
  chatHistory: Message[],
  userInput: string
) => {
  const modelName = 'gemini-2.0-flash-exp'; 

  const systemInstruction = `
  You are an expert English Teacher at "Ghazal English School", specializing in the 'Top Notch' and 'Summit' book series.
  Level: ${LEVEL_PROMPTS[level]}.
  Current Mode: ${MODE_PROMPTS[mode]}.
  
  Structure your responses using Markdown for readability.
  `;

  try {
    const model = ai.getGenerativeModel({ 
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

// --- این تابع اضافه شد تا ارور بیلد رفع شود ---
export const generateAudio = async (text: string): Promise<string | null> => {
    // فعلاً یک مقدار خالی برمی‌گرداند تا بیلد موفق شود
    // اگر بعداً نیاز به تبدیل متن به صدا داشتید، کدهای مربوطه اینجا قرار می‌گیرند
    console.log("Audio generation requested (not implemented yet) for:", text);
    return null;
};
