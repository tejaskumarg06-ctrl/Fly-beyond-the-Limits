import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      growing: boolean;
    }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Seed particles
    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: '#C9A84C', // Gorgeous gold accent
        speedY: -(Math.random() * 0.15 + 0.05), // upward drift
        speedX: (Math.random() * 0.1 - 0.05), // gentle sway
        opacity: Math.random() * 0.5 + 0.1,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        growing: Math.random() > 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(8, 6, 8, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particle stars
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#E8C97A';
        ctx.fill();
        ctx.restore();

        // Physics
        p.y += p.speedY;
        p.x += p.speedX;

        // Pulse opacity
        if (p.growing) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= 0.75) p.growing = false;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0.15) p.growing = true;
        }

        // Reset if drifted off top or sides
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = p.x < 0 ? canvas.width : 0;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none block z-0"
      id="hero-starfield-canvas"
    />
  );
}
