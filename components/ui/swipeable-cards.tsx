'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Card {
  id: string;
  type: 'alumni' | 'faculty';
  content: React.ReactNode;
}

interface SwipeableCardsProps {
  cards: Card[];
  className?: string;
}

export function SwipeableCards({ cards, className = '' }: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const goToCard = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, cards.length - 1)));
  };

  const goToPrevious = () => goToCard(currentIndex - 1);
  const goToNext = () => goToCard(currentIndex + 1);

  // Swipe handlers
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      goToPrevious();
    } else if (info.offset.x < -threshold && currentIndex < cards.length - 1) {
      goToNext();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Cards Container */}
      <div 
        ref={containerRef}
        className="relative overflow-visible mx-auto"
        style={{ maxWidth: '100%' }}
      >
        <div className="relative h-[320px] md:h-[300px]">
          <AnimatePresence initial={false} custom={currentIndex}>
            {cards.map((card, index) => {
              const isActive = index === currentIndex;
              const isPrevious = index === currentIndex - 1;
              const isNext = index === currentIndex + 1;
              const isVisible = isActive || isPrevious || isNext;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={card.id}
                  custom={currentIndex}
                  initial={{ 
                    x: index > currentIndex ? containerWidth : -containerWidth,
                    opacity: 0
                  }}
                  animate={{
                    x: isActive ? 0 : index < currentIndex ? -containerWidth * 0.9 : containerWidth * 0.1,
                    opacity: isActive ? 1 : 0.3,
                    scale: isActive ? 1 : 0.95,
                    zIndex: isActive ? 10 : 0
                  }}
                  exit={{
                    x: index < currentIndex ? -containerWidth : containerWidth,
                    opacity: 0
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  className={`absolute inset-0 ${isNext ? 'pointer-events-none' : ''}`}
                  style={{
                    cursor: isActive ? 'grab' : 'default'
                  }}
                  whileDrag={{ cursor: 'grabbing' }}
                >
                  <div className="h-full">
                    {card.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-20"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}
      
      {currentIndex < cards.length - 1 && (
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow z-20"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => goToCard(index)}
            className={`transition-all ${
              index === currentIndex
                ? 'w-8 h-2 bg-[#004b34] rounded-full'
                : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Swipe Hint */}
      {cards.length > 1 && (
        <p className="text-center text-sm text-gray-500 mt-2 md:hidden">
          Swipe to explore more stories
        </p>
      )}
    </div>
  );
}