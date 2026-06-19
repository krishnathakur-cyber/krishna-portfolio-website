import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projectsData } from '../data';
import { Project } from '../types';
import { Github, Folder, ShieldAlert, Zap, Server, ChevronDown, ChevronUp, CheckCircle, Plus, Eye, ExternalLink, ShoppingBag, Film, Layers } from 'lucide-react';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'automation' | 'api' | 'security'>('all');
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web & E-Commerce' },
  ];

  const filteredProjects = projectsData.filter((proj) => {
    if (activeFilter === 'all') return true;
    return proj.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'automation':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'web':
        return <Folder className="w-5 h-5 text-emerald-400" />;
      default:
        return <Server className="w-5 h-5 text-violet-400" />;
    }
  };

  const getProjectGraphicIcon = (id: string) => {
    switch (id) {
      case 'q2-furniture':
        return <ShoppingBag className="w-7 h-7 text-violet-400" />;
      case 'marvel-verse':
        return <Film className="w-7 h-7 text-cyan-400" />;
      default:
        return <Layers className="w-7 h-7 text-gray-400" />;
    }
  };

  const toggleCaseStudy = (id: string) => {
    if (selectedCaseStudyId === id) {
      setSelectedCaseStudyId(null);
    } else {
      setSelectedCaseStudyId(id);
    }
  };

  return (
    <section
      id="projects"
      className="py-24 relative overflow-hidden bg-[#0D1220] dark:bg-[#0D1220] border-t border-gray-900"
    >
      {/* Visual neon orb */}
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-rose-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-[400px] h-[400px] bg-violet-600/5 blur-[150px] pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <Folder className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.curated_labs()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Case Studies & <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Core Projects</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            Selected engineering cases highlighting target issues, modular designs, and concrete programmatic outcomes.
          </p>
        </div>

        {/* Categories Controls */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id as any);
                setSelectedCaseStudyId(null); // Reset open study on filtered view
              }}
              className={`px-4.5 py-2 rounded-full font-sans text-xs font-bold tracking-wide transition-all focus:outline-none cursor-pointer border ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 border-violet-500 text-white shadow-md shadow-violet-600/20'
                  : 'bg-slate-900/60 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700/80 hover:bg-slate-900'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Layout Grid */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {filteredProjects.map((project, index) => {
            const isCaseStudyOpen = selectedCaseStudyId === project.id;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-gray-800 bg-slate-950/45 overflow-hidden transition-all duration-300 hover:border-gray-700/50 hover:bg-slate-950/70"
                style={{
                  boxShadow: isCaseStudyOpen ? `0 4px 30px rgba(124, 58, 237, 0.08)` : 'none'
                }}
              >
                <div className="flex flex-col lg:flex-row items-stretch">
                  {/* Left Column: Premium Visual Thumbnail Placeholder with specialized CSS gradients & Lucide icons */}
                  <div className="lg:w-64 shrink-0 relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/95 p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-900 group select-none">
                    {/* Background glows */}
                    <div 
                      className="absolute w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none -top-6 -left-6" 
                      style={{ backgroundColor: project.accentColor || '#7C3AED' }}
                    />
                    <div 
                      className="absolute w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none -bottom-6 -right-6" 
                      style={{ backgroundColor: project.accentColor || '#06B6D4' }}
                    />
                    {/* Technical pattern overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                      {/* Stylized rounded graphic base layout */}
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-950 border border-gray-800 shadow-xl group-hover:scale-105 duration-300 transition-all"
                        style={{ boxShadow: `0 4px 20px -3px ${project.accentColor}33` }}
                      >
                        {getProjectGraphicIcon(project.id)}
                      </div>
                      
                      <div className="space-y-1">
                        <span 
                          className="font-mono text-[9px] tracking-widest uppercase font-bold text-gray-500 animate-pulse"
                        >
                          Module Registry
                        </span>
                        <div className="text-xs font-semibold text-gray-300 font-display">
                          {project.subtitle}
                        </div>
                      </div>

                      {/* Cool interactive mini badge */}
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[8.5px] tracking-wider uppercase font-semibold bg-emerald-950/20 border border-emerald-500/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>operational_node</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Master summary info block */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-950/20">
                    <div className="space-y-3.5 flex-1 w-full">
                      {/* Badge header */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-gray-800">
                          {getIcon(project.type)}
                        </div>
                        <div>
                          <h4 className="font-mono text-[9px] tracking-widest uppercase font-bold text-gray-500">
                            {project.type} Case Audit
                          </h4>
                          <h3 className="text-lg sm:text-xl font-display font-extrabold text-white mt-0.5">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400 font-sans leading-relaxed max-w-3xl">
                        {project.description}
                      </p>

                      {/* Technologies Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech.map((techItem) => (
                          <span
                            key={techItem}
                            className="font-mono text-[10px] tracking-wide font-medium px-2 py-0.5 rounded bg-slate-900 border border-gray-800 text-gray-400 select-none"
                          >
                            {techItem}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions buttons panel */}
                    <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-gray-900 pt-4 md:pt-0">
                      <button
                        onClick={() => toggleCaseStudy(project.id)}
                        className={`flex-1 md:flex-none py-2.5 px-4.5 rounded-lg font-sans text-xs font-bold tracking-wide transition-all select-none cursor-pointer flex items-center justify-center gap-2 border w-full text-center ${
                          isCaseStudyOpen
                            ? 'bg-violet-600 border-violet-500 text-white hover:bg-violet-700'
                            : 'bg-slate-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700/80'
                        }`}
                      >
                        <span>{isCaseStudyOpen ? 'Close Audit Details' : 'Analyze Case Study'}</span>
                        {isCaseStudyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <div className="flex flex-row gap-2 w-full justify-between items-center">
                        {project.link && project.link !== '#' && (
                          <a
                            href={project.link}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="flex-1 py-2.5 px-4 rounded-lg font-sans text-xs font-bold tracking-wide transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-930 text-cyan-300 hover:text-white"
                            title="View Live Demo"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="p-2.5 rounded-lg border border-gray-800 bg-slate-900/60 hover:bg-slate-900 hover:border-gray-700/80 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center"
                            title="Inspect Code"
                          >
                            <Github className="w-4.5 h-4.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated expandable Case study detail sub-drawer */}
                <AnimatePresence>
                  {isCaseStudyOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="border-t border-gray-900 bg-slate-950/65 overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Problem card */}
                          <div className="p-5 rounded-xl border border-gray-900 bg-slate-900/20 space-y-2 group">
                            <span className="font-mono text-[9px] font-bold tracking-widest text-rose-500 uppercase block select-none">
                              01 / High Risk Challenge
                            </span>
                            <h4 className="text-sm font-bold text-gray-200 font-display">
                              Critical Inefficiencies
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed font-semibold">
                              {project.problem}
                            </p>
                          </div>

                          {/* Solution card */}
                          <div className="p-5 rounded-xl border border-gray-900 bg-slate-900/20 space-y-2">
                            <span className="font-mono text-[9px] font-bold tracking-widest text-violet-400 uppercase block select-none">
                              02 / Core Solution Implementation
                            </span>
                            <h4 className="text-sm font-bold text-gray-200 font-display">
                              Architectural Design
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed font-semibold">
                              {project.solution}
                            </p>
                          </div>

                          {/* Impact Card */}
                          <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-950/5 space-y-2 shadow-inner">
                            <span className="font-mono text-[9px] font-bold tracking-widest text-emerald-400 uppercase block select-none">
                              03 / Quantifiable Outcomes
                            </span>
                            <h4 className="text-sm font-bold text-gray-200 font-display flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span>Audit Performance</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed font-semibold">
                              {project.impact}
                            </p>
                          </div>

                        </div>

                        {/* Custom project terminal log output display */}
                        <div className="p-5 rounded-xl border border-gray-900 bg-slate-950/90 font-mono text-[10.5px] text-gray-400 space-y-1.5 leading-snug select-none">
                          <div className="text-gray-600 flex items-center gap-1.5 border-b border-gray-900 pb-2 mb-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span>Telemetry Log (Successful Execution Process Output)</span>
                          </div>
                          <div><span className="text-cyan-400">[info]</span> Initializing core testing hooks on project instance id {project.id}...</div>
                          <div><span className="text-cyan-400">[info]</span> Handshaking network protocol modules... PASS</div>
                          <div><span className="text-cyan-400">[info]</span> Running stress audits & parameters injections... 0 leaks detected</div>
                          <div><span className="text-emerald-400">[secure]</span> Completed successfully. Performance metric score: 98/100</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
