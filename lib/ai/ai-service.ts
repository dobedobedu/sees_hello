import { LMStudioClient } from './lmstudio-client';
import { OpenAIClient } from './openai-client';
import { GroqClient } from './groq-client';
import { OpenRouterClient } from './openrouter-client';
import { QuizResponse, AnalysisResult, TranscriptionResult } from './types';

export class AIService {
  private static instance: AIService;
  private provider: 'openrouter' | 'openai' | 'groq' | 'lmstudio' = 'lmstudio';

  private constructor() {
    // Load settings from localStorage
    this.loadSettings();
  }
  
  // Create clients on demand to ensure they have latest settings
  private getOpenRouterClient(): OpenRouterClient {
    return new OpenRouterClient();
  }
  
  private getLMStudioClient(): LMStudioClient {
    return new LMStudioClient();
  }
  
  private getOpenAIClient(): OpenAIClient {
    return new OpenAIClient();
  }
  
  private getGroqClient(): GroqClient {
    return new GroqClient();
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
    // Try OpenRouter first (primary provider for production)
    const openrouterClient = this.getOpenRouterClient();
    const openrouterAvailable = await openrouterClient.isAvailable();
    if (openrouterAvailable) {
      try {
        return await openrouterClient.analyze(quiz, context);
      } catch (error) {
        console.warn('OpenRouter analysis failed, trying fallback:', error);
      }
    }

    // Fallback to LMStudio if available (local development)
    const lmstudioClient = this.getLMStudioClient();
    const lmstudioAvailable = await lmstudioClient.isAvailable();
    if (lmstudioAvailable) {
      try {
        return await lmstudioClient.analyze(quiz, context);
      } catch (error) {
        console.warn('LMStudio analysis failed:', error);
      }
    }

    // Final fallback - use LMStudio's built-in fallback response
    console.warn('No AI providers available, using built-in fallback response');
    return lmstudioClient.analyze(quiz, context);
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
    
    // For API-based transcription, check which provider is configured

    // Use API-based transcription
    switch (this.provider) {
      case 'openrouter':
        // OpenRouter doesn't support audio transcription, use browser instead
        return this.useBrowserSpeechRecognition(audioBlob);
      case 'openai':
        const openaiClient = this.getOpenAIClient();
        const openaiAvailable = await openaiClient.isAvailable();
        if (openaiAvailable) {
          return openaiClient.transcribe(audioBlob);
        }
        throw new Error('OpenAI not configured. Please add your API key in the admin panel.');
        
      case 'groq':
        const groqClient = this.getGroqClient();
        const groqAvailable = await groqClient.isAvailable();
        if (groqAvailable) {
          return groqClient.transcribe(audioBlob);
        }
        throw new Error('Groq not configured. Please add your API key in the admin panel.');
        
      default:
        throw new Error('LMStudio does not support audio transcription. Please use OpenAI or Groq.');
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