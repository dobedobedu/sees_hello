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
            <h1 className="text-3xl md:text-5xl font-bold text-[#003825] mb-4 leading-tight">
              We promise that every child will be{' '}
              <span className="text-[#004b34]">
                known
              </span>{' '}
              and every child will be{' '}
              <span className="text-[#004b34]">
                valued
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              See how Saint Stephen&apos;s matches your child&apos;s unique strengths with real student success stories.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <Link
                  href="/quiz"
                  className="inline-flex items-center px-8 py-4 bg-[#003825] text-white font-semibold rounded-md hover:bg-[#004b34] transition-all duration-200"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Take 2-Min Quiz
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Link
                  href="/booking"
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-[#003825] text-[#003825] font-semibold rounded-md hover:bg-gray-50 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Tour
                </Link>
              </motion.div>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Find out what SSES can offer your family
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
          >
            <div className="bg-[#004b34] rounded-md p-4 text-white">
              <div className="text-2xl font-bold">100%</div>
              <p className="text-sm opacity-90">College Acceptance</p>
            </div>
            <div className="bg-[#004b34] rounded-md p-4 text-white">
              <div className="text-2xl font-bold">8:1</div>
              <p className="text-sm opacity-90">Student-Teacher Ratio</p>
            </div>
            <div className="bg-[#004b34] rounded-md p-4 text-white">
              <div className="text-2xl font-bold">PreK-12</div>
              <p className="text-sm opacity-90">Full Journey</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 bg-[#003825] mt-12">
        <div className="max-w-2xl mx-auto text-center text-white text-sm">
          <p className="opacity-90">&copy; 2024 Saint Stephen&apos;s Episcopal School</p>
          <p className="mt-1 text-xs opacity-75">Every child known. Every child valued.</p>
        </div>
      </footer>
    </div>
  );
}
