import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Globe, Heart, Shield, Sparkles } from 'lucide-react';

interface FamilyValuesQuestionProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

const VALUES = [
  {
    id: 'small_classes',
    title: 'Small Class Sizes',
    description: 'Personalized attention and support',
    icon: Users,
    metric: '8:1',
    metricLabel: 'Student-Teacher Ratio',
    details: [
      'Average class size of 15 students',
      'Individual attention for every learner',
      'Strong teacher-student relationships'
    ]
  },
  {
    id: 'academic_excellence',
    title: 'Academic Excellence',
    description: 'Rigorous curriculum and high standards',
    icon: Award,
    metric: '25+',
    metricLabel: 'AP Courses Offered',
    details: [
      '100% college acceptance rate',
      'Ivy League & top university placements',
      'National Merit Scholars program'
    ]
  },
  {
    id: 'global_perspective',
    title: 'Global Perspective',
    description: 'International awareness and cultural fluency',
    icon: Globe,
    metric: '15+',
    metricLabel: 'International Trips',
    details: [
      'Annual international IQ trips',
      'Global exchange programs',
      'Language immersion opportunities',
      'Partnership with schools worldwide'
    ]
  },
  {
    id: 'character_building',
    title: 'Character Building',
    description: 'Values, ethics, and leadership',
    icon: Heart,
    metric: '40+',
    metricLabel: 'Service Hours Required',
    details: [
      'Episcopal values and honor code',
      'Leadership development programs',
      'Community service initiatives'
    ]
  },
  {
    id: 'safe_environment',
    title: 'Safe & Nurturing Environment',
    description: 'Inclusive and supportive community',
    icon: Shield,
    metric: '100%',
    metricLabel: 'Anti-Bullying Commitment',
    details: [
      'Comprehensive wellness programs',
      'Full-time counselors and support staff',
      'Inclusive community culture'
    ]
  },
  {
    id: 'innovation',
    title: 'Innovation & Creativity',
    description: 'Cutting-edge programs and approaches',
    icon: Sparkles,
    metric: 'STEAM',
    metricLabel: 'Innovation Center',
    details: [
      'State-of-the-art STEAM facilities',
      'Robotics and coding programs',
      'Maker spaces and 3D printing',
      'Arts integration across curriculum'
    ]
  },
];

export default function FamilyValuesQuestion({ data, onNext, onBack }: FamilyValuesQuestionProps) {
  const [selected, setSelected] = useState<string[]>(data.familyValues || []);
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleValue = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      }
      if (prev.length >= 3) {
        return prev; // Limit to 3 selections
      }
      return [...prev, id];
    });
  };

  const toggleExpanded = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) 
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      onNext({ familyValues: selected });
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What matters most to your family?
        </h2>
        <p className="text-gray-600">
          Choose up to 3 values that guide your educational priorities
        </p>
      </motion.div>

      <div className="space-y-3 mb-8">
        {VALUES.map((value, index) => {
          const Icon = value.icon;
          const isSelected = selected.includes(value.id);
          
          const isExpanded = expanded.includes(value.id);
          
          return (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                onClick={() => {
                  if (!(!isSelected && selected.length >= 3)) {
                    toggleValue(value.id);
                  }
                }}
                className={`w-full p-4 rounded-xl flex items-center text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#fffef5] border-2 border-[#d4a017]'
                    : selected.length >= 3
                    ? 'bg-gray-50 border-2 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  isSelected
                    ? 'bg-[#004b34]'
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isSelected ? 'text-gray-900' : 'text-gray-900'
                  }`}>
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isSelected && value.metric ? (
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-[#004b34] text-base">{value.metric}</span>
                        <span>{value.metricLabel}</span>
                      </span>
                    ) : (
                      value.description
                    )}
                  </p>
                </div>
                {isSelected && (
                  <div className="flex items-center gap-2">
                    {value.details && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(value.id);
                        }}
                        className="text-[#004b34] hover:text-[#003825] transition-colors"
                      >
                        <svg 
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    <div className="w-6 h-6 rounded-full bg-[#d4a017] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {isSelected && isExpanded && value.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 ml-16 p-3 bg-[#004b34]/5 rounded-lg"
                >
                  <ul className="space-y-1">
                    {value.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-[#d4a017] mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Sticky Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`w-full py-4 rounded-md font-semibold text-lg transition-all ${
              selected.length > 0
                ? 'bg-[#003825] text-white hover:bg-[#004b34]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue ({selected.length}/3 selected)
          </motion.button>
        </div>
      </div>
    </div>
  );
}