import { QuizResponse, AnalysisResult, TranscriptionResult } from './types';

export class OpenRouterClient {
  private apiKey: string | null;
  private baseURL: string;
  private model: string;

  constructor() {
    // Try to get API key from localStorage first (for client-side)
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('aiSettings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          this.apiKey = settings.openrouterKey || process.env.OPENROUTER_API_KEY || null;
        } catch {
          this.apiKey = process.env.OPENROUTER_API_KEY || null;
        }
      } else {
        this.apiKey = process.env.OPENROUTER_API_KEY || null;
      }
    } else {
      // Server-side: use environment variable
      this.apiKey = process.env.OPENROUTER_API_KEY || null;
    }
    
    this.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
    
    // Debug logging for production
    console.log('OpenRouter Client initialized:', {
      hasApiKey: !!this.apiKey,
      baseURL: this.baseURL,
      model: this.model,
      apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'not set',
      source: typeof window !== 'undefined' ? 'client' : 'server'
    });
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.log('OpenRouter API key not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('OpenRouter availability check failed:', error);
      return false;
    }
  }

  async analyze(quiz: QuizResponse, context: any): Promise<AnalysisResult> {
    console.log('🔍 OpenRouter analyze called with quiz:', quiz);
    
    if (!this.apiKey) {
      console.error('❌ OpenRouter API key not configured');
      throw new Error('OpenRouter API key not configured');
    }

    const prompt = this.buildAnalysisPrompt(quiz, context);
    console.log('📝 Prompt built, length:', prompt.length);

    try {
      console.log('🚀 Sending request to OpenRouter:', {
        url: `${this.baseURL}/chat/completions`,
        model: this.model,
        hasApiKey: !!this.apiKey
      });
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://visit.saintstephens.org',
          'X-Title': 'Saint Stephens Tour Matching',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert school counselor helping match prospective students with appropriate programs and mentors at Saint Stephen\'s Episcopal School. Provide personalized, encouraging responses based on the student\'s characteristics.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      console.log('📡 OpenRouter response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenRouter API error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ OpenRouter response received, has content:', !!data.choices?.[0]?.message?.content);
      
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content returned from OpenRouter API');
      }

      return this.parseAnalysisResponse(content, context);
    } catch (error) {
      console.error('❌ OpenRouter analysis error:', error);
      
      // Return fallback response
      return this.getFallbackAnalysis(quiz, context);
    }
  }

  async transcribe(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    // OpenRouter doesn't support audio transcription directly
    // For now, throw an error suggesting alternative methods
    throw new Error('Audio transcription not supported with OpenRouter. Please use the browser\'s built-in speech recognition or switch to text input.');
  }

  private buildAnalysisPrompt(quiz: QuizResponse, context: any): string {
    const { stories, faculty, facts } = context;
    
    // Format selected characteristics for the prompt
    const characteristics = (quiz.selectedCharacteristics || [])
      .map(id => this.formatCharacteristicForPrompt(id))
      .join(', ');

    return `
Analyze this prospective student profile and match them with relevant student stories and faculty at Saint Stephen's Episcopal School.

STUDENT PROFILE:
- Grade Level: ${quiz.gradeLevel}
- Selected Characteristics: ${characteristics || 'None specified'}
- Interests: ${(quiz.interests || []).join(', ') || 'None specified'}
- Family Values: ${(quiz.familyValues || []).join(', ') || 'None specified'}
- Timeline: ${quiz.timeline || 'Not specified'}
- Additional Notes: ${quiz.additionalNotes || 'None provided'}
- Parent Description: ${quiz.childDescription || 'None provided'}

AVAILABLE STUDENT STORIES:
${stories.slice(0, 10).map((story: any, idx: number) => 
  `${idx + 1}. ${story.firstName} (Grade ${story.grade}): ${story.achievement} - Interests: ${story.interests?.join(', ') || 'Not specified'}`
).join('\n')}

AVAILABLE FACULTY:
${faculty.slice(0, 10).map((f: any, idx: number) => 
  `${idx + 1}. ${f.firstName} ${f.lastName} - ${f.title} - Specializes in: ${f.subjects?.join(', ') || f.expertise || 'General education'}`
).join('\n')}

Please provide a JSON response with:
{
  "matchScore": number (0-100),
  "personalizedMessage": "encouraging message about why this is a great match",
  "matchedStoryIds": [array of 1-2 most relevant story indices],
  "matchedFacultyIds": [array of 1-2 most relevant faculty indices],
  "keyInsights": [array of 3-4 key strengths/interests],
  "recommendedPrograms": [array of 2-3 specific programs that would interest this student]
}

Focus on making genuine connections between the student's characteristics and the school's offerings. Be encouraging and specific.`;
  }

  private formatCharacteristicForPrompt(id: string): string {
    const labels: Record<string, string> = {
      'curious': 'naturally curious',
      'focused': 'strong focus',
      'creative': 'creative thinker',
      'analytical': 'analytical mind',
      'outgoing': 'outgoing and social',
      'thoughtful': 'thoughtful and considerate',
      'leader': 'natural leader',
      'collaborator': 'team player',
      'arts': 'interested in arts & creativity',
      'sports': 'enjoys sports & movement',
      'stem': 'passionate about science & technology',
      'service': 'values helping others',
      'hands-on': 'hands-on learner',
      'visual': 'visual learner',
      'discussion': 'learns through discussion',
      'independent': 'independent learner'
    };
    return labels[id] || id;
  }

  private parseAnalysisResponse(content: string, context: any): AnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const { stories, faculty } = context;

      // Map story and faculty IDs to actual objects
      const matchedStories = (parsed.matchedStoryIds || [])
        .map((id: number) => stories[id - 1])
        .filter(Boolean);

      const matchedFaculty = (parsed.matchedFacultyIds || [])
        .map((id: number) => faculty[id - 1])
        .filter(Boolean);

      return {
        matchScore: Math.min(Math.max(parsed.matchScore || 85, 0), 100),
        personalizedMessage: parsed.personalizedMessage || 'We\'re excited to learn more about your child and show you what makes Saint Stephen\'s special!',
        matchedStories: matchedStories.slice(0, 2),
        matchedFaculty: matchedFaculty.slice(0, 2),
        keyInsights: parsed.keyInsights || ['Academic Excellence', 'Character Development', 'Community Focus'],
        recommendedPrograms: parsed.recommendedPrograms || ['Liberal Arts', 'Athletics', 'Fine Arts']
      };
    } catch (error) {
      console.error('Error parsing OpenRouter response:', error);
      return this.getFallbackAnalysis({} as QuizResponse, context);
    }
  }

  private getFallbackAnalysis(quiz: QuizResponse, context: any): AnalysisResult {
    const { stories, faculty } = context;
    
    return {
      matchScore: 88,
      personalizedMessage: "Based on your responses, we believe Saint Stephen's could be an excellent fit! Our personalized approach to education and strong community values align perfectly with what you're looking for in a school.",
      matchedStories: stories.slice(0, 2),
      matchedFaculty: faculty.slice(0, 2),
      keyInsights: ['Academic Excellence', 'Character Development', 'Community Engagement', 'Individual Attention'],
      recommendedPrograms: ['College Preparatory Program', 'Fine Arts', 'Athletics']
    };
  }
}