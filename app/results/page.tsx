'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Calendar, Check, Home, Mail, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AIService } from '@/lib/ai/ai-service';
import { QuizResponse, AnalysisResult } from '@/lib/ai/types';
import storiesData from '@/knowledge/stories.json';
import facultyData from '@/knowledge/faculty.json';
import factsData from '@/knowledge/facts.json';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTourItems, setSelectedTourItems] = useState<string[]>([]);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const analyzeQuizData = async () => {
      try {
        const quizDataStr = sessionStorage.getItem('quizData');
        if (!quizDataStr) {
          router.push('/quiz');
          return;
        }

        const quizData: QuizResponse = JSON.parse(quizDataStr);
        
        // Use the AI service which respects admin settings
        const aiService = AIService.getInstance();
        
        // Perform analysis
        const analysisResult = await aiService.analyze(quizData, {
          stories: storiesData.stories as any[],
          faculty: facultyData.faculty as any[],
          facts: factsData.facts as any[]
        });

        setResults(analysisResult);
      } catch (error) {
        console.error('Analysis error:', error);
        // Fallback to a default result
        setResults({
          matchScore: 92,
          personalizedMessage: "Based on your interests in arts and athletics, we've crafted a personalized tour that showcases our creative programs and championship sports teams.",
          matchedStories: storiesData.stories.slice(0, 2) as any[],
          matchedFaculty: facultyData.faculty.slice(0, 2) as any[],
          keyInsights: ['Creative Arts Focus', 'Athletic Excellence', 'Small Class Sizes', 'College Prep'],
          recommendedPrograms: ['Visual Arts', 'Tennis', 'Marine Science']
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeQuizData();
  }, [router]);

  const handleShare = async () => {
    setSharing(true);
    
    const shareData = {
      matchScore: results?.matchScore || 92,
      selectedTourItems,
      studentStory: results?.matchedStories[0],
      faculty: results?.matchedFaculty[0],
      link: window.location.href
    };

    const shareText = `Our SSES Match: ${shareData.matchScore}%! 
    
Tour highlights we selected:
${selectedTourItems.map(itemId => {
      const option = tourOptions.find(opt => opt.id === itemId);
      return option ? `• ${option.title}` : '';
    }).filter(Boolean).join('\n')}

Check out our personalized results: ${shareData.link}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      setSharing(false);
    }
  };

  const tourOptions = [
    {
      id: 'marine-lab',
      title: 'Visit the Marine Science Lab',
      description: 'See our living coral reef and research facilities'
    },
    {
      id: 'meet-coach',
      title: `Meet ${results?.matchedFaculty[0]?.firstName || 'Coach Turner'}`,
      description: `${results?.matchedFaculty[0]?.title || 'Athletic Director & Tennis Coach'}`
    },
    {
      id: 'class-visit',
      title: 'Sit in on a small class',
      description: 'Experience our 9:1 student-teacher ratio'
    },
    {
      id: 'steam-center',
      title: 'Tour the STEAM Innovation Center',
      description: 'Explore our maker spaces and robotics lab'
    },
    {
      id: 'arts-showcase',
      title: 'View student art gallery',
      description: 'See award-winning work by our creative students'
    },
    {
      id: 'athletics',
      title: 'Watch team practice',
      description: '19 varsity sports, 20 state championships'
    }
  ];

  const toggleTourItem = (itemId: string) => {
    if (selectedTourItems.includes(itemId)) {
      setSelectedTourItems(prev => prev.filter(id => id !== itemId));
    } else if (selectedTourItems.length < 5) {
      setSelectedTourItems(prev => [...prev, itemId]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#004b34] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your personalized experience...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

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
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Match Score */}
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex flex-col items-center"
            >
              <div className="relative">
                <div className="text-7xl md:text-8xl font-bold text-[#004b34]">
                  {Math.round(results.matchScore)}%
                </div>
                <div className="absolute -right-12 top-0 text-sm font-medium text-[#d4a017]">match</div>
              </div>
              <p className="text-lg text-gray-700 mt-2">Your family + Saint Stephen's</p>
            </motion.div>
          </div>

          {/* Action Buttons - Centered */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1pPQ9xNbaHdCjn0RLmWLqhkuL5ePgy2tEp6YAT6tCvHG8emnJQr3gayPfmsnOPCbze_Q_ccJcD"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#003825] text-white rounded-full font-medium hover:bg-[#004b34] transition-all flex items-center shadow-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Your Visit
            </a>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="px-8 py-3 bg-white border-2 border-[#003825] text-[#003825] rounded-full font-medium hover:bg-gray-50 transition-all flex items-center"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 mr-2" />
                  Share with Family
                </>
              )}
            </button>
          </motion.div>

          {/* Student Story - Narrative Style */}
          {results.matchedStories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">A Student Story Just Like Yours</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  When <span className="font-semibold text-[#004b34]">{results.matchedStories[0].firstName}</span> first 
                  walked through our gates, they were {results.matchedStories[0].storyTldr.toLowerCase()}. 
                </p>
                
                <p className="text-gray-700 leading-relaxed mt-4">
                  Today? {results.matchedStories[0].achievement}. But the real story isn't just about the 
                  accomplishments — it's about the journey. {results.matchedStories[0].firstName} found mentors 
                  who believed in them, small classes where their voice mattered, and opportunities to explore 
                  passions they didn't even know they had.
                </p>

                {results.matchedStories[0].parentQuote && (
                  <blockquote className="border-l-4 border-[#d4a017] pl-6 my-6 italic text-gray-700">
                    "{results.matchedStories[0].parentQuote}"
                    <cite className="block text-sm mt-2 not-italic text-gray-600">
                      — {results.matchedStories[0].firstName}'s Parent
                    </cite>
                  </blockquote>
                )}

                <p className="text-gray-700 leading-relaxed">
                  Your child's story is waiting to be written. And just like {results.matchedStories[0].firstName}, 
                  it starts with finding the right place to grow.
                </p>
              </div>
            </motion.div>
          )}

          {/* Faculty Mentor */}
          {results.matchedFaculty.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#004b34] to-[#003825] text-white rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Your Child's Future Mentor</h2>
              
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {results.matchedFaculty[0].firstName[0]}{results.matchedFaculty[0].lastName[0]}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">
                    {results.matchedFaculty[0].firstName} {results.matchedFaculty[0].lastName}
                  </h3>
                  <p className="text-white/80 mb-3">{results.matchedFaculty[0].title}</p>
                  
                  <p className="text-white/90 leading-relaxed">
                    {results.matchedFaculty[0].bio || `With years of experience and a passion for student development, 
                    ${results.matchedFaculty[0].firstName} has guided countless students to discover their potential.`}
                  </p>
                  
                  {results.matchedFaculty[0].specialties && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {results.matchedFaculty[0].specialties.map((specialty: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Personalized Tour Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your Perfect Tour</h2>
            <p className="text-gray-600 mb-6">Select up to 5 things you'd like to experience (we'll share this with your tour guide)</p>
            
            <div className="space-y-3">
              {tourOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleTourItem(option.id)}
                  disabled={!selectedTourItems.includes(option.id) && selectedTourItems.length >= 5}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTourItems.includes(option.id)
                      ? 'border-[#d4a017] bg-[#fffef5]'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    !selectedTourItems.includes(option.id) && selectedTourItems.length >= 5
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                      selectedTourItems.includes(option.id)
                        ? 'border-[#d4a017] bg-[#d4a017]'
                        : 'border-gray-300'
                    }`}>
                      {selectedTourItems.includes(option.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              {selectedTourItems.length}/5 selected
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center pb-8"
          >
            <p className="text-gray-600 mb-4">Ready to see it all in person?</p>
            <a
              href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1pPQ9xNbaHdCjn0RLmWLqhkuL5ePgy2tEp6YAT6tCvHG8emnJQr3gayPfmsnOPCbze_Q_ccJcD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-12 py-4 bg-[#003825] text-white rounded-full font-medium text-lg hover:bg-[#004b34] transition-all shadow-lg"
            >
              Book Your Personalized Visit
              <Calendar className="w-5 h-5 ml-2" />
            </a>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}