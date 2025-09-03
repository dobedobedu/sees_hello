#!/usr/bin/env node

import storiesData from '../knowledge/stories.json';
import facultyData from '../knowledge/faculty.json';
import factsData from '../knowledge/facts.json';

console.log('📚 Knowledge Base Analysis\n');

// Analyze stories
console.log('📖 Student Stories Analysis:');
console.log(`Total stories: ${storiesData.stories.length}`);

const gradeDistribution: Record<string, number> = {};
const interestFrequency: Record<string, number> = {};

storiesData.stories.forEach(story => {
  // Grade distribution
  const grade = story.gradeLevel || 'unspecified';
  gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
  
  // Interest frequency
  story.interests.forEach(interest => {
    interestFrequency[interest] = (interestFrequency[interest] || 0) + 1;
  });
});

console.log('\nGrade Level Distribution:');
Object.entries(gradeDistribution).forEach(([grade, count]) => {
  console.log(`  ${grade}: ${count} stories`);
});

console.log('\nTop 10 Most Common Interests:');
Object.entries(interestFrequency)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([interest, count]) => {
    console.log(`  ${interest}: ${count} stories`);
  });

// Analyze faculty
console.log('\n\n👨‍🏫 Faculty Analysis:');
console.log(`Total faculty: ${facultyData.faculty.length}`);

const specializationFrequency: Record<string, number> = {};
facultyData.faculty.forEach(faculty => {
  faculty.specializesIn.forEach(spec => {
    specializationFrequency[spec] = (specializationFrequency[spec] || 0) + 1;
  });
});

console.log('\nFaculty Specializations:');
Object.entries(specializationFrequency)
  .sort((a, b) => b[1] - a[1])
  .forEach(([spec, count]) => {
    console.log(`  ${spec}: ${count} faculty`);
  });

// Analyze facts
console.log('\n\n📊 Facts Analysis:');
console.log(`Total facts: ${factsData.facts.length}`);

const factCategories: Record<string, number> = {};
factsData.facts.forEach(fact => {
  const category = fact.category || 'general';
  factCategories[category] = (factCategories[category] || 0) + 1;
});

console.log('\nFact Categories:');
Object.entries(factCategories).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} facts`);
});

// Coverage analysis
console.log('\n\n🔍 Coverage Analysis:');

// Quiz interests that might not have good matches
const quizInterests = [
  'play', 'arts', 'music', 'nature', 'building', 'stories', 'movement', 'friends',
  'science', 'sports', 'technology', 'reading', 'athletics', 'languages', 'writing',
  'service', 'drama', 'leadership', 'stem', 'literature', 'business', 'media', 
  'debate', 'environment'
];

console.log('\nQuiz Interest Coverage in Stories:');
quizInterests.forEach(interest => {
  const matchCount = storiesData.stories.filter(s => 
    s.interests.some(si => si.toLowerCase().includes(interest.toLowerCase()))
  ).length;
  const coverage = (matchCount / storiesData.stories.length * 100).toFixed(1);
  console.log(`  ${interest}: ${matchCount} stories (${coverage}%)`);
});

// Identify potential gaps
console.log('\n\n⚠️  Potential Gaps:');
const lowCoverageInterests = quizInterests.filter(interest => {
  const matchCount = storiesData.stories.filter(s => 
    s.interests.some(si => si.toLowerCase().includes(interest.toLowerCase()))
  ).length;
  return matchCount < 2;
});

if (lowCoverageInterests.length > 0) {
  console.log('Interests with low story coverage:');
  lowCoverageInterests.forEach(interest => {
    console.log(`  - ${interest}`);
  });
} else {
  console.log('✅ All quiz interests have adequate story coverage');
}

// Check for missing data
console.log('\n\n🔎 Data Quality Check:');
const storiesWithoutGradeLevel = storiesData.stories.filter(s => !s.gradeLevel).length;
const storiesWithoutParentQuote = storiesData.stories.filter(s => !s.parentQuote).length;
const facultyWithoutBio = facultyData.faculty.filter(f => !(f as any).bio).length;

console.log(`Stories without grade level: ${storiesWithoutGradeLevel}`);
console.log(`Stories without parent quote: ${storiesWithoutParentQuote}`);
console.log(`Faculty without bio: ${facultyWithoutBio}`);

console.log('\n✨ Analysis Complete!');