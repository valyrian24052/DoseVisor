import React, { useEffect, useRef } from 'react';

const CursorTrail = () => {
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const updateCursorPosition = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add current cursor position to points
      pointsRef.current.push({ ...cursorRef.current });

      // Limit the number of points
      if (pointsRef.current.length > 50) {
        pointsRef.current.shift();
      }

      // Draw the trail
      ctx.beginPath();
      ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);

      for (let i = 1; i < pointsRef.current.length; i++) {
        const point = pointsRef.current[i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.strokeStyle = 'rgba(f, f, f, 0.5)'; // Purple color with opacity
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', updateCursorPosition);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', updateCursorPosition);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default CursorTrail;
