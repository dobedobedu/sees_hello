import { motion } from 'framer-motion';
import { MapPin, Search, Calendar, Compass } from 'lucide-react';

interface CurrentSituationQuestionProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

const SITUATIONS = [
  {
    id: 'new_to_area',
    title: 'New to the Area',
    icon: MapPin,
    description: 'We recently moved and need a school',
  },
  {
    id: 'seeking_change',
    title: 'Seeking Better Fit',
    icon: Search,
    description: 'Looking for a different educational approach',
  },
  {
    id: 'planning_ahead',
    title: 'Planning Ahead',
    icon: Calendar,
    description: 'Preparing for upcoming school years',
  },
  {
    id: 'exploring_options',
    title: 'Exploring Options',
    icon: Compass,
    description: 'Researching schools in the area',
  },
];

export default function CurrentSituationQuestion({ data, onNext }: CurrentSituationQuestionProps) {
  const handleSelect = (situation: string) => {
    onNext({ currentSituation: situation });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          What brings you here today?
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Understanding your situation helps us provide relevant information
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-3">
        {SITUATIONS.map((situation, index) => {
          const Icon = situation.icon;
          return (
            <motion.button
              key={situation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(situation.id)}
              className={`p-4 md:p-5 rounded-xl bg-white hover:bg-gray-50 transition-all border-2 text-left ${
                data.currentSituation === situation.id ? 'border-[#d4a017] bg-[#fffef5]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  data.currentSituation === situation.id ? 'bg-[#004b34]' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    data.currentSituation === situation.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg text-gray-900">{situation.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{situation.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}