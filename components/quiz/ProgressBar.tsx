import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  onBack?: () => void;
  stepLabels?: string[];
}

export default function ProgressBar({ currentStep, totalSteps, onStepClick, onBack, stepLabels }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4 pb-8">
        <div className="flex items-center justify-between mb-2">
          {onBack && (
            <button
              onClick={onBack}
              disabled={currentStep === 1}
              className={`text-sm font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#004b34] hover:text-[#003825]'
              }`}
            >
              ← Back
            </button>
          )}
          <div className="text-sm text-gray-500">
            {currentStep === totalSteps 
              ? 'Almost done!' 
              : `${totalSteps - currentStep} questions remaining`}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center flex-1">
              <button
                onClick={() => onStepClick && index < currentStep && onStepClick(index + 1)}
                disabled={!onStepClick || index >= currentStep}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                  index < currentStep - 1
                    ? 'bg-[#003825] text-white cursor-pointer hover:bg-[#004b34]'
                    : index === currentStep - 1
                    ? 'bg-[#d4a017] text-white ring-4 ring-[#d4a017]/20 cursor-default'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } ${
                  index < currentStep - 1 ? 'hover:scale-110' : ''
                }`}
              >
                {index + 1}
              </button>
              {stepLabels && stepLabels[index] && currentStep === index + 1 && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-[#004b34] whitespace-nowrap">
                  {stepLabels[index]}
                </div>
              )}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-1 mx-2">
                  <div className="h-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#003825]"
                      initial={{ width: 0 }}
                      animate={{ width: index < currentStep - 1 ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}