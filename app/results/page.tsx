'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Calendar, Check, Home, Mail, Copy, CheckCircle, ChevronDown, Play, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AIService } from '@/lib/ai/ai-service';
import { QuizResponse, AnalysisResult } from '@/lib/ai/types';
import alumniData from '@/knowledge/alumni-stories.json';
import facultyData from '@/knowledge/faculty.json';
import factsData from '@/knowledge/facts.json';
import { Confetti, triggerMiniConfetti } from '@/components/ui/confetti';
import { SwipeableCards } from '@/components/ui/swipeable-cards';
import { VideoModal } from '@/components/ui/video-modal';
import { generateEmailTemplate, generateAdmissionsChecklist, copyToClipboard } from '@/lib/email-template';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTourItems, setSelectedTourItems] = useState<string[]>([]);
  const [expandedTourItem, setExpandedTourItem] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [checklistCopied, setChecklistCopied] = useState(false);
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({ 
    isOpen: false, 
    url: '', 
    title: '' 
  });

  useEffect(() => {
    const analyzeQuizData = async () => {
      try {
        const quizDataStr = sessionStorage.getItem('quizData');
        if (!quizDataStr) {
          router.push('/quiz');
          return;
        }

        const parsedQuizData: QuizResponse = JSON.parse(quizDataStr);
        setQuizData(parsedQuizData);
        
        // Use the AI service which respects admin settings
        const aiService = AIService.getInstance();
        
        // Perform analysis
        const analysisResult = await aiService.analyze(parsedQuizData, {
          stories: alumniData.stories as any[],
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
          matchedStories: alumniData.stories.slice(0, 2) as any[],
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

  const handleCopyEmailTemplate = async () => {
    if (!quizData || !results) return;
    
    const emailData = {
      ...quizData,
      ...results,
      selectedTourItems
    };
    
    const { body } = generateEmailTemplate(emailData, undefined, selectedTourItems);
    
    const success = await copyToClipboard(body);
    if (success) {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 3000);
    }
  };

  const handleCopyAdmissionsChecklist = async () => {
    if (!quizData || !results) return;
    
    const emailData = {
      ...quizData,
      ...results,
      selectedTourItems
    };
    
    const checklist = generateAdmissionsChecklist(emailData);
    
    const success = await copyToClipboard(checklist);
    if (success) {
      setChecklistCopied(true);
      setTimeout(() => setChecklistCopied(false), 3000);
    }
  };

  const handleEmailAdmissions = () => {
    if (!quizData || !results) return;
    
    const emailData = {
      ...quizData,
      ...results,
      selectedTourItems
    };
    
    const { subject, body } = generateEmailTemplate(emailData, undefined, selectedTourItems);
    const tourEmail = process.env.NEXT_PUBLIC_TOUR_EMAIL || 'admissions@saintstephens.org';
    
    const mailtoLink = `mailto:${tourEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleShare = async () => {
    setSharing(true);
    
    const shareData = {
      matchScore: results?.matchScore || 92,
      selectedTourItems,
      studentStory: results?.matchedStories[0],
      faculty: results?.matchedFaculty[0],
      link: window.location.href
    };

    const selectedTourText = selectedTourItems.map(itemId => {
      const option = tourOptions?.find(opt => opt.id === itemId);
      return option ? `• ${option.title}` : '';
    }).filter(Boolean).join('\n') || '• No tour items selected yet';

    const emailSubject = encodeURIComponent(`Saint Stephen's - ${shareData.matchScore}% match`);
    
    const emailBody = encodeURIComponent(`${shareData.matchScore}% match!

${results?.matchedStories?.[0]?.firstName ? `${results.matchedStories[0].firstName}: ${results.matchedStories[0].achievement}` : ''}

${results?.matchedFaculty?.[0]?.firstName ? `Mentor: ${results.matchedFaculty[0].firstName} ${results.matchedFaculty[0].lastName} (${results.matchedFaculty[0].title})` : ''}

Want to see:
${selectedTourText}

Full results: ${shareData.link}`);

    // Open email client with pre-filled content
    window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    
    setSharing(false);
  };

  const tourOptions = results ? [
    {
      id: 'marine-lab',
      title: 'Visit the Marine Science Lab',
      description: 'See our living coral reef and research facilities'
    },
    {
      id: 'meet-coach',
      title: `Meet ${results.matchedFaculty?.[0]?.firstName || 'Coach Turner'}`,
      description: `${results.matchedFaculty?.[0]?.title || 'Athletic Director & Tennis Coach'}`
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
  ] : [];

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
      {/* Confetti Animation */}
      <Confetti duration={1500} particleCount={50} />
      
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
              <p className="text-lg text-gray-700 mt-2">Your story match</p>
            </motion.div>
          </div>


          {/* Swipeable Cards for Stories and Faculty */}
          {results.matchedStories && results.matchedStories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SwipeableCards 
                cards={[
                  // Alumni Story Card
                  {
                    id: 'alumni-story',
                    type: 'alumni' as const,
                    content: (
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-sm">
                        {/* Background Image Container */}
                        <div className="absolute inset-0">
                          {results.matchedStories[0]?.photoUrl ? (
                            <div 
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `url(${results.matchedStories[0].photoUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#004b34] via-[#003825] to-[#002815]">
                              <div className="absolute inset-0 opacity-10">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                                  </pattern>
                                  <rect width="100" height="100" fill="url(#grid)" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Content Overlay */}
                        <div className="relative h-full flex flex-col">
                          {/* Top section with blur background */}
                          <div className="backdrop-blur-md bg-white/90 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {results.matchedStories[0]?.firstName} {results.matchedStories[0]?.lastName}
                                </h3>
                                <p className="text-sm text-[#d4a017]">Class of {results.matchedStories[0]?.classYear}</p>
                              </div>
                              <div className="w-12 h-12 bg-[#004b34] rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                  {results.matchedStories[0]?.firstName?.[0] || 'A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom section with content */}
                          <div className="flex-1 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
                            <div className="space-y-2 text-white">
                              <div>
                                <p className="text-xs opacity-80">Then:</p>
                                <p className="text-sm">{results.matchedStories[0]?.storyTldr}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs opacity-80">Now:</p>
                                <p className="text-sm font-medium">{results.matchedStories[0]?.currentRole}</p>
                              </div>

                              {results.matchedStories[0]?.quote && (
                                <blockquote className="text-xs italic opacity-90 border-l-2 border-[#d4a017] pl-2 mt-2">
                                  "{results.matchedStories[0]?.quote}"
                                </blockquote>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  },
                  // Faculty Cards - map all matched faculty
                  ...(results.matchedFaculty && results.matchedFaculty.length > 0 ? results.matchedFaculty.map((faculty, index) => ({
                    id: `faculty-match-${index}`,
                    type: 'faculty' as const,
                    content: (
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-sm">
                        {/* Background Image Container */}
                        <div className="absolute inset-0">
                          {faculty?.photoUrl ? (
                            <div 
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `url(${faculty.photoUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017] via-[#b8901a] to-[#9c7a15]">
                              <div className="absolute inset-0 opacity-10">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <pattern id="grid-faculty" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <circle cx="5" cy="5" r="1" fill="currentColor"/>
                                  </pattern>
                                  <rect width="100" height="100" fill="url(#grid-faculty)" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Content Overlay */}
                        <div className="relative h-full flex flex-col">
                          {/* Top section with blur background */}
                          <div className="backdrop-blur-md bg-white/90 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {faculty?.firstName} {faculty?.lastName}
                                </h3>
                                <p className="text-sm text-[#d4a017] font-medium">Faculty Mentor</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {faculty?.videoUrl && (
                                  <button
                                    onClick={() => setVideoModal({ 
                                      isOpen: true, 
                                      url: faculty.videoUrl!, 
                                      title: `${faculty.firstName} ${faculty.lastName || ''} - ${faculty.title}` 
                                    })}
                                    className="w-10 h-10 bg-[#d4a017] rounded-full flex items-center justify-center hover:bg-[#b8901a] transition-colors"
                                    aria-label="Watch teacher video"
                                  >
                                    <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                                  </button>
                                )}
                                <div className="w-12 h-12 bg-[#004b34] rounded-full flex items-center justify-center">
                                  <span className="text-xl font-bold text-white">
                                    {faculty?.firstName?.[0] || 'F'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom section with content */}
                          <div className="flex-1 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end">
                            <div className="space-y-2 text-white">
                              <p className="text-sm font-medium">{faculty?.title}</p>
                              
                              <p className="text-xs opacity-90">
                                {faculty?.whyStudentsLoveThem}
                              </p>

                              {faculty?.specializesIn && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {faculty.specializesIn.slice(0, 3).map((specialty: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                                      {specialty}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })) : [])
                ]}
              />
            </motion.div>
          )}

          {/* Personalized Tour Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {selectedTourItems.length >= 3 ? 'Email Family' : 'Build Your Perfect Tour'}
            </h2>
            {selectedTourItems.length >= 3 ? (
              <button
                onClick={handleShare}
                disabled={sharing}
                className="mx-auto mb-4 px-6 py-2 bg-[#003825] text-white rounded-full font-medium hover:bg-[#004b34] transition-all flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send to Family
              </button>
            ) : (
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Select what you'd like to experience (select 3+ to share)</p>
            )}
            
            <div className="space-y-2">
              {tourOptions.map((option, index) => {
                const isSelected = selectedTourItems.includes(option.id);
                const isExpanded = expandedTourItem === option.id;
                
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                  >
                    <div
                      className={`rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-[#d4a017] bg-[#fffef5]'
                          : 'border-gray-200'
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          if (!isSelected && selectedTourItems.length < 5) {
                            setSelectedTourItems(prev => [...prev, option.id]);
                            // Get click position for confetti
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = (rect.left + rect.width / 2) / window.innerWidth;
                            const y = (rect.top + rect.height / 2) / window.innerHeight;
                            triggerMiniConfetti(x, y);
                          } else if (isSelected) {
                            setSelectedTourItems(prev => prev.filter(id => id !== option.id));
                          }
                        }}
                        className={`p-4 cursor-pointer ${
                          !isSelected && selectedTourItems.length >= 5
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <motion.div 
                            animate={{ 
                              scale: isSelected ? 1.05 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#d4a017] bg-[#d4a017]'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">{option.title}</h3>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTourItem(isExpanded ? null : option.id);
                            }}
                            className="ml-2 p-1"
                          >
                            <ChevronDown 
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4">
                              <p className="text-sm text-gray-600 pl-8">{option.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              {selectedTourItems.length}/5 selected
            </div>

            {/* Email Template Section */}
            {selectedTourItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 bg-gradient-to-br from-[#004b34]/5 to-[#d4a017]/5 rounded-lg border border-[#004b34]/20"
              >
                <h3 className="text-lg font-semibold text-[#004b34] mb-4 text-center">
                  📧 Share Your Results
                </h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Ready to book your tour? Use these tools to share your quiz results with admissions.
                </p>
                
                <div className="space-y-3">
                  {/* Email Admissions Button */}
                  <button
                    onClick={handleEmailAdmissions}
                    className="w-full flex items-center justify-center px-4 py-3 bg-[#003825] text-white rounded-lg font-medium hover:bg-[#004b34] transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Email Admissions Office
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Copy Email Template Button */}
                    <button
                      onClick={handleCopyEmailTemplate}
                      className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                        emailCopied
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-[#004b34] text-[#004b34] hover:bg-[#004b34]/5'
                      }`}
                    >
                      {emailCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Email
                        </>
                      )}
                    </button>
                    
                    {/* Copy Checklist Button */}
                    <button
                      onClick={handleCopyAdmissionsChecklist}
                      className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                        checklistCopied
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-[#d4a017] text-[#d4a017] hover:bg-[#d4a017]/5'
                      }`}
                    >
                      {checklistCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Checklist
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center mt-3 space-y-1">
                    <p>💡 <strong>For Parents:</strong> Use "Email Admissions" or "Copy Email" to send your results</p>
                    <p>📋 <strong>For Admissions:</strong> Use "Copy Checklist" for your tour preparation</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

        </motion.div>
      </main>
      
      {/* Sticky Book Your Tour Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <a
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1pPQ9xNbaHdCjn0RLmWLqhkuL5ePgy2tEp6YAT6tCvHG8emnJQr3gayPfmsnOPCbze_Q_ccJcD"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-8 py-4 bg-[#003825] text-white rounded-full font-medium text-lg hover:bg-[#004b34] transition-all shadow-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Your Tour
          </a>
        </div>
      </div>
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, url: '', title: '' })}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
}