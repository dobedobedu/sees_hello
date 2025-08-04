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
              See how Saint Stephen's fits your child—before you visit
            </h1>
            
            <p className="text-lg text-gray-600 mb-4 max-w-xl mx-auto">
              Personalized matches with real student success stories in 60 seconds
            </p>
            
            {/* Urgency Ribbon */}
            <div className="inline-flex items-center px-3 py-1 bg-[#d4a017]/20 text-[#d4a017] rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Limited tour slots for Spring 2025 • Open House Feb 15
            </div>

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
                <a
                  href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1pPQ9xNbaHdCjn0RLmWLqhkuL5ePgy2tEp6YAT6tCvHG8emnJQr3gayPfmsnOPCbze_Q_ccJcD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-white border-2 border-[#003825] text-[#003825] font-semibold rounded-md hover:bg-gray-50 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Tour
                </a>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Trust Microbar */}
      <section className="py-6 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-6 text-sm"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#d4a017]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              <span className="text-gray-700">
                <strong>100%</strong> College Acceptance • Ivy League & Top Universities
              </span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#d4a017]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                <strong>8:1</strong> Student-Teacher Ratio • Average Class Size 15
              </span>
            </div>
            
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#d4a017]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110--2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                <strong>State Champions</strong> • 15+ Sports • Arts & STEAM Excellence
              </span>
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
