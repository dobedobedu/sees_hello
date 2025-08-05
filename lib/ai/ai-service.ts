import { LMStudioClient } from './lmstudio-client';
import { OpenAIClient } from './openai-client';
import { GroqClient } from './groq-client';
import { QuizResponse, AnalysisResult, TranscriptionResult } from './types';

export class AIService {
  private static instance: AIService;
  private provider: 'openai' | 'groq' | 'lmstudio' = 'lmstudio';
  private lmstudioClient: LMStudioClient;
  private openaiClient: OpenAIClient;
  private groqClient: GroqClient;

  private constructor() {
    this.lmstudioClient = new LMStudioClient();
    this.openaiClient = new OpenAIClient();
    this.groqClient = new GroqClient();
    
    // Load settings from localStorage
    this.loadSettings();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private loadSettings() {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('aiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.provider = settings.aiProvider || 'lmstudio';
      }
    }
  }

  async analyze(quiz: QuizResponse, context: any): Promise<AnalysisResult> {
    // Always use LMStudio for analysis if available (it's local and free)
    const lmstudioAvailable = await this.lmstudioClient.isAvailable();
    if (lmstudioAvailable) {
      return this.lmstudioClient.analyze(quiz, context);
    }

    // Fallback to other providers
    switch (this.provider) {
      case 'openai':
        // You could implement OpenAI-based analysis here
        throw new Error('OpenAI analysis not implemented yet');
      case 'groq':
        // You could implement Groq-based analysis here
        throw new Error('Groq analysis not implemented yet');
      default:
        // Return a basic fallback response
        return this.lmstudioClient.analyze(quiz, context);
    }
  }

  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    // Load current settings
    this.loadSettings();
    
    const savedSettings = localStorage.getItem('aiSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    
    // Check voice settings
    if (!settings.voiceEnabled) {
      throw new Error('Voice input is disabled');
    }

    if (settings.voiceProvider === 'browser') {
      // Use browser's built-in speech recognition
      return this.useBrowserSpeechRecognition(audioBlob);
    }

    // Use API-based transcription
    switch (this.provider) {
      case 'openai':
        const openaiAvailable = await this.openaiClient.isAvailable();
        if (openaiAvailable) {
          return this.openaiClient.transcribe(audioBlob);
        }
        throw new Error('OpenAI not configured');
        
      case 'groq':
        const groqAvailable = await this.groqClient.isAvailable();
        if (groqAvailable) {
          return this.groqClient.transcribe(audioBlob);
        }
        throw new Error('Groq not configured');
        
      default:
        throw new Error('No transcription service available for LMStudio');
    }
  }

  private async useBrowserSpeechRecognition(audioBlob: Blob): Promise<TranscriptionResult> {
    // This is a placeholder - browser speech recognition doesn't work with audio blobs
    // In practice, you'd need to use the Web Speech API directly during recording
    throw new Error('Browser speech recognition must be used during recording, not after');
  }

  getCurrentProvider(): string {
    return this.provider;
  }

  setProvider(provider: 'openai' | 'groq' | 'lmstudio') {
    this.provider = provider;
  }
}