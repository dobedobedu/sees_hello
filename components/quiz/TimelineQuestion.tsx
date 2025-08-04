import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Search } from 'lucide-react';

interface TimelineQuestionProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

const TIMELINES = [
  {
    id: 'this_year',
    title: 'This School Year',
    description: 'Ready to start as soon as possible',
    icon: Calendar,
    color: 'bg-[#003825]',
  },
  {
    id: 'next_fall',
    title: 'Next Fall',
    description: 'Planning for the upcoming school year',
    icon: Clock,
    color: 'bg-[#004b34]',
  },
  {
    id: 'within_2_years',
    title: 'Within 2 Years',
    description: 'Getting ahead of our planning',
    icon: TrendingUp,
    color: 'bg-[#3a6c4f]',
  },
  {
    id: 'just_exploring',
    title: 'Just Exploring',
    description: 'No specific timeline yet',
    icon: Search,
    color: 'bg-[#4a7c5f]',
  },
];

export default function TimelineQuestion({ data, onNext }: TimelineQuestionProps) {
  const handleSelect = (timeline: string) => {
    onNext({ timeline });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          When are you looking to enroll?
        </h2>
        <p className="text-gray-600">
          This helps us provide timely information and availability
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {TIMELINES.map((timeline, index) => {
          const Icon = timeline.icon;
          return (
            <motion.button
              key={timeline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(timeline.id)}
              className={`p-6 rounded-xl bg-white hover:bg-gray-50 transition-all border-2 ${
                data.timeline === timeline.id ? 'border-[#d4a017] bg-[#fffef5]' : 'border-gray-200'
              }`}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${timeline.color} flex items-center justify-center`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{timeline.title}</h3>
              <p className="text-gray-600 text-sm">{timeline.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}