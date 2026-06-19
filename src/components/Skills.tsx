import { useState, ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skillsData } from '../data';
import { Skill } from '../types';
import {
  Terminal,
  Cpu,
  FileJson,
  Coffee,
  Database,
  Layers,
  Server,
  Zap,
  Network,
  Activity,
  HardDrive,
  ShieldAlert,
  Monitor,
  Lock,
  Radio,
  Key,
  Box,
  GitBranch,
  Clock,
  CheckSquare,
  Sparkles
} from 'lucide-react';

// Help helper to match dynamic strings to standard Lucide React icons
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Terminal,
  Cpu,
  FileJson,
  Coffee,
  Database,
  Layers,
  Server,
  Zap,
  Network,
  Activity,
  HardDrive,
  ShieldAlert,
  Monitor,
  Lock,
  Radio,
  Key,
  Box,
  GitBranch,
  Clock,
  CheckSquare,
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'languages' | 'backend' | 'cybersecurity' | 'tools-devops'>('all');

  const categories = [
    { id: 'all', label: 'All Protocols' },
    { id: 'languages', label: 'Languages' },
    { id: 'backend', label: 'Backend Development' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'tools-devops', label: 'DevOps & Tools' },
  ];

  const filteredSkills = skillsData.filter((skill) => {
    if (activeCategory === 'all') return true;
    return skill.category === activeCategory;
  });

  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden bg-[#0B0F19] dark:bg-[#0B0F19] border-t border-gray-900"
    >
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.core_attributes()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Technical <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Power Matrix</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            A comprehensive matrix of programming languages, automated backend modules, penetration setups, and DevOps tools.
          </p>
        </div>

        {/* Category Filters Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-md shadow-violet-600/20'
                  : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700/80 hover:bg-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Interactive Skills Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const DynamicIcon = iconMap[skill.iconName] || Terminal;
              return (
                <motion.div
                  layout
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                  className="p-5 rounded-2xl border border-gray-800 bg-slate-900/40 hover:bg-slate-900/85 hover:border-gray-700/60 duration-300 transition-all shadow group"
                >
                  <div className="flex items-center justify-between mb-4">
                    {/* Icon frame */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-violet-500/10 bg-slate-950/70 text-violet-400 group-hover:text-cyan-400 group-hover:border-cyan-400/20 group-hover:scale-105 duration-300 transition-all">
                      <DynamicIcon className="w-5 h-5" />
                    </div>
                    {/* Level Badge Percentage */}
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-950/60 text-cyan-400 border border-cyan-400/10 select-none">
                      {skill.level}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-200 mb-3 group-hover:text-white transition-colors font-display tracking-tight">
                    {skill.name}
                  </h3>

                  {/* Level Progress Slider */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400"
                      />
                    </div>
                    <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 font-semibold uppercase tracking-wider uppercase pt-1">
                      <span>Beginner</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
