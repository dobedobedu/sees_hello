'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Calendar, ArrowRight, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LMStudioClient } from '@/lib/ai/lmstudio-client';
import { QuizResponse, AnalysisResult } from '@/lib/ai/types';
import storiesData from '@/knowledge/stories.json';
import facultyData from '@/knowledge/faculty.json';
import factsData from '@/knowledge/facts.json';
import alumniData from '@/knowledge/alumni.json';

export default function ResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyzeQuizData = async () => {
      try {
        // Get quiz data from sessionStorage
        const quizDataStr = sessionStorage.getItem('quizComplete');
        if (!quizDataStr) {
          router.push('/quiz');
          return;
        }

        const quizData: QuizResponse = JSON.parse(quizDataStr);
        
        // Initialize LMStudio client
        const client = new LMStudioClient();
        
        // Perform analysis
        const analysisResult = await client.analyze(quizData, {
          stories: storiesData.stories as any[],
          faculty: facultyData.faculty as any[],
          facts: factsData.facts as any[]
        });

        console.log('Analysis result:', {
          storiesCount: analysisResult.matchedStories.length,
          stories: analysisResult.matchedStories.map(s => ({ 
            firstName: s.firstName, 
            id: s.id 
          }))
        });

        setResults(analysisResult);
      } catch (err) {
        console.error('Analysis failed:', err);
        setError('Unable to complete analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeQuizData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-[#004b34] rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-[#004b34] rounded-full w-20 h-20 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Responses</h2>
          <p className="text-gray-600">Finding the perfect matches for your child...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load results'}</p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-6 py-3 bg-[#003825] text-white rounded-md hover:bg-[#004b34] transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 bg-[#004b34]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center text-white hover:text-white/80 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </div>
      </header>

      {/* Results Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Match Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#d4a017]/20 text-[#d4a017] rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            Analysis Complete
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {results.matchScore}% Match!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We found amazing connections between your child's potential and our community
          </p>
        </motion.div>

        {/* Personalized Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Personalized Message</h2>
          <div className="prose prose-lg text-gray-700 whitespace-pre-wrap">
            {results.personalizedMessage}
          </div>
        </motion.div>

        {/* Matched Stories */}
        {results.matchedStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Students Like Yours</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {results.matchedStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-16 h-16 bg-[#004b34] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {story.firstName[0]}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{story.firstName}'s Story</h3>
                      <p className="text-gray-600 text-sm">{story.storyTldr}</p>
                    </div>
                  </div>
                  
                  <div className="bg-[#004b34]/10 rounded-lg p-4 mb-4">
                    <p className="text-[#003825] font-medium mb-1">Achievement:</p>
                    <p className="text-[#004b34]">{story.achievement}</p>
                  </div>
                  
                  {story.parentQuote && (
                    <blockquote className="border-l-4 border-[#d4a017] pl-4 italic text-gray-700">
                      "{story.parentQuote}"
                    </blockquote>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Matched Faculty */}
        {results.matchedFaculty.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Faculty Mentors for Your Child</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {results.matchedFaculty.map((faculty) => (
                <div key={faculty.id} className="flex items-center">
                  <div className="w-20 h-20 bg-[#3a6c4f] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {faculty.firstName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="font-semibold text-xl text-gray-900">{faculty.firstName}</h3>
                    <p className="text-gray-600">{faculty.title}</p>
                    <p className="text-[#004b34] mt-2">{faculty.whyStudentsLoveThem}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#003825] rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to See It in Person?</h2>
          <p className="text-lg mb-6 text-white/90">
            Schedule your personalized tour and meet the people who will help your child thrive
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center px-8 py-4 bg-white text-[#003825] rounded-md font-semibold text-lg hover:bg-gray-50 transition-all"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Tour Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>

        {/* Key Insights */}
        {results.keyInsights && results.keyInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 mb-2">Key Insights:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {results.keyInsights.map((insight, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {insight}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}