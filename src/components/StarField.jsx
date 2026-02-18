import { useEffect, useRef } from 'react';

/**
 * Starfield canvas rendered behind the globe.
 * Randomly placed white dots at varying opacities with subtle twinkling.
 */
export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const starCount = 500;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.0 + 0.2,
      baseOpacity: Math.random() * 0.12 + 0.02,
      twinkleSpeed: Math.random() * 0.015 + 0.003,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let frame;
    let tick = 0;

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      tick += 1;

      stars.forEach(star => {
        const twinkle = Math.sin(tick * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.baseOpacity + twinkle * 0.04;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${Math.max(0, opacity)})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
