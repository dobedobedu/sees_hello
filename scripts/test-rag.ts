#!/usr/bin/env node

import { LMStudioClient } from '../lib/ai/lmstudio-client';
import { QuizResponse } from '../lib/ai/types';
import alumniData from '../knowledge/alumni-stories.json';
import facultyData from '../knowledge/faculty.json';
import factsData from '../knowledge/facts.json';

// Test scenarios
const testCases: { name: string; quiz: QuizResponse }[] = [
  {
    name: 'Athletic High Schooler',
    quiz: {
      gradeLevel: 'high',
      currentSituation: 'seeking_change',
      interests: ['athletics', 'leadership', 'service'],
      familyValues: ['character_building', 'academic_excellence'],
      timeline: 'next_fall',
      childDescription: 'Star tennis player who also loves volunteering'
    }
  },
  {
    name: 'Creative Middle Schooler',
    quiz: {
      gradeLevel: 'middle',
      currentSituation: 'new_to_area',
      interests: ['arts', 'music', 'drama'],
      familyValues: ['small_classes', 'safe_environment'],
      timeline: 'this_year',
      childDescription: 'Creative kid who loves painting and playing piano'
    }
  },
  {
    name: 'STEM-focused Elementary',
    quiz: {
      gradeLevel: 'elementary',
      currentSituation: 'exploring_options',
      interests: ['science', 'building', 'technology'],
      familyValues: ['innovation', 'academic_excellence'],
      timeline: 'next_fall',
      childDescription: 'Loves robotics and asking how things work'
    }
  },
  {
    name: 'Marine Science Enthusiast',
    quiz: {
      gradeLevel: 'high',
      currentSituation: 'seeking_change',
      interests: ['science', 'nature', 'environment'],
      familyValues: ['academic_excellence', 'global_perspective'],
      timeline: 'this_year',
      childDescription: 'Passionate about marine biology and ocean conservation'
    }
  }
];

async function runTests() {
  console.log('🧪 Testing RAG System Accuracy\n');
  
  const client = new LMStudioClient();
  const context = {
    stories: alumniData.stories as any[],
    faculty: facultyData.faculty as any[],
    facts: factsData.facts as any[]
  };

  // Check if LMStudio is available
  const isAvailable = await client.isAvailable();
  console.log(`📡 LMStudio Available: ${isAvailable ? '✅ Yes' : '❌ No'}\n`);

  for (const testCase of testCases) {
    console.log(`\n📋 Test Case: ${testCase.name}`);
    console.log('━'.repeat(50));
    
    try {
      const startTime = Date.now();
      const result = await client.analyze(testCase.quiz, context);
      const duration = Date.now() - startTime;

      console.log(`\n📊 Results:`);
      console.log(`  Match Score: ${result.matchScore}%`);
      console.log(`  Processing Time: ${duration}ms`);
      console.log(`  Provider: ${result.provider}`);
      
      console.log(`\n👥 Matched Stories (${result.matchedStories.length}):`);
      result.matchedStories.forEach((story, i) => {
        console.log(`  ${i + 1}. ${story.firstName} - ${story.storyTldr}`);
        console.log(`     Interests: ${story.interests.join(', ')}`);
        console.log(`     Match reason: Common interests with ${testCase.quiz.interests.filter(qi => 
          story.interests.some(si => si.toLowerCase().includes(qi.toLowerCase()))
        ).join(', ')}`);
      });

      console.log(`\n👨‍🏫 Matched Faculty (${result.matchedFaculty.length}):`);
      result.matchedFaculty.forEach((faculty, i) => {
        console.log(`  ${i + 1}. ${faculty.firstName} ${faculty.lastName} - ${faculty.title}`);
        console.log(`     Specializes in: ${faculty.specializesIn.join(', ')}`);
      });

      console.log(`\n💡 Key Insights:`);
      result.keyInsights.forEach(insight => {
        console.log(`  • ${insight}`);
      });

      console.log(`\n📝 Personalized Message Preview:`);
      console.log(`  "${result.personalizedMessage.substring(0, 150)}..."`);

      // Validate match quality
      console.log(`\n✅ Validation:`);
      const hasRelevantStory = result.matchedStories.some(s => 
        s.interests.some(si => testCase.quiz.interests.some(qi => 
          si.toLowerCase().includes(qi.toLowerCase())
        ))
      );
      console.log(`  Relevant story match: ${hasRelevantStory ? '✅' : '⚠️'}`);
      
      const hasRelevantFaculty = result.matchedFaculty.some(f =>
        f.specializesIn.some(spec => testCase.quiz.interests.some(qi =>
          spec.toLowerCase().includes(qi.toLowerCase())
        ))
      );
      console.log(`  Relevant faculty match: ${hasRelevantFaculty ? '✅' : '⚠️'}`);
      
      console.log(`  Score in expected range (70-95): ${
        result.matchScore >= 70 && result.matchScore <= 95 ? '✅' : '❌'
      }`);

    } catch (error) {
      console.error(`\n❌ Error: ${error}`);
    }
  }

  // Summary statistics
  console.log('\n\n📈 RAG System Summary');
  console.log('━'.repeat(50));
  console.log(`Total test cases: ${testCases.length}`);
  console.log(`Total stories in knowledge base: ${context.stories.length}`);
  console.log(`Total faculty in knowledge base: ${context.faculty.length}`);
  console.log(`Total facts in knowledge base: ${context.facts.length}`);
  
  // Check for common issues
  console.log('\n⚠️  Potential Issues to Check:');
  console.log('1. Grade level mapping between quiz and stories');
  console.log('2. Interest keyword variations (e.g., "athletics" vs "sports")');
  console.log('3. Faculty specialization coverage for all interests');
  console.log('4. Story distribution across grade levels');
}

// Run the tests
runTests().catch(console.error);