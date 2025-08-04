export interface TranscriptionResult {
  text: string;
  confidence?: number;
  provider: 'groq' | 'openai' | 'webSpeech';
  duration?: number;
}

export interface AnalysisResult {
  matchScore: number;
  personalizedMessage: string;
  matchedStories: StudentStory[];
  matchedFaculty: FacultyProfile[];
  keyInsights: string[];
  provider: 'lmstudio' | 'openai' | 'claude';
  processingTime?: number;
}

export interface StudentStory {
  id: string;
  firstName: string;
  photoUrl?: string;
  interests: string[];
  storyTldr: string;
  achievement: string;
  parentQuote?: string;
  studentQuote?: string;
  gradeLevel?: string;
}

export interface FacultyProfile {
  id: string;
  firstName: string;
  title: string;
  photoUrl?: string;
  specializesIn: string[];
  whyStudentsLoveThem: string;
  department?: string;
}

export interface SchoolFact {
  id: string;
  gradeLevel: string;
  fact: string;
  context: string;
  category?: string;
}

export interface QuizResponse {
  gradeLevel: 'prek-k' | 'elementary' | 'middle' | 'high';
  currentSituation: string;
  interests: string[];
  familyValues: string[];
  timeline: string;
  childDescription: string;
  voiceTranscript?: string;
}

export interface AIProvider {
  name: string;
  analyze(quiz: QuizResponse, context: RAGContext): Promise<AnalysisResult>;
  transcribe?(audio: Blob): Promise<TranscriptionResult>;
  isAvailable(): Promise<boolean>;
}

export interface RAGContext {
  stories: StudentStory[];
  faculty: FacultyProfile[];
  facts: SchoolFact[];
}

export interface ModelConfig {
  provider: 'lmstudio' | 'openai' | 'groq' | 'claude';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface PerformanceMetrics {
  provider: string;
  requestTime: number;
  tokenCount?: number;
  cost?: number;
  quality?: number;
  timestamp: Date;
}