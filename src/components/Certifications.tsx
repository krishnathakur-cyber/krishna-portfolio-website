import { motion } from 'motion/react';
import { certificationsData } from '../data';
import { Award, ShieldAlert, Star, Cpu, Network, CheckCircle2 } from 'lucide-react';

export default function Certifications() {
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'python':
        return <Cpu className="w-6 h-6 text-cyan-400" />;
      case 'security':
        return <ShieldAlert className="w-6 h-6 text-rose-400" />;
      case 'network':
        return <Network className="w-6 h-6 text-violet-400" />;
      default:
        return <Award className="w-6 h-6 text-pink-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'python':
        return 'border-cyan-500/20 bg-cyan-950/10 hover:border-cyan-400/50 shadow-cyan-500/5';
      case 'security':
        return 'border-rose-500/20 bg-rose-950/10 hover:border-rose-400/50 shadow-rose-500/5';
      case 'network':
        return 'border-violet-500/20 bg-violet-950/10 hover:border-violet-400/50 shadow-violet-500/5';
      default:
        return 'border-pink-500/20 bg-pink-950/10 hover:border-pink-400/50 shadow-pink-500/5';
    }
  };

  return (
    <section
      id="certs"
      className="py-24 relative overflow-hidden bg-[#0D1220] dark:bg-[#0D1220] border-t border-gray-900"
    >
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-violet-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-violet-400">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>sys.certifications()</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Professional <span className="text-gradient bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Credentials</span>
          </h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full mx-auto" />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 font-sans pt-2">
            Industry valid qualifications and structured specializations certifying python development, terminal administration, and defensive threat awareness.
          </p>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {certificationsData.map((cert, index) => {
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-2xl border bg-slate-900/40 hover:bg-slate-950/80 transition-all duration-300 shadow-lg flex flex-col justify-between group ${getBadgeColor(
                  cert.badgeType
                )}`}
              >
                <div className="space-y-4">
                  
                  {/* Badge Top Header */}
                  <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-950 border border-gray-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      {getBadgeIcon(cert.badgeType)}
                    </div>
                    
                    <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none bg-slate-950 px-2 py-1 rounded-full border border-gray-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Certification details */}
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-violet-400">
                      {cert.issuer}
                    </span>
                    <h3 className="text-base font-extrabold text-white font-display group-hover:text-cyan-400 transition-colors tracking-tight leading-snug">
                      {cert.name}
                    </h3>
                  </div>

                </div>

                {/* Sub info footer */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-950 font-sans text-xs select-none">
                  <div className="text-gray-500 font-medium">
                    Issued: <span className="text-gray-300 font-bold">{cert.date}</span>
                  </div>
                  
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      className="text-cyan-400 hover:text-cyan-200 font-bold transition-all flex items-center gap-1 font-mono text-[10px]"
                      aria-label={`Verify certification: ${cert.name}`}
                    >
                      <span>SEC_PROOF</span>
                      <span>&rarr;</span>
                    </a>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
