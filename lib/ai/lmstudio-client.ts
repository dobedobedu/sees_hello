import { AnalysisResult, QuizResponse, RAGContext, StudentStory, FacultyProfile } from './types';

interface AlumniStory {
  id: string;
  firstName: string;
  lastName?: string;
  classYear: string;
  interests: string[];
  achievement: string;
  currentRole: string;
  storyTldr: string;
  quote?: string;
}

export class LMStudioClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:1234/v1') {
    this.baseUrl = baseUrl;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async analyze(quiz: QuizResponse, context: RAGContext): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    // Find matching stories and faculty
    const matchedStories = this.findMatchingStories(quiz, context.stories);
    const matchedFaculty = this.findMatchingFaculty(quiz, context.faculty);
    const relevantFacts = this.findRelevantFacts(quiz.gradeLevel, context.facts);
    
    // Build prompt for LMStudio
    const prompt = this.buildPrompt(quiz, matchedStories, matchedFaculty, relevantFacts);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are an admissions counselor for Saint Stephen\'s Episcopal School. Create warm, personalized messages that connect families with specific student success stories and faculty members.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const message = data.choices[0].message.content;
      
      return {
        matchScore: this.calculateMatchScore(quiz, matchedStories, matchedFaculty),
        personalizedMessage: message,
        matchedStories: matchedStories.slice(0, 2),
        matchedFaculty: matchedFaculty.slice(0, 1),
        keyInsights: this.extractKeyInsights(quiz),
        provider: 'lmstudio',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('LMStudio analysis failed:', error);
      // Return fallback response
      return this.getFallbackResponse(quiz, matchedStories, matchedFaculty);
    }
  }

  private findMatchingStories(quiz: QuizResponse, stories: StudentStory[]): StudentStory[] {
    return stories
      .map(story => ({
        story,
        score: this.calculateStoryScore(quiz, story)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.story);
  }

  private calculateStoryScore(quiz: QuizResponse, story: StudentStory): number {
    let score = 0;
    
    // Interest overlap
    const commonInterests = story.interests.filter(i => 
      quiz.interests.some(qi => qi.toLowerCase().includes(i.toLowerCase()))
    );
    score += commonInterests.length * 20;
    
    // Grade level match
    if (story.gradeLevel === quiz.gradeLevel) {
      score += 30;
    }
    
    // Description keyword matching
    const descWords = quiz.childDescription.toLowerCase().split(' ');
    const storyWords = story.storyTldr.toLowerCase().split(' ');
    const commonWords = descWords.filter(w => storyWords.includes(w));
    score += commonWords.length * 5;
    
    return score;
  }

  private findMatchingFaculty(quiz: QuizResponse, faculty: FacultyProfile[]): FacultyProfile[] {
    return faculty
      .map(f => ({
        faculty: f,
        score: this.calculateFacultyScore(quiz, f)
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.faculty);
  }

  private calculateFacultyScore(quiz: QuizResponse, faculty: FacultyProfile): number {
    let score = 0;
    
    // Specialization overlap with interests
    const commonAreas = faculty.specializesIn.filter(s =>
      quiz.interests.some(i => i.toLowerCase().includes(s.toLowerCase()))
    );
    score += commonAreas.length * 25;
    
    // Family values alignment
    if (quiz.familyValues.includes('small_classes') || quiz.familyValues.includes('mentorship')) {
      score += 20;
    }
    
    return score;
  }

  private findRelevantFacts(gradeLevel: string, facts: any[]): any[] {
    return facts.filter(f => f.gradeLevel === gradeLevel || f.gradeLevel === 'all');
  }

  private calculateMatchScore(quiz: QuizResponse, stories: StudentStory[], faculty: FacultyProfile[]): number {
    // Always return between 70-95 for psychological effect
    const baseScore = 70;
    const storyBonus = Math.min(stories.length * 5, 15);
    const facultyBonus = Math.min(faculty.length * 5, 10);
    return Math.min(baseScore + storyBonus + facultyBonus, 95);
  }

  private buildPrompt(
    quiz: QuizResponse, 
    stories: StudentStory[], 
    faculty: FacultyProfile[],
    facts: any[]
  ): string {
    return `
Create a warm, personalized message for a parent considering Saint Stephen's for their ${quiz.gradeLevel} student.

Parent's Description: "${quiz.childDescription}"
Child's Interests: ${quiz.interests.join(', ')}
Family Values: ${quiz.familyValues.join(', ')}
Timeline: ${quiz.timeline}

Matched Student Story:
${stories[0] ? `${stories[0].firstName}'s story: ${stories[0].storyTldr}
Achievement: ${stories[0].achievement}` : 'No specific match yet'}

Matched Faculty:
${faculty[0] ? `${faculty[0].firstName}, ${faculty[0].title}
Why students love them: ${faculty[0].whyStudentsLoveThem}` : 'Our dedicated faculty'}

Write a 2-3 paragraph message that:
1. Acknowledges what makes their child unique (use their exact words when possible)
2. Connects them to the specific student story or faculty member
3. Ends with excitement about meeting them on a tour

Keep it conversational, warm, and specific. Avoid generic education jargon.`;
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

  private getFallbackResponse(
    quiz: QuizResponse,
    stories: StudentStory[],
    faculty: FacultyProfile[]
  ): AnalysisResult {
    const fallbackMessage = `
Thank you for sharing about your ${quiz.gradeLevel === 'elementary' ? 'elementary' : quiz.gradeLevel} student! 
Based on what you've told us about their interests in ${quiz.interests.slice(0, 2).join(' and ')}, 
we believe Saint Stephen's could be an excellent fit.

Our personalized approach to education, combined with our strong programs in these areas, 
helps students like yours discover their unique potential. We'd love to show you how our 
community can support your child's growth and development.

We're excited to meet you and learn more about your family's educational journey. 
Schedule your personalized tour to see our approach in action!
    `.trim();

    return {
      matchScore: 85,
      personalizedMessage: fallbackMessage,
      matchedStories: stories.slice(0, 2),
      matchedFaculty: faculty.slice(0, 1),
      keyInsights: this.extractKeyInsights(quiz),
      provider: 'lmstudio',
      processingTime: 0
    };
  }
}