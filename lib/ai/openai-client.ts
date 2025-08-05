import OpenAI from 'openai';
import { TranscriptionResult } from './types';

export class OpenAIClient {
  private client: OpenAI | null = null;

  constructor() {
    // Try to get API key from localStorage first (admin panel settings)
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('aiSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.openaiKey) {
          this.client = new OpenAI({
            apiKey: settings.openaiKey,
            dangerouslyAllowBrowser: true
          });
          return;
        }
      }
    }
    
    // Fallback to environment variable
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({
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
      throw new Error('OpenAI client not initialized. Please set NEXT_PUBLIC_OPENAI_API_KEY');
    }

    const startTime = Date.now();

    try {
      // Convert blob to File object as required by OpenAI SDK
      const audioFile = new File([audioBlob], 'audio.webm', {
        type: audioBlob.type || 'audio/webm'
      });

      // Use Whisper API for transcription
      const transcription = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en',
        response_format: 'json'
      });

      return {
        text: transcription.text,
        confidence: 0.95, // Whisper doesn't provide confidence scores
        provider: 'openai',
        duration: Date.now() - startTime
      };
    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  // Alternative method using the new audio model for more advanced processing
  async transcribeWithGPT4Audio(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please set NEXT_PUBLIC_OPENAI_API_KEY');
    }

    const startTime = Date.now();

    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Use the GPT-4 audio preview model
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-audio-preview-2025-06-03',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please transcribe this audio recording of a parent describing their child for a school application. Focus on capturing the key details about the child\'s personality, interests, and needs.'
              },
              {
                type: 'input_audio',
                input_audio: {
                  data: base64Audio,
                  format: 'webm'
                }
              }
            ]
          }
        ],
        max_tokens: 500
      });

      const transcribedText = response.choices[0].message.content || '';

      return {
        text: transcribedText,
        confidence: 0.98, // GPT-4 audio typically has high accuracy
        provider: 'openai',
        duration: Date.now() - startTime
      };
    } catch (error) {
      console.error('OpenAI GPT-4 Audio transcription error:', error);
      // Fallback to regular Whisper if GPT-4 audio fails
      return this.transcribe(audioBlob);
    }
  }
}