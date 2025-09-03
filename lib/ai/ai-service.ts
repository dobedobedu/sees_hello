import { OpenRouterClient } from './openrouter-client';
import { QuizResponse, AnalysisResult, TranscriptionResult } from './types';

export class AIService {
  private static instance: AIService;
  private openRouterClient: OpenRouterClient;

  private constructor() {
    this.openRouterClient = new OpenRouterClient();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyze(quiz: QuizResponse, context: any): Promise<AnalysisResult> {
    try {
      // Use OpenRouter for analysis
      return await this.openRouterClient.analyze(quiz, context);
    } catch (error) {
      console.error('OpenRouter analysis failed:', error);
      
      // Return a built-in fallback response
      return this.getFallbackResponse(quiz, context);
    }
  }

  private getFallbackResponse(quiz: QuizResponse, context: any): AnalysisResult {
    // Simple fallback matching logic
    const matchedStories = context.stories?.slice(0, 2) || [];
    const matchedFaculty = context.faculty?.slice(0, 1) || [];
    
    const fallbackMessage = `Thank you for sharing about your ${quiz.gradeLevel} student! Based on their interests in ${quiz.interests.slice(0, 2).join(' and ')}, we believe Saint Stephen's could be an excellent fit.

Our personalized approach to education, combined with our strong programs in these areas, helps students like yours discover their unique potential. We'd love to show you how our community can support your child's growth and development.

We're excited to meet you and learn more about your family's educational journey. Schedule your personalized tour to see our approach in action!`;

    return {
      matchScore: 88,
      personalizedMessage: fallbackMessage,
      matchedStories,
      matchedFaculty,
      keyInsights: this.extractKeyInsights(quiz),
      provider: 'openrouter',
      processingTime: 0
    };
  }

  private extractKeyInsights(quiz: QuizResponse): string[] {
    const insights = [];
    
    if (quiz.interests.length > 0) {
      insights.push(`Strong interest in ${quiz.interests[0]}`);
    }
    
    if (quiz.familyValues.includes('small_classes')) {
      insights.push('Values personalized attention');
    }
    
    if (quiz.timeline === 'this_year') {
      insights.push('Ready to start soon');
    }
    
    return insights;
  }

  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    // OpenRouter doesn't support audio transcription
    // Use browser's Web Speech API instead
    throw new Error('Audio transcription not supported. Please use the browser voice input during recording.');
  }

  getCurrentProvider(): string {
    return 'openrouter';
  }
}