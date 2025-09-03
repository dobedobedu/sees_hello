'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Type, Loader2, AlertCircle, BookOpen, Users, Trophy, Heart, Brain, Sparkles } from 'lucide-react';
import { AudioRecorder } from '@/lib/audio/recorder';
import { AIService } from '@/lib/ai/ai-service';

interface ChildDescriptionQuestionProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

interface ChildCharacteristic {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const CHILD_CHARACTERISTICS: Record<string, ChildCharacteristic[]> = {
  academic: [
    { id: 'curious', label: 'Naturally Curious', icon: Brain, description: 'Loves asking questions and exploring new ideas' },
    { id: 'focused', label: 'Strong Focus', icon: BookOpen, description: 'Can concentrate deeply on tasks of interest' },
    { id: 'creative', label: 'Creative Thinker', icon: Sparkles, description: 'Approaches problems in unique ways' },
    { id: 'analytical', label: 'Analytical Mind', icon: Brain, description: 'Enjoys puzzles, logic, and breaking things down' }
  ],
  social: [
    { id: 'outgoing', label: 'Outgoing', icon: Users, description: 'Makes friends easily and enjoys group activities' },
    { id: 'thoughtful', label: 'Thoughtful', icon: Heart, description: 'Considers others\' feelings and needs' },
    { id: 'leader', label: 'Natural Leader', icon: Trophy, description: 'Others look to them for direction' },
    { id: 'collaborator', label: 'Team Player', icon: Users, description: 'Works well with others toward common goals' }
  ],
  interests: [
    { id: 'arts', label: 'Arts & Creativity', icon: Sparkles, description: 'Drawing, music, theater, or creative writing' },
    { id: 'sports', label: 'Sports & Movement', icon: Trophy, description: 'Athletic activities or physical challenges' },
    { id: 'stem', label: 'Science & Tech', icon: Brain, description: 'Experiments, coding, or building things' },
    { id: 'service', label: 'Helping Others', icon: Heart, description: 'Volunteer work or caring for others' }
  ],
  learning: [
    { id: 'hands-on', label: 'Hands-On Learner', icon: Trophy, description: 'Learns best by doing and experiencing' },
    { id: 'visual', label: 'Visual Learner', icon: BookOpen, description: 'Responds well to charts, diagrams, and images' },
    { id: 'discussion', label: 'Learns Through Discussion', icon: Users, description: 'Enjoys talking through ideas with others' },
    { id: 'independent', label: 'Independent Study', icon: Brain, description: 'Prefers to explore topics on their own' }
  ]
};

export default function ChildDescriptionQuestion({ 
  data, 
  onNext, 
  isLastStep, 
  isSubmitting 
}: ChildDescriptionQuestionProps) {
  const [inputMode, setInputMode] = useState<'checklist' | 'voice' | 'text'>('checklist');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>(data.selectedCharacteristics || []);
  const [additionalNotes, setAdditionalNotes] = useState(data.additionalNotes || '');
  const [description, setDescription] = useState(data.childDescription || '');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const aiServiceRef = useRef<AIService | null>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    // Initialize audio recorder and AI service
    audioRecorderRef.current = new AudioRecorder();
    aiServiceRef.current = AIService.getInstance();
    
    // Auto-request microphone permission on mount when voice mode is default
    if (inputMode === 'voice') {
      navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {
        // If permission denied, switch to text mode
        setInputMode('text');
        setError('Microphone permission denied. Switched to text mode.');
      });
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!audioRecorderRef.current) return;
    
