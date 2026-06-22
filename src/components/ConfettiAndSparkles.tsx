import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface ConfettiRef {
  triggerBurst: (x: number, y: number, count?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'circle' | 'square' | 'triangle' | 'heart' | 'sparkle';
}

const GOLD_PALETTE = [
  '#FCD34D', // amber-300
  '#FBBF24', // amber-400
  '#F59E0B', // amber-500
  '#FFFBEB', // warm champagne
  '#FFFFFF', // white diamonds
];

export const ConfettiAndSparkles = forwardRef<ConfettiRef, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    // Initial sparkles floating in background
    const bgSparklesRef = useRef<{ x: number; y: number; size: number; alpha: number; speed: number; phase: number }[]>([]);

    useEffect(() => {
      // Set up simple background star sparkles
      const sparkles: typeof bgSparklesRef.current = [];
      for (let i = 0; i < 20; i++) {
        sparkles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.4 + 0.1,
          speed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
      bgSparklesRef.current = sparkles;

      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      const animate = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw and update background slow floating sparkles
        bgSparklesRef.current.forEach((s) => {
          s.phase += s.speed;
          const currentAlpha = s.alpha + Math.sin(s.phase) * 0.15;
          ctx.save();
          ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0, currentAlpha)})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#FBBF24';
          // Draw sparkle star (four points)
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - s.size * 2);
          ctx.quadraticCurveTo(s.x, s.y, s.x + s.size * 2, s.y);
          ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + s.size * 2);
          ctx.quadraticCurveTo(s.x, s.y, s.x - s.size * 2, s.y);
          ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - s.size * 2);
          ctx.fill();
          ctx.restore();

          // Float upwards slowly
          s.y -= s.speed * 8;
          if (s.y < -10) {
            s.y = canvas.height + 10;
            s.x = Math.random() * canvas.width;
          }
        });

        // 2. Draw and update active explosion particles
        let particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          // Physics update
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // lower gravity
          p.vx *= 0.96; // drag
          p.vy *= 0.96; // drag
          p.alpha -= 0.025; // fade out faster so it doesn't clutter
          p.rotation += p.rotationSpeed;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          // Draw particle
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;

          // Draw ONLY beautiful gold star sparkles and light bubbles, no heavy circles/squares/triangles
          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Sparkle shape (4 points)
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.2);
            ctx.quadraticCurveTo(0, 0, p.size * 1.2, 0);
            ctx.quadraticCurveTo(0, 0, 0, p.size * 1.2);
            ctx.quadraticCurveTo(0, 0, -p.size * 1.2, 0);
            ctx.quadraticCurveTo(0, 0, 0, -p.size * 1.2);
            ctx.fill();
          }

          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    const triggerBurst = (x: number, y: number, count = 15) => {
      // Limit actual max particles in bursts to prevent user annoyance
      const targetCount = Math.min(count, 20);
      const shapes: Particle['shape'][] = ['sparkle', 'circle', 'sparkle'];
      const newParticles: Particle[] = [];

      for (let i = 0; i < targetCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - (Math.random() * 2);

        newParticles.push({
          x,
          y,
          vx,
          vy,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          size: Math.random() * 6 + 4,
          alpha: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }

      particlesRef.current.push(...newParticles);
    };

    // Forward the method so outside components can trigger programmatically
    useImperativeHandle(ref, () => ({
      triggerBurst,
    }));

    // Handle standard global clicking to make small magical twinkles
    const handleGlobalClick = (e: React.MouseEvent) => {
      // Just a light sparkle under user cursor (3 sparkles max)
      triggerBurst(e.clientX, e.clientY, 3);
    };

    return (
      <div 
        id="global-confetti-wrapper" 
        className="relative w-full h-full overflow-hidden cursor-pointer"
        onClick={handleGlobalClick}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed top-0 left-0 w-full h-full z-50"
        />
        {children}
      </div>
    );
  }
);

ConfettiAndSparkles.displayName = 'ConfettiAndSparkles';
