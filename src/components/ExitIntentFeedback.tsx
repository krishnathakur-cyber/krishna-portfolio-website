import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Check, Eye } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function ExitIntentFeedback() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [liked, setLiked] = useState('');
  const [improvement, setImprovement] = useState('');
  const [recommend, setRecommend] = useState<'Yes' | 'No'>('Yes');
  const [isSending, setIsSending] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Track dismissals locally so we don't annoy users continuously
  const dismissedRef = useRef(false);

  useEffect(() => {
    // Check if user already gave context in the same cache session
    const feedbackGiven = localStorage.getItem('portfolio_feedback_given') === 'true';
    if (feedbackGiven) return;

    // A. Desktop trigger: cursor exits top boundary
    const handleMouseLeave = (e: MouseEvent) => {
      if (dismissedRef.current || isOpen) return;
      if (e.clientY < 15) {
        setIsOpen(true);
      }
    };

    // B. Desktop trigger: Inactivity timer (45 seconds)
    let inactivityTimer = setTimeout(() => {
      if (!dismissedRef.current && !isOpen) {
        setIsOpen(true);
      }
    }, 45000);

    const resetInactivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!dismissedRef.current && !isOpen) {
          setIsOpen(true);
        }
      }, 45000);
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    document.addEventListener('mouseleave', handleMouseLeave);

    // C. Mobile triggers:
    // Scroll > 70% of total height
    const handleScroll = () => {
      if (dismissedRef.current || isOpen) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const percent = (scrollTop / docHeight) * 100;
        if (percent > 70) {
          setIsOpen(true);
        }
      }
    };

    // Mobile Time trigger (spent > 60 seconds)
    const timeOnSiteTimer = setTimeout(() => {
      if (!dismissedRef.current && !isOpen) {
        setIsOpen(true);
      }
    }, 60000);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(timeOnSiteTimer);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const handleClose = () => {
    dismissedRef.current = true;
    setIsOpen(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorText('Please select a star rating first.');
      return;
    }

    setIsSending(true);
    setErrorText('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          liked,
          improvement,
          recommend,
        }),
      });

      if (!response.ok) {
        const d = await response.json();
        throw new Error(d.error || 'Failed to submit feedback.');
      }

      setHasSubmitted(true);
      localStorage.setItem('portfolio_feedback_given', 'true');
      
      // Auto close success layout after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      console.warn('⚠️ Server feedback submission failed, falling back to local storage cache:', err?.message || err);
      try {
        const cachedFeedback = JSON.parse(localStorage.getItem('krishna_portfolio_local_feedback') || '[]');
        cachedFeedback.push({
          rating,
          liked,
          improvement,
          recommend,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('krishna_portfolio_local_feedback', JSON.stringify(cachedFeedback));
        localStorage.setItem('portfolio_feedback_given', 'true');
        
        // Show success screen for local fallback mode
        setHasSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } catch (cacheErr) {
        console.error('❌ Failed to cache feedback in local storage:', cacheErr);
        setErrorText(err?.message || 'Transaction fault. Storing locally failed.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const isLight = theme === 'light';

  const bgCardClass = isLight 
    ? "relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-400 bg-[#FAFBF6] p-6 sm:p-8 shadow-[0_15px_50px_rgba(16,185,129,0.25)] z-10 select-none text-emerald-950"
    : "relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-[#070913] p-6 sm:p-8 shadow-2xl z-10 select-none text-white";

  const closeBtnClass = isLight
    ? "absolute top-4 right-4 p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:text-emerald-900 hover:border-emerald-500 duration-200 cursor-pointer"
    : "absolute top-4 right-4 p-1.5 rounded-lg border border-gray-900 bg-slate-950 text-gray-500 hover:text-white hover:border-violet-500 duration-200 cursor-pointer";

  const titleTextClass = isLight
    ? "text-xl sm:text-2xl font-display font-bold text-emerald-900 tracking-tight pt-1"
    : "text-xl sm:text-2xl font-display font-bold text-white tracking-tight pt-1";

  const descTextClass = isLight
    ? "text-xs text-emerald-700 font-medium"
    : "text-xs text-gray-400 font-medium";

  const labelClass = isLight
    ? "block text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider"
    : "block text-xs font-mono font-bold text-gray-500 uppercase tracking-wider";

  const inputClass = isLight
    ? "w-full px-4 py-2.5 border border-emerald-200 rounded-xl bg-emerald-50/50 text-xs text-emerald-950 placeholder-emerald-400/60 focus:outline-none focus:border-emerald-500"
    : "w-full px-4 py-2.5 border border-gray-800 rounded-xl bg-slate-900/20 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500";

  const ratingBtnClass = isLight
    ? "p-1 rounded-md bg-emerald-50/70 border border-emerald-200 hover:border-emerald-500 transition-all cursor-pointer"
    : "p-1 rounded-md bg-slate-900/40 border border-gray-850 hover:border-violet-400 transition-all cursor-pointer";

  const starClass = (starNum: number) => {
    const activeVal = hoverRating || rating;
    if (starNum <= activeVal) {
      return 'text-amber-500 fill-amber-500';
    }
    return isLight ? 'text-emerald-200 fill-none' : 'text-gray-750 fill-none';
  };

  const yesBtnClass = recommend === 'Yes'
    ? (isLight ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-emerald-950/20 border-emerald-500 hover:border-emerald-400 text-emerald-400')
    : (isLight ? 'bg-emerald-50/30 border-emerald-100/55 text-emerald-700 hover:text-emerald-900' : 'bg-slate-900/30 border-gray-800 text-gray-400 hover:text-gray-200');

  const noBtnClass = recommend === 'No'
    ? (isLight ? 'bg-rose-600 text-white border-rose-700' : 'bg-rose-950/20 border-rose-500 hover:border-rose-400 text-rose-400')
    : (isLight ? 'bg-emerald-50/30 border-emerald-100/55 text-emerald-700 hover:text-emerald-900' : 'bg-slate-900/30 border-gray-800 text-gray-400 hover:text-gray-200');

  const submitBtnClass = isLight
    ? "w-full py-3.5 rounded-xl bg-emerald-600 border border-emerald-700/20 text-white font-sans text-xs font-bold tracking-wide hover:bg-emerald-700 duration-200 cursor-pointer disabled:opacity-50 shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
    : "w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500/20 text-white font-sans text-xs font-bold tracking-wide hover:opacity-95 duration-200 cursor-pointer disabled:opacity-50";

  const successTitleClass = isLight ? "text-lg font-display font-extrabold text-[#064E3B]" : "text-lg font-display font-extrabold text-white";
  const successDescClass = isLight ? "text-xs text-emerald-800 max-w-sm" : "text-xs text-gray-400 max-w-sm";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop with high-contrast cinematic blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={bgCardClass}
          >
            {/* Top Close button icon */}
            <button
              onClick={handleClose}
              className={closeBtnClass}
              title="Dismiss Survey"
            >
              <X className="w-4 h-4" />
            </button>

            {!hasSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                <div className="text-center space-y-1">
                  <span className={`font-mono text-[9px] uppercase tracking-widest font-bold border px-2 py-0.5 rounded ${
                    isLight 
                      ? 'text-emerald-600 bg-emerald-100/50 border-emerald-200/50' 
                      : 'text-violet-400 bg-violet-950/20 border-violet-500/10'
                  }`}>
                    EXIT_INTENT_RADAR
                  </span>
                  <h3 className={titleTextClass}>
                    Wait... Before You Go!
                  </h3>
                  <p className={descTextClass}>
                    Please spare 20 seconds to refine my system parameters.
                  </p>
                </div>

                {/* Rating Input Zone */}
                <div className="space-y-2 text-center">
                  <label className={labelClass}>
                    Star Rating (1 - 5)
                  </label>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={ratingBtnClass}
                      >
                        <Star className={`w-7 h-7 duration-205 transition-all ${starClass(star)}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommend Input Zone (Yes / No) */}
                <div className="space-y-1.5">
                  <label className={`${labelClass} text-center`}>
                    Would you recommend this portfolio?
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-1">
                    <button
                      type="button"
                      onClick={() => setRecommend('Yes')}
                      className={`py-2 px-4 rounded-xl border font-mono text-xs font-semibold cursor-pointer select-none transition-all ${yesBtnClass}`}
                    >
                      Yes, highly
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecommend('No')}
                      className={`py-2 px-4 rounded-xl border font-mono text-xs font-semibold cursor-pointer select-none transition-all ${noBtnClass}`}
                    >
                      No, not now
                    </button>
                  </div>
                </div>

                {/* What did you like */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    What caught your attention?
                  </label>
                  <input
                    type="text"
                    value={liked}
                    onChange={(e) => setLiked(e.target.value)}
                    placeholder="e.g., 3D canvas particles, case studies, clean aesthetics..."
                    className={inputClass}
                  />
                </div>

                {/* Improvement suggestions */}
                <div className="space-y-1.5">
                  <label className={labelClass}>
                    Suggestions for improvement?
                  </label>
                  <input
                    type="text"
                    value={improvement}
                    onChange={(e) => setImprovement(e.target.value)}
                    placeholder="e.g., add terminal theme, improve page load, Python topics..."
                    className={inputClass}
                  />
                </div>

                {errorText && (
                  <p className="text-xs text-rose-400 font-semibold text-center bg-rose-950/20 border border-rose-500/10 py-2 rounded-lg">
                    {errorText}
                  </p>
                )}

                {/* Submitting button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className={submitBtnClass}
                >
                  {isSending ? 'Transmitting Data...' : 'Submit System Feedback'}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isLight 
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-600'
                    : 'bg-emerald-950/20 border border-emerald-500/20 text-emerald-400'
                }`}>
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className={successTitleClass}>
                    Feedback Received Successfully!
                  </h4>
                  <p className={successDescClass}>
                    Thank you, your telemetry metrics have been calibrated. Safe travels through the interface grids!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
