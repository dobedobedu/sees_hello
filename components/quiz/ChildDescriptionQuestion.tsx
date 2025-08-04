'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Type, Loader2 } from 'lucide-react';

interface ChildDescriptionQuestionProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

export default function ChildDescriptionQuestion({ 
  data, 
  onNext, 
  isLastStep, 
  isSubmitting 
}: ChildDescriptionQuestionProps) {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('text');
  const [description, setDescription] = useState(data.childDescription || '');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check if Web Speech API is available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
        setDescription(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setRecordingTime(0);
      recognitionRef.current.start();
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 59) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSubmit = () => {
    if (description.trim()) {
      onNext({ 
        childDescription: description,
        voiceTranscript: inputMode === 'voice' ? transcript : undefined
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tell us about your child
        </h2>
        <p className="text-gray-600">
          Share what makes them unique - their personality, dreams, or challenges
        </p>
      </motion.div>

      {/* Input Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#004b34] rounded-full p-1 flex">
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 rounded-full flex items-center transition-all ${
              inputMode === 'text'
                ? 'bg-[#d4a017] text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Type className="w-4 h-4 mr-2" />
            Type
          </button>
          <button
            onClick={() => setInputMode('voice')}
            disabled={!recognitionRef.current}
            className={`px-4 py-2 rounded-full flex items-center transition-all ${
              inputMode === 'voice'
                ? 'bg-[#d4a017] text-white'
                : 'text-white/70 hover:text-white'
            } ${
              !recognitionRef.current ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </button>
        </div>
      </div>

      {inputMode === 'text' ? (
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
              className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gradient-to-br from-[#004b34] to-[#003825] hover:from-[#003825] hover:to-[#002518] hover:shadow-lg'
              }`}
            >
              {isRecording ? (
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
          </div>

          {/* Transcript Display */}
          {(transcript || description) && (
            <div className="bg-[#003825] rounded-xl p-4 text-left">
              <p className="text-sm text-white/70 mb-2">Your message:</p>
              <p className="text-white">{description || transcript}</p>
            </div>
          )}

          {!isRecording && !description && (
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
        disabled={!description.trim() || isSubmitting}
        className={`w-full mt-8 py-4 rounded-md font-semibold text-lg transition-all flex items-center justify-center ${
          description.trim() && !isSubmitting
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
    </div>
  );
}