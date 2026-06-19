import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { personalInfo } from '../data';
import { Terminal, Shield, ArrowDown, ExternalLink, Code } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { downloadResumePDF } from '../utils/pdfGenerator';
import TypingText from './TypingText';

export default function Hero() {
  const { theme } = useTheme();
  
  const roles = [
    'Python Developer',
    'Frontend Developer',
    'BCA Student',
    'Problem Solver',
    'Cybersecurity Enthusiast',
  ];

  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
        left: 0
      });
    }
  };

  const commandLines = [
    { text: 'import sys, sqlite3, json', color: 'text-violet-500' },
    { text: 'class PortfolioSystem:', color: 'text-cyan-400' },
    { text: '    def __init__(self, developer):', color: 'text-pink-400' },
    { text: '        self.name = "Krishna Singh"', color: 'text-gray-300' },
    { text: '        self.program = "BCA_2024_2027"', color: 'text-gray-300' },
    { text: '    def start_pipeline(self):', color: 'text-amber-400' },
    { text: '        print(f"Loading custom UX for: {self.name}")', color: 'text-green-400' },
    { text: '        for skill in ["Python", "React", "SQL"]: ', color: 'text-violet-400' },
    { text: '            self.initialize_stack(skill)', color: 'text-cyan-400' },
    { text: '    def initialize_stack(self, tech):', color: 'text-amber-400' },
    { text: '        # Direct terminal injection status', color: 'text-gray-500' },
    { text: '        print(f"Module {tech} online!")', color: 'text-green-400' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0F19] text-gray-100 dark:bg-[#0B0F19] transition-colors duration-300"
    >
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Neon purple blurred glow circle */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-violet-600/10 dark:bg-violet-600/10 blur-[90px] pointer-events-none" />
      {/* Neon cyan blurred glow circle */}
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content (Left, cols: 7) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Status Batch */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 dark:bg-slate-950/90 border border-violet-500/20 text-xs font-semibold uppercase text-violet-400 tracking-wider shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Seeking Innovative Interplay of Code & Automation</span>
            </motion.div>

            {/* Name and Designation */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white mb-2"
              >
                {theme === 'light' ? (
                  <span className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1">
                    <span className="text-[#064E3B]">Hi, I'm</span>
                    <span className="text-emerald-500 font-extrabold">
                      <TypingText text={personalInfo.name} speed={70} />
                    </span>
                  </span>
                ) : (
                  <>
                    Hi, I'm{' '}
                    <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent text-glow font-extrabold">
                      {personalInfo.name}
                    </span>
                  </>
                )}
              </motion.h1>

              {/* Animated Role Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 h-10 select-none text-base sm:text-xl font-mono"
              >
                <span className="text-gray-400 text-sm sm:text-base font-semibold uppercase tracking-wider">I am a</span>
                <div className="relative overflow-visible inline-block h-8 w-64 text-center lg:text-left">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roleIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 right-0 lg:right-auto text-gradient bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent font-extrabold"
                    >
                      {roles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Introduction - strict copy from prompt */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-2xl mx-auto lg:mx-0 text-gray-300 font-sans leading-relaxed text-sm sm:text-base md:text-md text-justify sm:text-center lg:text-left"
            >
              Passionate Python developer with hands-on experience in database management, frontend technologies, and modern web development. I build efficient, secure, and user-focused software solutions that deliver meaningful digital experiences.
            </motion.p>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 pt-3 border-t border-gray-800/40"
            >
              <div className="text-center lg:text-left">
                <span className="block text-xl sm:text-2xl font-display font-bold text-violet-400">2+</span>
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-gray-500">Major Projects</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-xl sm:text-2xl font-display font-bold text-cyan-400">7+</span>
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-gray-500">Technologies Used</span>
              </div>
              <div className="text-center lg:text-left col-span-2 sm:col-span-1">
                <span className="block text-xl sm:text-2xl font-display font-bold text-pink-400">3+</span>
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-gray-500">Databases Explored</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={() => handleScrollTo('#projects')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>View Projects</span>
                <Code className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Download beautiful high-fidelity PDF Resume containing exact resume details
                  downloadResumePDF();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all border border-violet-500/30 bg-violet-950/10 hover:bg-violet-950/30 text-violet-300 hover:text-white focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Download Resume</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleScrollTo('#contact')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-sans text-xs font-bold tracking-wide transition-all border border-gray-750 bg-slate-900/50 hover:bg-slate-900 hover:border-gray-500 text-gray-300 hover:text-white focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Contact Me</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>

          {/* Styled Graphical Python Terminal (Right, cols: 5) */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-lg mx-auto rounded-xl border border-gray-800/85 bg-slate-950/85 shadow-2xl overflow-hidden box-glow-purple"
            >
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-900/60 border-b border-gray-850 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="font-mono text-xs tracking-wider font-semibold text-gray-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>krishna_singh_sec.py</span>
                </div>
                <div className="w-8" /> {/* Balance spacer */}
              </div>

              {/* Terminal Code Grid Body */}
              <div className="p-5 font-mono text-[10.5px] sm:text-xs leading-relaxed overflow-x-auto select-none bg-slate-950/90 h-[310px] flex flex-col justify-between">
                <div>
                  <div className="text-gray-500 mb-2"># Initializing automation core daemon</div>
                  <div className="space-y-1">
                    {commandLines.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
                        className={`${line.color} flex items-start`}
                      >
                        <span className="text-gray-600 select-none mr-3 w-4 text-right">
                          {index + 1}
                        </span>
                        <span className="whitespace-pre">{line.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Active input simulation prompt */}
                <div className="flex items-center gap-1.5 text-violet-400 mt-2">
                  <span className="text-cyan-400 font-bold">&gt;&gt;&gt;</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-cyan-400 inline-block line-clamp-1"
                  />
                  <span className="text-[10px] text-gray-500 ml-auto select-none">UTF-8 // ACTIVE</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Floating Pointer Indicator to Scroll Down */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 select-none opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <button
            onClick={() => handleScrollTo('#about')}
            id="scroll-to-about-btn"
            aria-label="Scroll to About"
            className="flex flex-col items-center focus:outline-none"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-gray-400">
              Audit Stream Down
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="mt-1"
            >
              <ArrowDown className="w-4 h-4 text-violet-400" />
            </motion.div>
          </button>
        </div>
      </div>
    </section>
  );
}
