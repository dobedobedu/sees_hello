import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface MicroAffirmationProps {
  show: boolean;
  gradeLevel?: string;
  currentStep: number;
}

const AFFIRMATIONS: Record<number, Record<string, string>> = {
  1: { // Grade Level
    'lower': 'Lower School: Small classes with two teachers per room!',
    'intermediate': 'Intermediate School: Access to marine science lab starting Grade 4!',
    'middle': 'Middle School: Leadership opportunities in 20+ clubs!',
    'high': 'High School: 25+ AP courses and college counseling from Grade 9!',
    'default': 'Personalized learning at every level!'
  },
  2: { // Interests
    'default': 'We have amazing programs in all these areas!'
  },
  3: { // Current Situation
    'default': 'We understand your journey and we\'re here to help!'
  },
  4: { // Timeline
    'default': 'Perfect timing - we have spots available!'
  },
  5: { // Family Values
    'default': 'Your values align perfectly with our mission!'
  }
};

export default function MicroAffirmation({ show, gradeLevel, currentStep }: MicroAffirmationProps) {
  const affirmation = AFFIRMATIONS[currentStep]?.[gradeLevel || 'default'] || 
                      AFFIRMATIONS[currentStep]?.['default'] || 
                      'Great choice!';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-[#004b34] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{affirmation}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}