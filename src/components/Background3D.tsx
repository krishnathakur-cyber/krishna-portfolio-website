import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  vz: number;
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Mouse interactive inputs
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  // Rotation states in radians
  const rotRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver for accurate sizing per guidelines
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Config variables
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const nodeCount = dimensions.width < 640 ? 55 : 120; // Scale nodes for performance
    const focalLength = 400; // Focal depth parameter
    const points: Point3D[] = [];

    // Determine colors based on active theme
    const isDark = theme === 'dark';
    const primaryPartColor = isDark ? 'rgba(124, 58, 237, ' : 'rgba(99, 102, 241, '; // Violet / Indigo
    const secondaryPartColor = isDark ? 'rgba(6, 182, 212, ' : 'rgba(13, 148, 136, '; // Cyan / Teal
    const tertiaryPartColor = isDark ? 'rgba(236, 72, 153, ' : 'rgba(225, 29, 72, '; // Pink / Rose

    // Create 3D Coordinates distributed in a double spherical/torus shell
    for (let i = 0; i < nodeCount; i++) {
      // Create some structured geometric points and some randomized ambient ones
      let x = 0, y = 0, z = 0;
      const type = i % 3;
      
      if (type === 0) {
        // Torus / Helix stream formula mesh
        const theta = (i / nodeCount) * Math.PI * 4;
        const phi = (i / nodeCount) * Math.PI * 8;
        const radius = 180 + Math.sin(phi) * 40;
        x = radius * Math.cos(theta);
        y = radius * Math.sin(theta);
        z = Math.sin(phi * 2) * 120;
      } else if (type === 1) {
        // Spherical orbital cluster
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const u = Math.random();
        const r = 200 * Math.cbrt(u); // distributed shell
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      } else {
        // Ambient cloud scatter
        x = (Math.random() - 0.5) * 600;
        y = (Math.random() - 0.5) * 600;
        z = (Math.random() - 0.5) * 600;
      }

      // Assign particle categories
      const randColor = i % 4 === 0 ? primaryPartColor : i % 4 === 1 ? secondaryPartColor : i % 4 === 2 ? tertiaryPartColor : 'rgba(100, 116, 139, ';
      const size = i % 4 === 0 ? 2.5 : i % 4 === 1 ? 1.8 : 1.2;

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: randColor,
        size,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
      });
    }

    // Checking media query for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Ambient rotations velocities (scaled if reduced motion has preference)
    let rotSpeedX = prefersReducedMotion ? 0.0001 : 0.0012;
    let rotSpeedY = prefersReducedMotion ? 0.0002 : 0.0018;
    let rotSpeedZ = prefersReducedMotion ? 0.00005 : 0.0006;

    // Setup for Bright Hacker Mode Canvas Streams/Particles lazily
    const colWidth = dimensions.width < 640 ? 18 : 24;
    const numCols = Math.ceil(dimensions.width / colWidth);
    const columns: { y: number; speed: number; chars: string[]; switchCounter: number }[] = [];
    for (let k = 0; k < numCols; k++) {
      columns.push({
        y: Math.random() * -dimensions.height - 150,
        speed: 1.2 + Math.random() * 2.2,
        chars: Array.from({ length: 10 + Math.floor(Math.random() * 10) }, () =>
          Math.random() > 0.4 ? Math.floor(Math.random() * 2).toString() : Math.floor(Math.random() * 16).toString(16).toUpperCase()
        ),
        switchCounter: 0
      });
    }

    const hexCount = dimensions.width < 640 ? 14 : 35;
    const hexParticles: { x: number; y: number; char: string; vx: number; vy: number; scale: number; pulseSpeed: number; angle: number }[] = [];
    for (let h = 0; h < hexCount; h++) {
      hexParticles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        char: Math.floor(Math.random() * 16).toString(16).toUpperCase(),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        scale: 0.8 + Math.random() * 1.4,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        angle: Math.random() * Math.PI
      });
    }

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      if (theme === 'dark') {
        // --- Dark Theme: Premium Constellation Star Web ---
        // Interpolate real mouse movement coordinates smoothly
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Adjust grid rotation velocities depending on hover
        let currentSpeedX = rotSpeedX;
        let currentSpeedY = rotSpeedY;

        if (mouse.active && !prefersReducedMotion) {
          const factorX = (mouse.y - centerY) / centerY; 
          const factorY = (mouse.x - centerX) / centerX;
          currentSpeedX = rotSpeedX + factorX * 0.0025;
          currentSpeedY = rotSpeedY + factorY * 0.0025;
        }

        rotRef.current.x += currentSpeedX;
        rotRef.current.y += currentSpeedY;
        rotRef.current.z += rotSpeedZ;

        const cosX = Math.cos(rotRef.current.x);
        const sinX = Math.sin(rotRef.current.x);
        const cosY = Math.cos(rotRef.current.y);
        const sinY = Math.sin(rotRef.current.y);
        const cosZ = Math.cos(rotRef.current.z);
        const sinZ = Math.sin(rotRef.current.z);

        // Projecting points array and storing computed positions
        const projected: { sx: number; sy: number; sz: number; color: string; size: number; alpha: number }[] = [];

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];

          // Animate independent point drifts to expand ambient dynamics
          pt.baseX += pt.vx;
          pt.baseY += pt.vy;
          pt.baseZ += pt.vz;

          // Bounded boundaries
          const range = 350;
          if (Math.abs(pt.baseX) > range) pt.vx *= -1;
          if (Math.abs(pt.baseY) > range) pt.vy *= -1;
          if (Math.abs(pt.baseZ) > range) pt.vz *= -1;

          let px = pt.baseX;
          let py = pt.baseY;
          let pz = pt.baseZ;

          // Apply mouse magnetic attraction displacement in 3D
          if (mouse.active) {
            // Map mouse interaction to a 3D bubble field
            const mouseWorldX = (mouse.x - centerX) * 0.8;
            const mouseWorldY = (mouse.y - centerY) * 0.8;
            const dx = px - mouseWorldX;
            const dy = py - mouseWorldY;
            const distSqrt = Math.sqrt(dx * dx + dy * dy);
            if (distSqrt < 140) {
              // Apply subtle gravity vector
              const force = (140 - distSqrt) * 0.12;
              px += (dx / distSqrt) * force;
              py += (dy / distSqrt) * force;
              pz += Math.sin(distSqrt * 0.05) * force;
            }
          }

          // --- Standard Isometric/Perspective 3D Matrix Rotations ---
          // 1. Rotate Y
          let x1 = px * cosY - pz * sinY;
          let z1 = px * sinY + pz * cosY;

          // 2. Rotate X
          let y2 = py * cosX - z1 * sinX;
          let z2 = py * sinX + z1 * cosX;

          // 3. Rotate Z
          let x3 = x1 * cosZ - y2 * sinZ;
          let y3 = x1 * sinZ + y2 * cosZ;

          // Move target along the depth plane to avoid visual overlap
          const transformedZ = z2 + 350; 

          // Skip rendering points completely behind target clipping point
          if (transformedZ <= 0) continue;

          const scale = focalLength / transformedZ;
          const screenX = centerX + x3 * scale;
          const screenY = centerY + y3 * scale;

          // Base opacity depending on perspective Depth (Z) position
          const alpha = Math.max(0.08, Math.min(0.85, 1 - (transformedZ - 100) / 500));

          projected.push({
            sx: screenX,
            sy: screenY,
            sz: transformedZ,
            color: pt.color,
            size: pt.size * scale,
            alpha,
          });
        }

        // Sort points by perspective Depth (Back-to-Front painter algorithm)
        projected.sort((a, b) => b.sz - a.sz);

        // Render connected lines (Constellation networks)
        const maxDistance = dimensions.width < 640 ? 55 : 85;
        
        for (let i = 0; i < projected.length; i++) {
          const p1 = projected[i];
          if (p1.alpha < 0.15) continue; // Skip lines for extremely deep backdrop particles

          // Draw connections starting with neighboring nodes
          const connectionStep = dimensions.width < 640 ? 6 : 4;
          for (let j = i + 1; j < projected.length; j += connectionStep) {
            const p2 = projected[j];
            
            const dx = p1.sx - p2.sx;
            const dy = p1.sy - p2.sy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              // Decaying connection strength matching distance and dual alpha depth
              const lineAlpha = (1 - dist / maxDistance) * Math.min(p1.alpha, p2.alpha) * 0.18;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`; // Soft glowing violet
              ctx.lineWidth = 0.55;
              ctx.moveTo(p1.sx, p1.sy);
              ctx.lineTo(p2.sx, p2.sy);
              ctx.stroke();
            }
          }
        }

        // Render physical particle dots
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.fill();

          // Include simple glowing rings on large nodes
          if (p.size > 2.2 && p.alpha > 0.45) {
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${p.alpha * 0.12})`;
            ctx.fill();
          }
        }
      } else {
        // --- Bright Theme: Futuristic Cyberpunk Hacker Interface ---
        
        // 1. Perspective Grid Animation
        const horizonY = dimensions.height * 0.38;
        const gridSpeed = prefersReducedMotion ? 0.2 : 1.1;
        const gridOffset = (Date.now() * 0.02 * gridSpeed) % 40;
        
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)'; // Light hacker green grid wire lines
        ctx.lineWidth = 1;

        // Draw crawling horizontal perspective lines
        for (let y = 0; y < 14; y++) {
          const progress = (y / 14);
          const exponentialY = horizonY + Math.pow(progress, 2.2) * (dimensions.height - horizonY);
          const withOffset = exponentialY + gridOffset * (progress * 1.5);
          if (withOffset > dimensions.height) continue;
          
          ctx.beginPath();
          ctx.moveTo(0, withOffset);
          ctx.lineTo(dimensions.width, withOffset);
          ctx.stroke();
        }

        // Perspective vanishing lines converging at virtual viewport center
        const gridCols = dimensions.width < 640 ? 10 : 20;
        for (let i = 0; i <= gridCols; i++) {
          const xPos = (dimensions.width / gridCols) * i;
          ctx.beginPath();
          ctx.moveTo(centerX, horizonY);
          ctx.lineTo(xPos, dimensions.height);
          ctx.stroke();
        }

        // 2. Falling Matrix Code Streams
        ctx.font = '10px "JetBrains Mono", monospace';
        for (let col = 0; col < columns.length; col++) {
          const c = columns[col];
          const speedFactor = prefersReducedMotion ? 0.25 : 1.0;
          c.y += c.speed * speedFactor;

          if (c.y - (c.chars.length * 15) > dimensions.height) {
            c.y = -120 - Math.random() * 250;
            c.speed = 1.0 + Math.random() * 2.1;
          }

          c.switchCounter++;
          if (c.switchCounter > (12 + Math.random() * 20)) {
            c.chars.shift();
            c.chars.push(Math.random() > 0.45 ? Math.floor(Math.random() * 2).toString() : Math.floor(Math.random() * 16).toString(16).toUpperCase());
            c.switchCounter = 0;
          }

          const colX = col * colWidth + 4;
          for (let idx = 0; idx < c.chars.length; idx++) {
            const charY = c.y - idx * 15;
            if (charY < -15 || charY > dimensions.height + 15) continue;

            const isHead = idx === 0;
            const alpha = isHead ? 0.38 : Math.max(0.01, 0.22 - idx * 0.018);
            ctx.fillStyle = isHead ? `rgba(16, 185, 129, ${alpha * 1.5})` : `rgba(16, 185, 128, ${alpha})`;
            ctx.fillText(c.chars[idx], colX, charY);
          }
        }

        // 3. Floating Digital Particles and Hexadecimal Characters
        const mouse = mouseRef.current;
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        for (let i = 0; i < hexParticles.length; i++) {
          const hp = hexParticles[i];
          const movementFactor = prefersReducedMotion ? 0.1 : 1.0;
          hp.x += hp.vx * movementFactor;
          hp.y += hp.vy * movementFactor;

          // Virtual borders wrap
          if (hp.x < -20) hp.x = dimensions.width + 20;
          if (hp.x > dimensions.width + 20) hp.x = -20;
          if (hp.y < -20) hp.y = dimensions.height + 20;
          if (hp.y > dimensions.height + 20) hp.y = -20;

          // React to cursor metrics with glowing trails
          if (mouse.active) {
            const dx = hp.x - mouse.x;
            const dy = hp.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              const attraction = (150 - dist) * 0.012;
              hp.x -= (dx / dist) * attraction;
              hp.y -= (dy / dist) * attraction;
            }
          }

          hp.angle += hp.pulseSpeed;
          const alpha = 0.07 + Math.abs(Math.sin(hp.angle)) * 0.15;
          
          ctx.font = `${Math.floor(11 * hp.scale)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fillText(hp.char, hp.x, hp.y);

          // Draw digital constellation webbing for larger elements
          if (i < hexParticles.length - 1 && hp.scale > 1.2) {
            const nextPart = hexParticles[i + 1];
            const dist = Math.sqrt((hp.x - nextPart.x) ** 2 + (hp.y - nextPart.y) ** 2);
            if (dist < 110) {
              ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / 110) * 0.07})`;
              ctx.lineWidth = 0.55;
              ctx.beginPath();
              ctx.moveTo(hp.x, hp.y);
              ctx.lineTo(nextPart.x, nextPart.y);
              ctx.stroke();
            }
          }
        }

        // 4. Random cyber glitch flashes
        if (Math.random() > 0.995 && !prefersReducedMotion) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.025)';
          ctx.fillRect(0, Math.random() * dimensions.height, dimensions.width, Math.random() * 30);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, theme]);

  // Record cursor metrics via global window listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active = true;
    };

    const handleGlobalMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none min-h-screen z-0"
      style={{ overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full opacity-65 dark:opacity-45 transition-all duration-300 pointer-events-none"
      />
    </div>
  );
}
