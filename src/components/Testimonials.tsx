import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { testimonialsData } from '../data';
import { Quote, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden bg-[#0B0F19] dark:bg-[#0B0F19] border-t border-gray-900"
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>sys.testimonials()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Mentor <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Endorsements</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            Feedback from senior academic advisors and internship technical mentors advocating for my work ethic.
          </p>
        </div>

        {/* Dynamic Slide display */}
        <div className="max-w-4xl mx-auto relative px-4">
          <div className="relative overflow-hidden rounded-2xl border border-gray-850 bg-slate-900/40 p-8 sm:p-12 box-glow-purple">
            {/* Visual quotation sign */}
            <div className="absolute top-6 right-8 text-violet-500/10 pointer-events-none">
              <Quote className="w-24 h-24 stroke-[1.5]" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-6 relative z-10"
              >
                {/* Quote details */}
                <p className="text-gray-300 font-sans tracking-wide text-base sm:text-lg leading-relaxed font-medium italic">
                  "{testimonialsData[currentIndex].quote}"
                </p>

                {/* Profile Header */}
                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-800/50">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 shadow shrink-0 select-none bg-slate-950">
                    <img
                      src={testimonialsData[currentIndex].avatarUrl}
                      alt={testimonialsData[currentIndex].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white font-display">
                      {testimonialsData[currentIndex].name}
                    </h4>
                    <p className="text-xs text-violet-400 dark:text-cyan-400 font-mono font-semibold">
                      {testimonialsData[currentIndex].role} — <span className="text-gray-500 ml-1">{testimonialsData[currentIndex].company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Steer buttons */}
          <div className="flex items-center justify-between mt-8 select-none">
            {/* Dots indicators */}
            <div className="flex items-center gap-2">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'bg-cyan-400 w-6' : 'bg-gray-750 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-gray-850 bg-slate-900/60 hover:bg-slate-900 hover:border-gray-700/80 text-gray-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                aria-label="Previous Endorsement"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-gray-850 bg-slate-900/60 hover:bg-slate-900 hover:border-gray-700/80 text-gray-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                aria-label="Next Endorsement"
              >
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
