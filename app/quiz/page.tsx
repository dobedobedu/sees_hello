'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import GradeLevelQuestion from '@/components/quiz/GradeLevelQuestion';
import CurrentSituationQuestion from '@/components/quiz/CurrentSituationQuestion';
import InterestsQuestion from '@/components/quiz/InterestsQuestion';
import FamilyValuesQuestion from '@/components/quiz/FamilyValuesQuestion';
import TimelineQuestion from '@/components/quiz/TimelineQuestion';
import ChildDescriptionQuestion from '@/components/quiz/ChildDescriptionQuestion';
import ProgressBar from '@/components/quiz/ProgressBar';

export interface QuizData {
  gradeLevel?: 'prek-k' | 'elementary' | 'middle' | 'high';
  currentSituation?: string;
  interests?: string[];
  familyValues?: string[];
  timeline?: string;
  childDescription?: string;
  voiceTranscript?: string;
}

const QUIZ_STEPS = [
  { id: 1, title: 'Grade Level', component: GradeLevelQuestion },
  { id: 2, title: 'Interests', component: InterestsQuestion },
  { id: 3, title: 'Current Situation', component: CurrentSituationQuestion },
  { id: 4, title: 'Timeline', component: TimelineQuestion },
  { id: 5, title: 'Family Values', component: FamilyValuesQuestion },
  { id: 6, title: 'Tell Us More', component: ChildDescriptionQuestion },
];

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizPath = searchParams.get('path');
  const [currentStep, setCurrentStep] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load saved progress from sessionStorage
    const saved = sessionStorage.getItem('quizProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuizData(parsed.data);
      setCurrentStep(parsed.step);
    }
  }, []);

  useEffect(() => {
    // Save progress to sessionStorage
    sessionStorage.setItem('quizProgress', JSON.stringify({
      data: quizData,
      step: currentStep
    }));
  }, [quizData, currentStep]);

  const handleNext = (data: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...data }));
    
    if (currentStep === QUIZ_STEPS.length) {
      handleSubmit({ ...quizData, ...data });
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (finalData: QuizData) => {
    setIsSubmitting(true);
    try {
      // Save quiz data to sessionStorage for results page
      sessionStorage.setItem('quizData', JSON.stringify(finalData));
      
      // Navigate to processing/results page
      router.push('/results');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setIsSubmitting(false);
    }
  };

  const CurrentQuestion = QUIZ_STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 py-3 bg-[#004b34]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center text-white hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-sm text-white/80">
            Step {currentStep} of {QUIZ_STEPS.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={QUIZ_STEPS.length} 
        onStepClick={handleStepClick}
        onBack={handleBack}
        stepLabels={QUIZ_STEPS.map(s => s.title)}
      />

      {/* Quiz Content */}
      <main className="max-w-4xl mx-auto px-6 py-4 md:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentQuestion
              data={quizData}
              onNext={handleNext}
              onBack={handleBack}
              isLastStep={currentStep === QUIZ_STEPS.length}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Skip & See Matches Button */}
      {currentStep < QUIZ_STEPS.length && Object.keys(quizData).length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => handleSubmit(quizData)}
          className="fixed bottom-6 right-6 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all text-sm font-medium"
        >
          Skip & See Matches →
        </motion.button>
      )}

    </div>
  );
}