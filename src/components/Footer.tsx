import { MouseEvent } from 'react';
import { Shield, ChevronUp, Cpu } from 'lucide-react';

export default function Footer({ onAdminClick }: { onAdminClick?: () => void }) {
  const handleBackToTop = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer
      id="footer"
      className="py-10 bg-[#080B11] border-t border-gray-900 text-gray-400 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo Brand copyright block */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-gray-800 flex items-center justify-center text-violet-400 font-bold shadow shadow-violet-600/5">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-left font-mono">
              <p className="text-xs font-bold text-white tracking-widest uppercase">
                Krishna Singh
              </p>
              <p className="text-[9px] text-gray-500 font-semibold tracking-wide">
                © 2026 // ALL SYSTEM INFRASTRUCTURE ACTIVE
              </p>
            </div>
          </div>

          {/* Verification parameter badge / Admin Portal Trigger */}
          <button
            onClick={onAdminClick}
            className="font-mono text-[9px] text-gray-500 hover:text-cyan-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-full border border-gray-900 duration-200 transition-colors cursor-pointer"
            title="Access Secured Admin Telemetry Console"
          >
            <Cpu className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>SHA-256 INTEGRITY // SECURED_ENTRY_PORTAL</span>
          </button>

          {/* Quick Back to top */}
          <button
            onClick={handleBackToTop}
            id="back-to-top-footer"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 hover:text-white transition-colors duration-250 cursor-pointer focus:outline-none"
          >
            <span>Back to master head</span>
            <ChevronUp className="w-4 h-4 shrink-0 transition-transform hover:-translate-y-0.5" />
          </button>

        </div>
      </div>
    </footer>
  );
}
