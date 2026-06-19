import { motion } from 'motion/react';
import { personalInfo } from '../data';
import { Terminal, ShieldCheck, MapPin, Database, Code, Globe2 } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: Code,
      title: 'Python Development',
      description: 'Writing functional scripts, concurrent processes, automated e-commerce workflows, Tkinter UI programs, and Matplotlib reports.',
      color: 'border-cyan-500/10 hover:border-cyan-500/30 text-cyan-400 bg-cyan-950/10'
    },
    {
      icon: Globe2,
      title: 'Frontend Experiences',
      description: 'Building modern responsive interfaces using React, Tailwind CSS, high-fidelity layouts, and custom interactive components.',
      color: 'border-violet-500/10 hover:border-violet-500/30 text-violet-400 bg-violet-950/10'
    },
    {
      icon: Database,
      title: 'Database & Backend',
      description: 'Designing structured datastores with MySQL, MongoDB, and SQLite, and orchestrating full-stack Node & Express routing APIs.',
      color: 'border-rose-500/10 hover:border-rose-500/30 text-rose-400 bg-rose-950/10'
    }
  ];

  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden bg-[#0D1220] dark:bg-[#0D1220] border-t border-gray-900"
    >
      {/* Visual background details */}
      <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-violet-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center md:text-left mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.whoami()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Who is <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Krishna Singh?</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto md:mx-0" />
        </div>

        {/* Info Grid (Left: Bio Terminal, Right: Graphic representation) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Bio Terminal / Story (Left, cols: 7) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-200">
              "I build practical software solutions using Python, databases, and modern web technologies to solve real-world problems."
            </h3>
            
            <p className="text-gray-450 leading-relaxed font-sans text-base sm:text-lg">
              {personalInfo.bio}
            </p>

            <p className="text-gray-400 leading-relaxed font-sans text-base">
              Driven by a love for programming and systems engineering, I focus on building functional software interfaces, managing backend databases, and resolving logical puzzles. By pursuing a BCA degree at MCU University, Bhopal, I couple rigorous computer application studies with proactive personal project laboratories.
            </p>

            {/* Geographical Card & Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3.5 p-4 rounded-xl border border-gray-800 bg-slate-900/60 transition-all hover:bg-slate-900/90 hover:border-gray-700/60 duration-300 shadow">
                <MapPin className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="font-mono text-[10px] tracking-wider uppercase font-semibold text-gray-500 leading-tight">Location</h4>
                  <p className="text-sm font-semibold text-gray-200 mt-1">Farrukhabad, UP, India</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-xl border border-gray-800 bg-slate-900/60 transition-all hover:bg-slate-900/90 hover:border-gray-700/60 duration-300 shadow">
                <Globe2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-mono text-[10px] tracking-wider uppercase font-semibold text-gray-500 leading-tight">Coordinates</h4>
                  <p className="text-sm font-semibold text-gray-200 mt-1">27.38° N / 79.58° E</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Shell Dashboard (Right, cols: 5) */}
          <div className="lg:col-span-5">
            <div className="relative p-5 rounded-2xl border border-gray-850 bg-slate-950/90 shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-between box-glow-cyan">
              <div className="absolute top-0 right-0 p-8 text-cyan-400/5 select-none font-mono text-8xl font-bold tracking-tighter">
                DEV
              </div>
              
              {/* Shell Top */}
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 border-b border-gray-850 pb-3">
                  <Terminal className="w-4 h-4 text-violet-400" />
                  <span className="font-mono text-xs text-violet-400 font-bold">krishna@mcu-workstation:~$</span>
                </div>

                <div className="font-mono text-xs space-y-3.5 text-gray-300 leading-relaxed">
                  <div>
                    <span className="text-cyan-400 font-bold mr-1.5">$</span> whoami
                    <p className="text-emerald-400 mt-1 font-semibold">krishna_singh_dev (BCA_Student)</p>
                  </div>

                  <div>
                    <span className="text-cyan-400 font-bold mr-1.5">$</span> cat credentials.json
                    <div className="pl-3.5 mt-1 border-l border-cyan-500/20 text-gray-400 text-[11px] leading-normal font-medium grid grid-cols-2 gap-y-1 select-none">
                      <span>{"{"}</span> <span className="invisible">{"}"}</span>
                      <span className="text-pink-400">"status":</span> <span>"Learning_Daily",</span>
                      <span className="text-pink-400">"focus":</span> <span>"Python_&_Frontend",</span>
                      <span className="text-pink-400">"university":</span> <span>"MCU_Bhopal",</span>
                      <span className="text-pink-400">"locale":</span> <span>"Farrukhabad",</span>
                      <span>{"}"}</span> <span className="invisible">{"{"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-cyan-400 font-bold mr-1.5">$</span> echo $PASSIONS
                    <p className="text-amber-400 mt-1">Code_Databases_&_Real_World_Solutions</p>
                  </div>
                </div>
              </div>

              {/* Status footer inside the shell */}
              <div className="flex items-center gap-1.5 pt-4 text-[10px] font-mono select-none text-gray-500 border-t border-gray-850 mt-4 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SERVER_NODE_BOUND_ACTIVE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {highlights.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border bg-slate-900/35 transition-all duration-300 ${item.color} shadow hover:-translate-y-1`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border border-violet-500/10 bg-slate-950/60 shadow">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-gray-200 mb-2 font-display">{item.title}</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans font-medium">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
