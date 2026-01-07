
import { GoogleGenAI, Type } from "@google/genai";
import { LanguageLevel, Message, StudyMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const LEVEL_PROMPTS: Record<string, string> = {
  [LanguageLevel.B]: "The student is at Beginner level (Top Notch Fundamentals). Focus on basic greetings, alphabet, numbers, and simple present 'to be' verbs. Use simple English and explain concepts in Persian.",
  [LanguageLevel.E]: "The student is at Elementary level (Top Notch 1). Focus on daily activities, present continuous, and past tense. Use basic vocabulary and provide bilingual explanations.",
  [LanguageLevel.PI]: "The student is at Pre-Intermediate level (Top Notch 2). Focus on health, future with 'going to', and comparatives. Encourage more English use, but explain complex grammar in Persian.",
  [LanguageLevel.I]: "The student is at Intermediate level (Top Notch 3). Focus on present perfect, modals, and environment. Conduct 70% of the conversation in English.",
  [LanguageLevel.UI]: "The student is at Upper-Intermediate level (Summit 1). Focus on gerunds, infinitives, and abstract discussions. Use 90% English.",
  [LanguageLevel.ADV]: "The student is at Advanced level (Summit 2). Focus on professional communication, conditionals, and nuance. Conduct the session entirely in English unless specifically asked to translate."
};

const MODE_PROMPTS: Record<StudyMode, string> = {
  [StudyMode.GENERAL]: "Act as a general English tutor. When a user asks a question, explain the concept clearly and provide 2-3 practical examples. No exercises are needed here.",
  [StudyMode.SPEAKING]: "Focus on conversational flow. Encourage the user to speak more. Correct their errors gently and guide them to express their thoughts better.",
  [StudyMode.GRAMMAR]: "Analyze the user's question or sentence. 1) Explain the rule clearly. 2) Provide 3 clear examples. 3) End your response with a small, simple 'Exercise' (تمرین) related to the topic for the user to solve.",
  [StudyMode.VOCABULARY]: "Focus on the words the user is interested in. 1) Explain the meaning and usage. 2) Provide 3 example sentences. 3) End your response with a small 'Exercise' (تمرین) like a 'Fill in the blank' for the user to solve.",
  [StudyMode.WRITING]: "Help the user improve their written expression. Provide feedback on punctuation and structure. Guide them to rewrite their sentences more professionally."
};

export const generateTutorResponse = async (
  level: LanguageLevel,
  mode: StudyMode,
  chatHistory: Message[],
  userInput: string
) => {
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are an expert English Teacher at "Ghazal English School", specializing in the 'Top Notch' and 'Summit' book series.
    Level: ${LEVEL_PROMPTS[level]}.
    Current Mode: ${MODE_PROMPTS[mode]}.
    
    Structure your responses using Markdown for readability.
    Always be encouraging and professional. 
    If you are in Grammar or Vocabulary mode, remember to follow the (Explanation -> Examples -> Exercise) format.
  `;

  const contents = chatHistory.slice(-10).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: userInput }]
  });

  const response = await ai.models.generateContent({
    model: modelName,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text;
};

export const generateAudio = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this clearly: ${text}` }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
