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
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          When are you looking to enroll?
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          This helps us provide timely information and availability
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-3">
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
              className={`p-4 md:p-5 rounded-xl bg-white hover:bg-gray-50 transition-all border-2 text-left ${
                data.timeline === timeline.id ? 'border-[#d4a017] bg-[#fffef5]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  data.timeline === timeline.id ? 'bg-[#004b34]' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    data.timeline === timeline.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg text-gray-900">{timeline.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{timeline.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}