    try {
      setError(null);
      await audioRecorderRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = async () => {
    if (!audioRecorderRef.current || !aiServiceRef.current) return;
    
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      setIsTranscribing(true);
      const audioBlob = await audioRecorderRef.current.stopRecording();
      
      // Use the AI service which will use the configured provider
      const result = await aiServiceRef.current.transcribe(audioBlob);
      const newTranscript = result.text;
      setTranscript((prev: string) => prev + ' ' + newTranscript);
      setDescription((prev: string) => (prev + ' ' + newTranscript).trim());
    } catch (err: any) {
      setError(err.message || 'Failed to transcribe audio. Please check your settings.');
      console.error('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleCharacteristic = (id: string) => {
    setSelectedCharacteristics(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const hasContent = selectedCharacteristics.length > 0 || 
                      additionalNotes.trim() || 
                      description.trim();
    
    if (hasContent) {
      onNext({ 
        selectedCharacteristics,
        additionalNotes,
        childDescription: description,
        voiceTranscript: inputMode === 'voice' ? transcript : undefined
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Tell us about your child
        </h2>
        <p className="text-gray-600 mt-2">
          Select the characteristics that best describe your child, or use voice/text to share more
        </p>
      </motion.div>

      {/* Input Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#004b34] rounded-full p-1 flex overflow-hidden">
          <button
            onClick={() => {
              setInputMode('checklist');
              setError(null);
            }}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center transition-all text-sm md:text-base ${
              inputMode === 'checklist'
                ? 'bg-[#d4a017] text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            Quick Select
          </button>
          <button
            onClick={() => {
              setInputMode('text');
              setError(null);
            }}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center transition-all text-sm md:text-base ${
              inputMode === 'text'
                ? 'bg-[#d4a017] text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Type className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            Type
          </button>
          <button
            onClick={() => {
              setInputMode('voice');
              setError(null);
            }}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full flex items-center transition-all text-sm md:text-base ${
              inputMode === 'voice'
                ? 'bg-[#d4a017] text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            Voice
          </button>
        </div>
      </div>

      {inputMode === 'checklist' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Academic Characteristics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-[#004b34]" />
              Academic Strengths
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHILD_CHARACTERISTICS.academic.map((characteristic) => {
                const Icon = characteristic.icon;
                const isSelected = selectedCharacteristics.includes(characteristic.id);
                return (
                  <motion.button
                    key={characteristic.id}
                    onClick={() => toggleCharacteristic(characteristic.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#d4a017] bg-[#d4a017]/10 shadow-md'
                        : 'border-gray-200 hover:border-[#004b34] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-[#d4a017]' : 'text-gray-500'}`} />
                      <span className={`font-medium ${isSelected ? 'text-[#004b34]' : 'text-gray-900'}`}>
                        {characteristic.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{characteristic.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Social Characteristics */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#004b34]" />
              Social Style
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHILD_CHARACTERISTICS.social.map((characteristic) => {
                const Icon = characteristic.icon;
                const isSelected = selectedCharacteristics.includes(characteristic.id);
                return (
                  <motion.button
                    key={characteristic.id}
                    onClick={() => toggleCharacteristic(characteristic.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#d4a017] bg-[#d4a017]/10 shadow-md'
                        : 'border-gray-200 hover:border-[#004b34] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-[#d4a017]' : 'text-gray-500'}`} />
                      <span className={`font-medium ${isSelected ? 'text-[#004b34]' : 'text-gray-900'}`}>
                        {characteristic.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{characteristic.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Interest Areas */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#004b34]" />
              Primary Interests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHILD_CHARACTERISTICS.interests.map((characteristic) => {
                const Icon = characteristic.icon;
                const isSelected = selectedCharacteristics.includes(characteristic.id);
                return (
                  <motion.button
                    key={characteristic.id}
                    onClick={() => toggleCharacteristic(characteristic.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#d4a017] bg-[#d4a017]/10 shadow-md'
                        : 'border-gray-200 hover:border-[#004b34] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-[#d4a017]' : 'text-gray-500'}`} />
                      <span className={`font-medium ${isSelected ? 'text-[#004b34]' : 'text-gray-900'}`}>
                        {characteristic.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{characteristic.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Learning Style */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-[#004b34]" />
              Learning Style
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHILD_CHARACTERISTICS.learning.map((characteristic) => {
                const Icon = characteristic.icon;
                const isSelected = selectedCharacteristics.includes(characteristic.id);
                return (
                  <motion.button
                    key={characteristic.id}
                    onClick={() => toggleCharacteristic(characteristic.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#d4a017] bg-[#d4a017]/10 shadow-md'
                        : 'border-gray-200 hover:border-[#004b34] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-[#d4a017]' : 'text-gray-500'}`} />
                      <span className={`font-medium ${isSelected ? 'text-[#004b34]' : 'text-gray-900'}`}>
                        {characteristic.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{characteristic.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Anything else you'd like us to know?
            </h3>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Optional: Share any special talents, challenges, or things that make your child unique..."
              className="w-full h-32 p-4 bg-gradient-to-br from-[#003825] to-[#004b34] text-white placeholder-white/50 border-2 border-[#004b34] rounded-xl focus:border-[#d4a017] focus:outline-none resize-none"
              maxLength={300}
            />
            <p className="text-sm text-gray-500 text-right mt-2">
              {additionalNotes.length}/300 characters
            </p>
          </div>
        </motion.div>
      ) : inputMode === 'text' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Sarah is a curious 10-year-old who loves asking 'why' about everything. She's passionate about marine life and spends hours reading about ocean creatures. She's a bit shy in new situations but really opens up when talking about her interests..."
            className="w-full h-48 p-4 bg-gradient-to-br from-[#003825] to-[#004b34] text-white placeholder-white/50 border-2 border-[#004b34] rounded-xl focus:border-[#d4a017] focus:outline-none resize-none"
            maxLength={500}
          />
          <p className="text-sm text-gray-500 text-right mt-2">
            {description.length}/500 characters
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Voice Recording Interface */}
          <div className="mb-6">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : isTranscribing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-[#004b34] to-[#003825] hover:from-[#003825] hover:to-[#002518] hover:shadow-lg'
              }`}
            >
              {isTranscribing ? (
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </button>
            {isRecording && (
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-700">
                  Recording... {recordingTime}s / 60s
                </p>
                <div className="w-64 mx-auto mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${(recordingTime / 60) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {isTranscribing && (
              <p className="mt-4 text-gray-600">Transcribing your message...</p>
            )}
          </div>

          {/* Transcript Display */}
          {(transcript || description) && (
            <div className="bg-[#003825] rounded-xl p-4 text-left">
              <p className="text-sm text-white/70 mb-2">Your message:</p>
              <p className="text-white">{description || transcript}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!isRecording && !description && !error && (
            <p className="text-gray-600">
              Tap the microphone to start recording (up to 60 seconds)
            </p>
          )}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleSubmit}
        disabled={!(selectedCharacteristics.length > 0 || additionalNotes.trim() || description.trim()) || isSubmitting}
        className={`w-full mt-8 py-4 rounded-md font-semibold text-lg transition-all flex items-center justify-center ${
          (selectedCharacteristics.length > 0 || additionalNotes.trim() || description.trim()) && !isSubmitting
            ? 'bg-[#003825] text-white hover:bg-[#004b34]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Complete Quiz'
        )}
      </motion.button>

      {/* Selected Summary */}
      {selectedCharacteristics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-[#004b34]/5 rounded-lg border border-[#004b34]/20"
        >
          <p className="text-sm font-medium text-[#004b34] mb-2">
            You selected {selectedCharacteristics.length} characteristic{selectedCharacteristics.length !== 1 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCharacteristics.map(id => {
              const characteristic = Object.values(CHILD_CHARACTERISTICS).flat().find(c => c.id === id);
              return characteristic ? (
                <span
                  key={id}
                  className="px-3 py-1 bg-[#d4a017] text-white text-sm rounded-full"
                >
                  {characteristic.label}
                </span>
              ) : null;
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}