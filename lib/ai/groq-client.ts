import Groq from 'groq-sdk';
import { TranscriptionResult } from './types';

export class GroqClient {
  private client: Groq | null = null;

  constructor() {
    // Try to get API key from localStorage first (admin panel settings)
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('aiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.groqKey) {
          this.client = new Groq({
            apiKey: settings.groqKey,
            dangerouslyAllowBrowser: true
          });
          return;
        }
      }
    }
    
    // Fallback to environment variable
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (apiKey) {
      this.client = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.client;
  }

  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.client) {
      throw new Error('Groq client not initialized. Please set NEXT_PUBLIC_GROQ_API_KEY');
    }

    const startTime = Date.now();

    try {
      // Convert blob to File object as required by Groq SDK
      const audioFile = new File([audioBlob], 'audio.webm', {
        type: audioBlob.type || 'audio/webm'
      });

      const transcription = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-large-v3',
        language: 'en',
        response_format: 'json'
      });

      return {
        text: transcription.text,
        confidence: 0.95, // Whisper doesn't provide confidence scores
        provider: 'groq',
        duration: Date.now() - startTime
      };
    } catch (error) {
      console.error('Groq transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }
}