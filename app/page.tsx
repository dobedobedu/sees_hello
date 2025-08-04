'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-4 py-3 bg-[#004b34] fixed w-full z-50">
        <div className="max-w-6xl mx-auto">
          <div className="font-bold text-lg text-white">
            Saint Stephen&apos;s Episcopal School
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-[#003825] mb-4 leading-tight">
              Start your Falcon's journey.
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Explore programs that fit you in 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center px-10 py-4 bg-[#003825] text-white font-medium text-lg rounded-full hover:bg-[#004b34] transition-all duration-200"
              >
                Take the Quiz
              </Link>
              
              <a
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1pPQ9xNbaHdCjn0RLmWLqhkuL5ePgy2tEp6YAT6tCvHG8emnJQr3gayPfmsnOPCbze_Q_ccJcD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 bg-white border-2 border-[#003825] text-[#003825] font-medium text-lg rounded-full hover:bg-gray-50 transition-all duration-200"
              >
                Book Tour
              </a>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Value Props Grid - Shared Borders */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 border-t border-l border-dotted border-gray-300">
            
            {/* Student Body - Large */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-12 sm:col-span-7 md:col-span-4 lg:col-span-4 row-span-1 md:row-span-2 border-b border-r border-dotted border-gray-300 p-8 flex flex-col items-center justify-center"
            >
              <div className="text-8xl md:text-9xl font-schraft-medium text-[#003825] mb-2">470</div>
              <p className="text-lg uppercase tracking-wider text-gray-600 font-schraft">Students</p>
              <p className="text-sm text-gray-400 mt-1">Pre-K through Grade 12</p>
            </motion.div>

            {/* Class Size - Asymmetric on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="col-span-7 sm:col-span-5 md:col-span-2 lg:col-span-2 border-b border-r border-dotted border-gray-300 p-6 flex flex-col items-center justify-center"
            >
              <div className="flex items-baseline">
                <span className="text-6xl font-schraft-medium text-[#003825]">9</span>
                <span className="text-3xl font-schraft-medium text-[#003825] ml-1">:1</span>
              </div>
              <p className="text-sm uppercase tracking-wider text-gray-600 mt-2 font-schraft">Student-Teacher Ratio*</p>
            </motion.div>

            {/* College Success - Spans full width on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="col-span-5 sm:col-span-6 md:col-span-2 lg:col-span-2 border-b border-r border-dotted border-gray-300 p-6 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="flex items-baseline justify-center">
                  <span className="text-6xl font-schraft-medium text-[#003825]">100</span>
                  <span className="text-3xl font-schraft-medium text-[#003825]">%</span>
                </div>
                <p className="text-sm uppercase tracking-wider text-gray-600 mt-1 font-schraft">College Acceptance</p>
              </div>
            </motion.div>

            {/* Diversity - Narrow on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="col-span-4 sm:col-span-6 md:col-span-2 lg:col-span-2 row-span-1 sm:row-span-1 md:row-span-2 border-b border-r border-dotted border-gray-300 p-6"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-6 font-schraft">From</p>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-schraft-medium text-[#003825]">12</div>
                  <p className="text-xs text-gray-600 mt-1 font-schraft">Countries</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-schraft-medium text-[#003825]">18</div>
                  <p className="text-xs text-gray-600 mt-1 font-schraft">States</p>
                </div>
              </div>
            </motion.div>

            {/* Marine Science - Wide on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="col-span-8 sm:col-span-6 md:col-span-4 lg:col-span-4 row-span-1 md:row-span-2 border-b border-r border-dotted border-gray-300 p-8"
            >
              <div className="h-full flex flex-col justify-center items-center">
                <div className="text-xs uppercase tracking-wider text-blue-600 mb-2">Living</div>
                <div className="text-6xl md:text-7xl font-schraft-medium text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-[#004b34]">REEF</div>
                <p className="text-sm text-gray-600 mt-3 font-schraft">Marine Science Lab</p>
                <p className="text-xs text-gray-400 mt-1">Research on Campus</p>
              </div>
            </motion.div>

            {/* National Merit - Tiny on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="col-span-3 sm:col-span-3 md:col-span-2 lg:col-span-2 border-b border-r border-dotted border-gray-300 p-6 flex flex-col items-center justify-center"
            >
              <div className="text-5xl font-schraft-medium text-[#d4a017]">52</div>
              <p className="text-xs uppercase tracking-wider text-gray-600 mt-2 font-schraft">National Merit</p>
              <p className="text-xs uppercase tracking-wider text-gray-600 font-schraft">Finalists**</p>
            </motion.div>

            {/* Athletics - Spans most width on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="col-span-9 sm:col-span-9 md:col-span-6 lg:col-span-6 border-b border-r border-dotted border-gray-300 p-6"
            >
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <div className="text-5xl font-schraft-medium text-[#003825]">20</div>
                  <p className="text-xs uppercase tracking-wider text-gray-600 mt-1 font-schraft">State Titles</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-schraft-medium text-[#003825]">19</div>
                  <p className="text-xs uppercase tracking-wider text-gray-600 mt-1 font-schraft">Sports</p>
                </div>
              </div>
            </motion.div>

            {/* STEAM Center - Medium on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-4 border-b border-r border-dotted border-gray-300 p-6"
            >
              <div className="text-center">
                <div className="text-5xl font-schraft-medium text-[#d4a017]">STEAM</div>
                <p className="text-sm uppercase tracking-wider text-gray-600 mt-2 font-schraft">Innovation Center</p>
              </div>
            </motion.div>

            {/* Niche Grade - Small on mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="col-span-6 sm:col-span-2 md:col-span-2 lg:col-span-2 border-b border-r border-dotted border-gray-300 p-6 flex flex-col items-center justify-center"
            >
              <div className="text-6xl font-schraft-medium text-[#003825]">A+</div>
              <p className="text-xs uppercase tracking-wider text-gray-600 mt-1 font-schraft">Niche.com</p>
              <p className="text-xs text-gray-400 font-schraft">Rating</p>
            </motion.div>

          </div>
          
          {/* Modifiers */}
          <div className="mt-6 text-xs text-gray-500 text-right pr-4">
            <p>*High School</p>
            <p>**Since 2005</p>
          </div>
        </div>
      </section>

    </div>
  );
}
