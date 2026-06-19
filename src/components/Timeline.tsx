import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { experienceData } from '../data';
import { Experience } from '../types';
import { Calendar, Briefcase, GraduationCap, MapPin, Milestone, Network, Link2 } from 'lucide-react';

export default function Timeline() {
  const [activeType, setActiveType] = useState<'all' | 'education' | 'jobs' | 'projects'>('all');

  const types = [
    { id: 'all', label: 'Complete Path' },
    { id: 'education', label: 'Academic Milestones' },
    { id: 'jobs', label: 'Commercial Experience' },
    { id: 'projects', label: 'Independent Projects' },
  ];

  const filteredExperience = experienceData.filter((exp) => {
    if (activeType === 'all') return true;
    return exp.type === activeType;
  });

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-5 h-5" />;
      case 'jobs':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Milestone className="w-5 h-5" />;
    }
  };

  const getTimelineStyle = (type: string) => {
    switch (type) {
      case 'education':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20';
      case 'jobs':
        return 'text-violet-400 bg-violet-950/40 border-violet-500/20';
      default:
        return 'text-pink-400 bg-pink-950/40 border-pink-500/20';
    }
  };

  return (
    <section
      id="timeline"
      className="py-24 relative overflow-hidden bg-[#0B0F19] dark:bg-[#0B0F19] border-t border-gray-900"
    >
      {/* Background radial overlays */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-violet-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <Milestone className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.milestones()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Education & <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            Chronology of academic programs, core internships, and ongoing development workflows.
          </p>
        </div>

        {/* Timeline Filter Controls */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-16">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as any)}
              className={`px-4.5 py-2 rounded-full font-sans text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer border ${
                activeType === type.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-md shadow-violet-600/20'
                  : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700/80 hover:bg-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Main Linear Timeline Grid */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main vertical line */}
          <div className="absolute left-[29px] sm:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-violet-600 via-cyan-400 to-transparent opacity-30 pointer-events-none" />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredExperience.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    layout
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.45 }}
                    className="relative flex flex-col sm:flex-row items-start sm:justify-between"
                  >
                    {/* Desktop layout side buffer */}
                    <div className={`hidden sm:block w-[45%] ${isEven ? 'order-1 text-right' : 'order-3 invisible'}`} />

                    {/* Timeline Center Point Indicator Button */}
                    <div className="absolute left-[19px] sm:left-1/2 sm:-translate-x-1/2 z-20 flex items-center justify-center w-6.5 h-6.5 rounded-full border bg-slate-950 text-white shadow-md shadow-violet-600/10"
                      style={{
                        borderColor: exp.type === 'education' ? '#06B6D4' : exp.type === 'jobs' ? '#7C3AED' : '#F43F5E'
                      }}>
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: exp.type === 'education' ? '#06B6D4' : exp.type === 'jobs' ? '#7C3AED' : '#F43F5E'
                        }}
                      />
                    </div>

                    {/* Timeline Detail Card Box */}
                    <div className={`w-full sm:w-[45%] pl-14 sm:pl-0 z-10 ${isEven ? 'order-3' : 'order-1'}`}>
                      <div className="p-6 rounded-2xl border border-gray-800 bg-slate-900/40 hover:bg-slate-900/85 hover:border-gray-700/60 transition-all duration-300 shadow group">
                        
                        {/* Period & Category indicator */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 p-1 px-2 text-[10px] font-mono font-semibold rounded-full border ${getTimelineStyle(exp.type)}`}>
                            {getTimelineIcon(exp.type)}
                            <span className="uppercase tracking-wide">{exp.type}</span>
                          </span>

                          <span className="font-mono text-[11px] font-bold text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{exp.period}</span>
                          </span>
                        </div>

                        {/* Title and Organization */}
                        <h3 className="text-base font-extrabold text-white font-display group-hover:text-violet-400 dark:group-hover:text-cyan-400 transition-colors">
                          {exp.role}
                        </h3>
                        <h4 className="text-sm font-semibold text-gray-300 mt-1 font-sans">
                          {exp.company}
                        </h4>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-sans mt-1.5 mb-4">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{exp.location}</span>
                        </div>

                        {/* Bullet description elements */}
                        <ul className="space-y-2 mt-4 border-t border-gray-800/60 pt-4">
                          {exp.description.map((bullet, bulletIdx) => (
                            <li key={bulletIdx} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
