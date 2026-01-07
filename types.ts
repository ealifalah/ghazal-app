
export enum LanguageLevel {
  B = 'Beginner (Top Notch Fundamentals)',
  E = 'Elementary (Top Notch 1)',
  PI = 'Pre-Intermediate (Top Notch 2)',
  I = 'Intermediate (Top Notch 3)',
  UI = 'Upper-Intermediate (Summit 1)',
  ADV = 'Advanced (Summit 2)'
}

export enum StudyMode {
  GENERAL = 'General',
  SPEAKING = 'Speaking',
  GRAMMAR = 'Grammar',
  VOCABULARY = 'Vocabulary',
  WRITING = 'Writing'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
