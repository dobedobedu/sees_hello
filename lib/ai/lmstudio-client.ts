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
      // Use API route to avoid CORS issues
      const response = await fetch(`/api/lmstudio?endpoint=models&baseUrl=${encodeURIComponent(this.baseUrl)}`);
      const data = await response.json();
      return data.success;
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
      const requestBody = {
        messages: [
          { 
            role: 'system', 
            content: 'You are an admissions counselor for Saint Stephen\'s Episcopal School. Create warm, personalized messages that connect families with specific student success stories and faculty members.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      };
      
      console.log('Sending to LMStudio:', { 
        url: `${this.baseUrl}/chat/completions`,
        hasMessages: !!requestBody.messages,
        messageCount: requestBody.messages.length 
      });
      
      const response = await fetch(`/api/lmstudio?endpoint=chat/completions&baseUrl=${encodeURIComponent(this.baseUrl)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('LMStudio error response:', errorData);
        throw new Error(errorData.error || 'LMStudio request failed');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'LMStudio request failed');
      }
      
      const data = result.data;
      const message = data.choices?.[0]?.message?.content || 'Unable to generate personalized message';
      
      // Limit total cards to 3 max
      const storyCount = Math.min(matchedStories.length, 2);
      const facultyCount = Math.min(matchedFaculty.length, 3 - storyCount);
      
      return {
        matchScore: this.calculateMatchScore(quiz, matchedStories, matchedFaculty),
        personalizedMessage: message,
        matchedStories: matchedStories.slice(0, storyCount),
        matchedFaculty: matchedFaculty.slice(0, facultyCount),
        keyInsights: this.extractKeyInsights(quiz),
        provider: 'lmstudio',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('LMStudio analysis failed, using fallback:', error);
      // Return fallback response with properly matched stories
      return this.getFallbackResponse(quiz, matchedStories, matchedFaculty);
    }
  }

  private findMatchingStories(quiz: QuizResponse, stories: StudentStory[]): StudentStory[] {
    const scoredStories = stories
      .map(story => ({
        story,
        score: this.calculateStoryScore(quiz, story)
      }))
      .sort((a, b) => b.score - a.score);
    
    const topStories = scoredStories.slice(0, 3).map(item => item.story);
    
    console.log('Quiz interests:', quiz.interests);
    console.log('All story scores:', scoredStories.map(s => ({
      id: s.story.id,
      firstName: s.story.firstName,
      interests: s.story.interests,
      score: s.score
    })));
    console.log('Top matched stories:', topStories.map(s => ({
      id: s.id,
      firstName: s.firstName,
      interests: s.interests,
      score: scoredStories.find(sc => sc.story.id === s.id)?.score
    })));
    
    return topStories;
  }

  private calculateStoryScore(quiz: QuizResponse, story: StudentStory): number {
    let score = 0;
    
    // Interest overlap - check both ways for better matching
    const commonInterests = story.interests.filter(i => 
      quiz.interests.some(qi => {
        const storyInterest = i.toLowerCase();
        const quizInterest = qi.toLowerCase();
        // Check if interests match or are related
        return storyInterest.includes(quizInterest) || 
               quizInterest.includes(storyInterest) ||
               // Add some common mappings
               (quizInterest === 'stem' && (storyInterest.includes('science') || storyInterest.includes('tech') || storyInterest.includes('engineering'))) ||
               (quizInterest === 'technology' && (storyInterest.includes('tech') || storyInterest.includes('coding') || storyInterest.includes('innovation'))) ||
               (quizInterest === 'business' && storyInterest.includes('entrepreneurship')) ||
               (quizInterest === 'athletics' && storyInterest.includes('sport'))
      })
    );
    score += commonInterests.length * 25;
    
    // Grade level match - map quiz levels to story levels
    if (story.gradeLevel) {
      const gradeLevelMap: { [key: string]: string[] } = {
        'lower': ['prek-k', 'elementary'],
        'intermediate': ['elementary'],
        'middle': ['middle'],
        'high': ['high']
      };
      
      // Check if the story's grade level matches any of the mapped quiz levels
      const matchesGradeLevel = Object.entries(gradeLevelMap).some(([storyLevel, quizLevels]) => {
        return story.gradeLevel === storyLevel && quizLevels.includes(quiz.gradeLevel);
      });
      
      if (matchesGradeLevel) {
        score += 30;
      }
    }
    
    // Description keyword matching
    const descWords = quiz.childDescription.toLowerCase().split(' ');
    const storyWords = story.storyTldr.toLowerCase().split(' ');
    const commonWords = descWords.filter(w => storyWords.includes(w));
    score += commonWords.length * 5;
    
    return score;
  }

  private findMatchingFaculty(quiz: QuizResponse, faculty: FacultyProfile[]): FacultyProfile[] {
    // Filter out administrators and prioritize teachers with videos
    const teachers = faculty.filter(f => !f.isAdministrator);
    const teachersWithVideos = teachers.filter(f => f.videoUrl);
    const teachersWithoutVideos = teachers.filter(f => !f.videoUrl);
    
    // Score and sort teachers with videos
    const scoredWithVideos = teachersWithVideos
      .map(f => ({
        faculty: f,
        score: this.calculateFacultyScore(quiz, f) + 50 // Bonus for having video
      }))
      .sort((a, b) => b.score - a.score);
    
    // Score and sort teachers without videos
    const scoredWithoutVideos = teachersWithoutVideos
      .map(f => ({
        faculty: f,
        score: this.calculateFacultyScore(quiz, f)
      }))
      .sort((a, b) => b.score - a.score);
    
    // Combine results, ensuring at least one with video is included
    const results = [];
    
    // Always include at least one teacher with video if available
    if (scoredWithVideos.length > 0) {
      results.push(scoredWithVideos[0].faculty);
    }
    
    // Add more matches, alternating between video/no-video if possible
    let videoIndex = 1;
    let noVideoIndex = 0;
    
    while (results.length < 3 && (videoIndex < scoredWithVideos.length || noVideoIndex < scoredWithoutVideos.length)) {
      if (videoIndex < scoredWithVideos.length) {
        results.push(scoredWithVideos[videoIndex].faculty);
        videoIndex++;
      }
      if (results.length < 3 && noVideoIndex < scoredWithoutVideos.length) {
        results.push(scoredWithoutVideos[noVideoIndex].faculty);
        noVideoIndex++;
      }
    }
    
    return results;
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
Thank you for sharing about your ${quiz.gradeLevel === 'prek-k' ? 'Pre-K/Kindergarten' : quiz.gradeLevel === 'elementary' ? 'Elementary School' : quiz.gradeLevel === 'middle' ? 'Middle School' : 'High School'} student! 
Based on what you've told us about their interests in ${quiz.interests.slice(0, 2).join(' and ')}, 
we believe Saint Stephen's could be an excellent fit.

Our personalized approach to education, combined with our strong programs in these areas, 
helps students like yours discover their unique potential. We'd love to show you how our 
community can support your child's growth and development.

We're excited to meet you and learn more about your family's educational journey. 
Schedule your personalized tour to see our approach in action!
    `.trim();

    // Limit total cards to 3 max
    const storyCount = Math.min(stories.length, 2);
    const facultyCount = Math.min(faculty.length, 3 - storyCount);
    
    return {
      matchScore: 85,
      personalizedMessage: fallbackMessage,
      matchedStories: stories.slice(0, storyCount),
      matchedFaculty: faculty.slice(0, facultyCount),
      keyInsights: this.extractKeyInsights(quiz),
      provider: 'lmstudio',  // Fallback response from LMStudio client
      processingTime: 0
    };
  }
}