import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon, Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailNode {
  x: number;
  y: number;
  alpha: number;
  char: string;
  size: number;
}

export default function CyberEffects() {
  const { theme, toggleTheme } = useTheme();
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailRef = useRef<TrailNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });
  const [clickSound, setClickSound] = useState<HTMLAudioElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize synth beep feedback for interactive hacker operations
  useEffect(() => {
    // Generate simple synth beep to avoid loading heavy external mp3 assets
    if (typeof window !== 'undefined') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtx?.close(); // init query state
      } catch (err) {
        // Safe query guard
      }
    }
  }, []);

  const triggerHackerBeep = (freq = 880, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context block safeguard
    }
  };

  // Cursor trail effect for Bright Hacker mode
  useEffect(() => {
    if (theme !== 'light') {
      // Clear trail when dark theme is on
      trailRef.current = [];
      return;
    }

    const canvas = cursorCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const dist = Math.hypot(mouseRef.current.x - mouseRef.current.lastX, mouseRef.current.y - mouseRef.current.lastY);
      
      // Spawn new node on mouse movements
      if (dist > 18) {
        const hexChars = '0123456789ABCDEF01'.split('');
        const randomChar = hexChars[Math.floor(Math.random() * hexChars.length)];
        
        trailRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          alpha: 1.0,
          char: randomChar,
          size: 10 + Math.random() * 6
        });

        mouseRef.current.lastX = mouseRef.current.x;
        mouseRef.current.lastY = mouseRef.current.y;

        // Caps max trail length to maintain high FPS performance
        if (trailRef.current.length > 30) {
          trailRef.current.shift();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rendering glowing line connections between mouse coordinates and particles
      if (trailRef.current.length > 0) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        
        ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
        for (let i = trailRef.current.length - 1; i >= 0; i--) {
          ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
        }
        ctx.stroke();
      }

      // Render individual nodes of the digital trail
      for (let i = trailRef.current.length - 1; i >= 0; i--) {
        const node = trailRef.current[i];
        node.alpha -= 0.025; // Decaying trail factor

        if (node.alpha <= 0) {
          trailRef.current.splice(i, 1);
          continue;
        }

        ctx.font = `bold ${node.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(0, 255, 136, ${node.alpha * 0.7})`;
        
        ctx.shadowColor = 'rgba(0, 255, 136, 0.4)';
        ctx.shadowBlur = 8;
        
        ctx.fillText(node.char, node.x, node.y);
        ctx.shadowBlur = 0; // reset
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  const handleToggle = () => {
    // Synth trigger feedback
    if (theme === 'dark') {
      triggerHackerBeep(987, 0.14);
      setTimeout(() => triggerHackerBeep(1318, 0.18), 80);
    } else {
      triggerHackerBeep(659, 0.12);
      setTimeout(() => triggerHackerBeep(523, 0.15), 60);
    }
    toggleTheme();
  };

  return (
    <>
      {/* 1. Custom SVG filters for hacker glitched texts and analog grain overlays */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="cyber-hacker-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 1 0 0 0   0 0 0 0 0  0 0 0 0.08 0" />
            <feComposite operator="in" in2="SourceGraphic" />
            <feBlend mode="multiply" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>

      {/* 2. Interactive trail canvas – visible only during Light Hacker Mode */}
      {theme === 'light' && (
        <>
          <canvas
            ref={cursorCanvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-screen opacity-90 hidden sm:block"
          />
          <div className="cyber-scanline" aria-hidden="true" />
        </>
      )}

      {/* 3. Floating Premium Cyberpunk Hacker Theme Toggle Button */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className={`hidden md:flex flex-col items-end px-3 py-1.5 rounded-xl border font-mono text-[10px] uppercase leading-none ${
                theme === 'light'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold">
                <Cpu className={`w-3 h-3 ${theme === 'light' ? 'animate-spin text-emerald-400' : 'text-slate-400'}`} />
                <span>{theme === 'light' ? 'SYSTEM: CORRUPTED' : 'SYSTEM: SECURED'}</span>
              </div>
              <span className="text-[8px] mt-0.5 opacity-65">
                {theme === 'light' ? 'BRIGHT GLITCH ENVIRONMENT' : 'PREMIUM NOIR CANOPY'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleToggle}
          aria-label="Toggle Advanced Hacker Environment"
          className={`group relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 transform active:scale-95 focus:outline-none cursor-pointer ${
            theme === 'light'
              ? 'bg-emerald-400 text-black border-emerald-500 shadow-[0_0_20px_rgba(0,255,136,0.6)]'
              : 'bg-slate-900 border-slate-800 text-cyan-400 shadow-md hover:border-violet-500 hover:shadow-[0_0_18px_rgba(139,92,246,0.3)]'
          }`}
        >
          {/* Pulsing glow ring when in hacker mode */}
          {theme === 'light' && (
            <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-35" />
          )}

          {/* Animated gear/hacker rotating rings */}
          <span className={`absolute -inset-1.5 rounded-full border border-dashed text-stone-500 pointer-events-none transition-transform duration-500 ${
            theme === 'light' ? 'border-emerald-400/20 rotate-180 scale-105' : 'border-transparent scale-90'
          }`} />

          <span className="relative z-10">
            {theme === 'light' ? (
              <Terminal className="w-5 h-5 animate-pulse" />
            ) : (
              <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
